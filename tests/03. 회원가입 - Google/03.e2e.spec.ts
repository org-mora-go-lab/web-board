import { expect, test } from "@playwright/test";

import { header, loginWithProvider, newOAuthAccount, readMe } from "../__util__";

test("3. Google 인가를 마치면 계정을 만들어 로그인하고 헤더에 Google 표시와 이름을 보여준다", async ({ page }) => {
  const account = newOAuthAccount("google");
  await loginWithProvider(page, "google", account);

  await expect(page).toHaveURL("/");
  await expect(header(page).getByText("Google", { exact: true })).toBeVisible();
  await expect(header(page).getByText(account.nickname, { exact: true })).toBeVisible();
  expect(await readMe(page)).toEqual(
    expect.objectContaining({ nickname: account.nickname, email: account.email, provider: "google" }),
  );
});
