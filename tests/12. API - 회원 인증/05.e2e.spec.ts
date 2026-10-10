import { expect, test } from "@playwright/test";

import { newAnonymousApi, signupByApi } from "../__util__";

test("5. GET /api/auth/me는 로그인 상태면 사용자 정보를, 아니면 user: null을 반환한다", async ({ request }) => {
  const anonymous = await newAnonymousApi();
  const signedOut = await anonymous.get("/api/auth/me");
  expect(signedOut.status()).toBe(200);
  expect(await signedOut.json()).toEqual({ user: null });

  const { account, user } = await signupByApi(request);
  const signedIn = await request.get("/api/auth/me");
  expect(signedIn.status()).toBe(200);
  expect(await signedIn.json()).toEqual({
    user: { id: user.id, nickname: account.nickname, email: account.email, provider: "email" },
  });
});
