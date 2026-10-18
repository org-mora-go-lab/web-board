import { expect, test } from "@playwright/test";

import { newEmailAccount, signupByApi } from "../__util__";
import { fillSignupForm } from "./__util__";

test("3. 이미 가입된 이메일로 가입하면 이미 가입된 이메일입니다를 표시한다", async ({ page, request }) => {
  const { account } = await signupByApi(request);
  await page.goto("/signup");
  await fillSignupForm(page, { ...newEmailAccount(), email: account.email });

  await expect(page.getByText("이미 가입된 이메일입니다.")).toBeVisible();
  await expect(page).toHaveURL("/signup");
});
