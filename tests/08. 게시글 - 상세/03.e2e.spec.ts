import { expect, test } from "@playwright/test";

import { createPostByApi, loginAsNewUser } from "../__util__";

test("3. 수정, 삭제 버튼은 작성자에게만 표시한다", async ({
  page,
  context,
}) => {
  await loginAsNewUser(page);
  const post = await createPostByApi(page.request);
  const editLink = page.getByRole("link", { name: "수정" });
  const deleteButton = page.getByRole("button", { name: "삭제" });

  await page.goto(`/posts/${post.id}`);
  await expect(editLink).toBeVisible();
  await expect(deleteButton).toBeVisible();

  await context.clearCookies();
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: post.title }),
  ).toBeVisible();
  await expect(editLink).toHaveCount(0);
  await expect(deleteButton).toHaveCount(0);

  await loginAsNewUser(page);
  await page.reload();
  await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  await expect(editLink).toHaveCount(0);
  await expect(deleteButton).toHaveCount(0);
});
