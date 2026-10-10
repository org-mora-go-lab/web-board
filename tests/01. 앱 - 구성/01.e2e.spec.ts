import { expect, test } from "@playwright/test";

test("1. `/`에 접속하면 Board 문서 제목과 게시판 목록 화면을 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Board");
  await expect(page.getByRole("heading", { level: 1, name: "게시판" })).toBeVisible();
  await expect(page.getByRole("region", { name: "게시글 목록" })).toBeVisible();
});
