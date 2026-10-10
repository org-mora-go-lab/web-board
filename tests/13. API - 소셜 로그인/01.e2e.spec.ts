import { expect, test } from "@playwright/test";

import { MOCK_OAUTH_URL } from "../__constant__";
import { readSetCookie } from "../__util__";
import { startOAuthByApi } from "./__util__";

test("1. GET /api/auth/oauth/{provider}는 인가 URL로 302 리다이렉트하고 state를 HttpOnly 쿠키에 저장하며 미지원 공급자는 404다", async ({
  request,
}) => {
  for (const provider of ["kakao", "google"] as const) {
    const { response, authorizeUrl, state } = await startOAuthByApi(request, provider);
    expect(`${authorizeUrl.origin}${authorizeUrl.pathname}`).toBe(`${MOCK_OAUTH_URL}/${provider}/authorize`);
    const cookie = readSetCookie(response, "board_oauth_state");
    expect(cookie).toContain(`board_oauth_state=${provider}.${state};`);
    expect(cookie).toContain("HttpOnly");
  }

  const unknown = await request.get("/api/auth/oauth/naver", { maxRedirects: 0 });
  expect(unknown.status()).toBe(404);
  expect((await unknown.json()).error.code).toBe("NOT_FOUND");
});
