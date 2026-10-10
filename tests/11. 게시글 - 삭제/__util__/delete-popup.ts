import type { Page } from "@playwright/test";

export const deletePopup = (page: Page) => page.getByRole("dialog", { name: "게시글 삭제" });

export const openDeletePopup = (page: Page) =>
  page.locator(".post-article").getByRole("button", { name: "삭제" }).click();
