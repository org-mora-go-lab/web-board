import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi } from "../__util__";

test("1. 상세 화면에 제목, 작성자, 작성일과 내용을 표시하며 줄바꿈을 유지한다", async ({
  page,
  request,
}) => {
  const { user } = await signupByApi(request);
  const post = await createPostByApi(request, {
    content: "첫 번째 줄\n두 번째 줄\n\n네 번째 줄",
  });

  await page.goto(`/posts/${post.id}`);
  await expect(
    page.getByRole("heading", { level: 1, name: post.title }),
  ).toBeVisible();
  await expect(page.locator(".post-article-author")).toHaveText(user.nickname);
  await expect(page.locator(".post-article-meta time")).toHaveText(
    /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/,
  );

  const content = page.locator(".post-article-content");
  await expect(content).toHaveCSS("white-space", "pre-wrap");
  expect(await content.innerText()).toBe(
    "첫 번째 줄\n두 번째 줄\n\n네 번째 줄",
  );
});
