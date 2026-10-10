import { expect, test } from "@playwright/test";

import { loginWithProvider, logoutButton, newOAuthAccount, readMe } from "../__util__";

test("4. 같은 Google 계정으로 다시 로그인하면 기존 계정으로 로그인한다", async ({ page }) => {
  const account = newOAuthAccount("google");
  await loginWithProvider(page, "google", account);
  const firstUser = await readMe(page);

  await logoutButton(page).click();
  await expect(page.getByRole("link", { name: "로그인" })).toBeVisible();
  expect(await readMe(page)).toBeNull();

  await loginWithProvider(page, "google", account);
  const secondUser = await readMe(page);
  expect(secondUser?.id).toBe(firstUser?.id);
});
