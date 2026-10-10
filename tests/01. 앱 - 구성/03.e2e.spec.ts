import { expect, test } from "@playwright/test";

import { header } from "../__util__";

test("3. 모든 화면 헤더에 Board 로고를 표시하고 누르면 목록으로 이동한다", async ({ page }) => {
  for (const path of ["/login", "/signup", "/posts/999999999"]) {
    await page.goto(path);
    const logo = header(page).getByRole("link", { name: "Board" });
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1, name: "게시판" })).toBeVisible();
  }
});
