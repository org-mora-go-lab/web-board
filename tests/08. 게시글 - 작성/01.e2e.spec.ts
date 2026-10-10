import { expect, test } from "@playwright/test";

import { contentField, loginAsNewUser, titleField, uniqueId } from "../__util__";

test("1. 글쓰기를 눌러 제목과 내용을 입력해 등록하면 작성한 게시글의 상세 화면으로 이동한다", async ({ page }) => {
  const { user } = await loginAsNewUser(page);
  const title = `새 글 ${uniqueId()}`;

  await page.goto("/");
  await page.getByRole("link", { name: "글쓰기" }).click();
  await expect(page).toHaveURL("/posts/new");
  await titleField(page).fill(title);
  await contentField(page).fill("처음 작성하는 게시글입니다.");
  await page.getByRole("button", { name: "등록" }).click();

  await expect(page).toHaveURL(/\/posts\/\d+$/);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  await expect(page.locator(".post-article-author")).toHaveText(user.nickname);
  await expect(page.locator(".post-article-content")).toHaveText("처음 작성하는 게시글입니다.");
});
