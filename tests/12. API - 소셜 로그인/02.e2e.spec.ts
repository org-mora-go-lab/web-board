import { expect, test } from "@playwright/test";

import { BASE_URL, SESSION_COOKIE } from "../__constant__";
import { newOAuthAccount, readSetCookie } from "../__util__";
import {
  approveConsentByApi,
  callCallbackByApi,
  startOAuthByApi,
} from "./__util__";

test("2. 콜백은 코드를 토큰으로 교환해 사용자 정보로 로그인시키고 세션 쿠키와 함께 next 경로로 302 리다이렉트한다", async ({
  request,
}) => {
  const account = newOAuthAccount("kakao");
  const { authorizeUrl } = await startOAuthByApi(
    request,
    "kakao",
    "/posts/new",
  );
  const callbackUrl = await approveConsentByApi(request, authorizeUrl, account);
  expect(callbackUrl.pathname).toBe("/api/auth/oauth/kakao/callback");

  const { response, location } = await callCallbackByApi(request, callbackUrl);
  expect(location.toString()).toBe(`${BASE_URL}/posts/new`);
  expect(readSetCookie(response, SESSION_COOKIE)).toContain("HttpOnly");

  const { user } = await (await request.get("/api/auth/me")).json();
  expect(user).toEqual({
    id: expect.any(Number),
    nickname: account.nickname,
    email: account.email,
    provider: "kakao",
  });
});
