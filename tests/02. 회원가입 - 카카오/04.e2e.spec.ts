import { expect, test } from "@playwright/test";

import { loginWithProvider, logoutButton, newOAuthAccount, readMe } from "../__util__";

test("4. 같은 카카오 계정으로 다시 로그인하면 기존 계정과 최신 닉네임을 사용한다", async ({ page }) => {
  const account = newOAuthAccount("kakao");
  await loginWithProvider(page, "kakao", account);
  const firstUser = await readMe(page);

  await logoutButton(page).click();
  await expect(page.getByRole("link", { name: "로그인" })).toBeVisible();
  expect(await readMe(page)).toBeNull();

  const updatedAccount = { ...account, nickname: `새${account.nickname}`.slice(0, 20) };
  await loginWithProvider(page, "kakao", updatedAccount);
  const secondUser = await readMe(page);
  expect(secondUser?.id).toBe(firstUser?.id);
  expect(secondUser?.nickname).toBe(updatedAccount.nickname);
  await expect(page.getByText(updatedAccount.nickname, { exact: true })).toBeVisible();
});
