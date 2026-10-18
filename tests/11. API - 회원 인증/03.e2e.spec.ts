import { expect, test } from "@playwright/test";

import { newAnonymousApi, newEmailAccount, signupByApi } from "../__util__";

test("3. POST /api/auth/signup은 이미 가입된 이메일이면 409 EMAIL_TAKEN을 반환한다", async ({ request }) => {
  const { account } = await signupByApi(request);
  const other = await newAnonymousApi();

  const response = await other.post("/api/auth/signup", {
    data: { ...newEmailAccount(), email: account.email.toUpperCase() },
  });

  expect(response.status()).toBe(409);
  expect((await response.json()).error).toEqual(
    expect.objectContaining({ code: "EMAIL_TAKEN", message: "이미 가입된 이메일입니다." }),
  );
});
