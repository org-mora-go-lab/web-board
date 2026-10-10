import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../__constant__";
import { header, loginAsNewUser } from "../__util__";

test("1. 로그인 상태는 HttpOnly 세션 쿠키로 유지되어 새로고침해도 유지된다", async ({ page, context }) => {
  const { account } = await loginAsNewUser(page);

  const cookie = (await context.cookies()).find(({ name }) => name === SESSION_COOKIE);
  expect(cookie).toEqual(expect.objectContaining({ httpOnly: true, sameSite: "Lax", path: "/" }));

  await page.goto("/");
  await expect(header(page).getByText(account.nickname, { exact: true })).toBeVisible();
  await page.reload();
  await expect(header(page).getByText(account.nickname, { exact: true })).toBeVisible();
});
