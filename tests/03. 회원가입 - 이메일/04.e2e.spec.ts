import { expect, test } from "@playwright/test";

import { header, signupByApi } from "../__util__";

test("4. 로그인 화면에서 가입한 이메일과 비밀번호로 로그인할 수 있다", async ({
  page,
  request,
}) => {
  const { account } = await signupByApi(request);
  await page.goto("/login");
  await page.getByLabel("이메일").fill(account.email);
  await page.getByLabel("비밀번호").fill(account.password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    header(page).getByText(account.nickname, { exact: true }),
  ).toBeVisible();
});
