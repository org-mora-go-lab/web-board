import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../__constant__";
import { newAnonymousApi, readSetCookie, signupByApi } from "../__util__";

test("4. POST /api/auth/login은 맞으면 200과 세션 쿠키를, 틀리면 401 INVALID_CREDENTIALS를 반환한다", async ({
  request,
}) => {
  const { account, user } = await signupByApi(request);
  const api = await newAnonymousApi();

  const success = await api.post("/api/auth/login", {
    data: { email: account.email, password: account.password },
  });
  expect(success.status()).toBe(200);
  expect((await success.json()).user).toEqual(
    expect.objectContaining({ id: user.id, provider: "email" }),
  );
  expect(readSetCookie(success, SESSION_COOKIE)).toContain("HttpOnly");

  for (const data of [
    { email: account.email, password: "wrong-password" },
    { email: `missing-${account.email}`, password: account.password },
  ]) {
    const failure = await api.post("/api/auth/login", { data });
    expect(failure.status()).toBe(401);
    expect((await failure.json()).error).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }
});
