import { expect, test } from "@playwright/test";

import { BASE_URL, MOCK_OAUTH_URL } from "../__constant__";
import { readSetCookie } from "../__util__";
import { startOAuthByApi } from "./__util__";

test("1. GET /api/auth/oauth/{provider}는 인가 URL로 302 리다이렉트하고 state를 HttpOnly 쿠키에 저장하며 미지원 공급자는 404다", async ({
  request,
}) => {
  for (const provider of ["kakao"] as const) {
    const { response, authorizeUrl, state } = await startOAuthByApi(request, provider);
    expect(`${authorizeUrl.origin}${authorizeUrl.pathname}`).toBe(`${MOCK_OAUTH_URL}/${provider}/authorize`);
    expect(authorizeUrl.searchParams.get("redirect_uri")).toBe(
      `${BASE_URL}/api/auth/oauth/${provider}/callback`,
    );
    const cookie = readSetCookie(response, "board_oauth_state");
    expect(cookie).toContain(`board_oauth_state=${provider}.${state};`);
    expect(cookie).toContain("HttpOnly");
  }

  const unknown = await request.get("/api/auth/oauth/naver", { maxRedirects: 0 });
  expect(unknown.status()).toBe(404);
  expect((await unknown.json()).error.code).toBe("NOT_FOUND");
  for (const path of ["/api/auth/oauth/google", "/api/auth/oauth/google/callback?code=test&state=test"]) {
    const removed = await request.get(path, { maxRedirects: 0 });
    expect(removed.status()).toBe(404);
    expect((await removed.json()).error.code).toBe("NOT_FOUND");
  }
});
