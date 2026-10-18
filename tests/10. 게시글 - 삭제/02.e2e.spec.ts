import { expect, test } from "@playwright/test";

import { createPostByApi, loginAsNewUser } from "../__util__";
import { deletePopup, openDeletePopup } from "./__util__";

test("2. 확인 팝업을 취소, Escape 또는 바깥 영역 클릭으로 닫으면 게시글을 삭제하지 않는다", async ({ page }) => {
  await loginAsNewUser(page);
  const post = await createPostByApi(page.request);
  await page.goto(`/posts/${post.id}`);

  await openDeletePopup(page);
  await deletePopup(page).getByRole("button", { name: "취소" }).click();
  await expect(deletePopup(page)).toHaveCount(0);

  await openDeletePopup(page);
  await page.keyboard.press("Escape");
  await expect(deletePopup(page)).toHaveCount(0);

  await openDeletePopup(page);
  await page.mouse.click(8, 8);
  await expect(deletePopup(page)).toHaveCount(0);

  await expect(page).toHaveURL(`/posts/${post.id}`);
  expect((await page.request.get(`/api/posts/${post.id}`)).status()).toBe(200);
});
