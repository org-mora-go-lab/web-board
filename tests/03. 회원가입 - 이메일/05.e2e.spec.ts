import { expect, test } from "@playwright/test";

import { pageAlert, readMe, signupByApi } from "../__util__";

test("5. 이메일 또는 비밀번호가 틀리면 로그인하지 않고 오류를 표시한다", async ({ page, request }) => {
  const { account } = await signupByApi(request);
  await page.goto("/login");
  await page.getByLabel("이메일").fill(account.email);
  await page.getByLabel("비밀번호").fill(`${account.password}-wrong`);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();

  await expect(pageAlert(page)).toHaveText("이메일 또는 비밀번호가 올바르지 않습니다.");
  await expect(page).toHaveURL("/login");
  expect(await readMe(page)).toBeNull();
});
