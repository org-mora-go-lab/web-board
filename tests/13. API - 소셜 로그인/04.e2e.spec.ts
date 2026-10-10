import { expect, test } from "@playwright/test";

import { callCallbackByApi, startOAuthByApi } from "./__util__";

test("4. 공급자 토큰 교환에 실패하면 /login?error=oauth_failed로 리다이렉트한다", async ({ request }) => {
  const { state } = await startOAuthByApi(request, "kakao");

  const { location } = await callCallbackByApi(
    request,
    `/api/auth/oauth/kakao/callback?code=invalid-code&state=${state}`,
  );

  expect(`${location.pathname}${location.search}`).toBe("/login?error=oauth_failed");
  expect(await (await request.get("/api/auth/me")).json()).toEqual({ user: null });
});
