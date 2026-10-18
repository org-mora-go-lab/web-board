import { expect, test } from "@playwright/test";

test("1. `/`에 접속하면 Board 대시보드와 게시판 목록을 표시한다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Board");
  await expect(page.getByRole("heading", { level: 1, name: "게시판" })).toBeVisible();
  await expect(page.getByRole("region", { name: "게시글 목록" })).toBeVisible();
  await expect(page.getByText("전체 게시글")).toBeVisible();
  await expect(page.getByText("현재 페이지")).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "게시글 검색" })).toBeVisible();
  await expect(page.getByRole("link", { name: "글쓰기" })).toBeVisible();
});
