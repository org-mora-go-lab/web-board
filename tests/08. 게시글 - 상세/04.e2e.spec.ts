import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi } from "../__util__";

test("4. 목록 버튼을 누르면 목록 화면으로 이동한다", async ({ page, request }) => {
  await signupByApi(request);
  const post = await createPostByApi(request);

  await page.goto(`/posts/${post.id}`);
  await page.getByRole("link", { name: "목록" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1, name: "게시판" })).toBeVisible();
});
