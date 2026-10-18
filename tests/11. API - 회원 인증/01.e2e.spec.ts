import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../__constant__";
import { newEmailAccount, readSetCookie } from "../__util__";

test("1. POST /api/auth/signup은 201과 사용자 정보를 반환하고 세션 쿠키를 발급하며 이메일은 소문자로 저장한다", async ({
  request,
}) => {
  const account = newEmailAccount();
  const response = await request.post("/api/auth/signup", {
    data: { ...account, email: account.email.toUpperCase() },
  });

  expect(response.status()).toBe(201);
  expect((await response.json()).user).toEqual({
    id: expect.any(Number),
    nickname: account.nickname,
    email: account.email.toLowerCase(),
    provider: "email",
  });
  const cookie = readSetCookie(response, SESSION_COOKIE);
  expect(cookie).toMatch(new RegExp(`^${SESSION_COOKIE}=[\\w-]{40,};`));
  expect(cookie).toContain("HttpOnly");
  expect(cookie?.toLowerCase()).toContain("samesite=lax");
});
