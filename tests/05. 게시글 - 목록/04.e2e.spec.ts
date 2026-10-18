import { expect, test } from "@playwright/test";

import { createPostByApi, postRows, signupByApi } from "../__util__";

test("4. 게시글 제목을 누르면 해당 게시글 상세 화면으로 이동한다", async ({ page, request }) => {
  await signupByApi(request);
  const post = await createPostByApi(request);

  await page.goto(`/?q=${encodeURIComponent(post.title)}`);
  await postRows(page).getByRole("link", { name: post.title }).click();

  await expect(page).toHaveURL(`/posts/${post.id}`);
  await expect(page.getByRole("heading", { level: 1, name: post.title })).toBeVisible();
});
