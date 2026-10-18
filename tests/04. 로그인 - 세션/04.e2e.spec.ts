import { expect, test } from "@playwright/test";

import { loginAsNewUser } from "../__util__";

test("4. 이미 로그인한 상태로 로그인 화면에 접근하면 목록 화면으로 이동한다", async ({ page }) => {
  await loginAsNewUser(page);
  await page.goto("/login");

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1, name: "게시판" })).toBeVisible();
});
