import { expect, test } from "@playwright/test";

import { createPostByApi, loginAsNewUser } from "../__util__";
import { deletePopup, openDeletePopup } from "./__util__";

test("1. 작성자가 삭제를 누르면 확인 팝업을 표시하고 삭제를 선택하면 게시글을 삭제한 뒤 목록으로 이동한다", async ({
  page,
}) => {
  await loginAsNewUser(page);
  const post = await createPostByApi(page.request);

  await page.goto(`/posts/${post.id}`);
  await openDeletePopup(page);
  await expect(deletePopup(page)).toBeVisible();
  await expect(deletePopup(page)).toContainText(
    "삭제한 게시글은 복구할 수 없습니다.",
  );
  await expect(
    deletePopup(page).getByRole("button", { name: "취소" }),
  ).toBeFocused();

  await deletePopup(page).getByRole("button", { name: "삭제" }).click();
  await expect(page).toHaveURL("/");
  expect((await page.request.get(`/api/posts/${post.id}`)).status()).toBe(404);
});
