import { expect, test } from "@playwright/test";

import { signupByApi } from "../__util__";

test("3. 로그인하지 않고 글쓰기 화면에 접근하면 로그인 화면으로 이동하고 로그인 후 글쓰기 화면으로 돌아온다", async ({
  page,
  request,
}) => {
  const { account } = await signupByApi(request);
  await page.goto("/posts/new");
  await expect(page).toHaveURL("/login?next=%2Fposts%2Fnew");

  await page.getByLabel("이메일").fill(account.email);
  await page.getByLabel("비밀번호").fill(account.password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();

  await expect(page).toHaveURL("/posts/new");
  await expect(page.getByRole("heading", { level: 1, name: "글쓰기" })).toBeVisible();
  await expect(page.getByLabel("제목")).toBeVisible();
});
