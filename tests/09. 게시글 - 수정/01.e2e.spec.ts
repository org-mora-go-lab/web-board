import { expect, test } from "@playwright/test";

import {
  contentField,
  createPostByApi,
  loginAsNewUser,
  titleField,
  uniqueId,
} from "../__util__";

test("1. 작성자는 기존 내용이 채워진 수정 화면에서 저장하면 상세 화면에 수정된 내용과 수정됨을 표시한다", async ({
  page,
}) => {
  await loginAsNewUser(page);
  const post = await createPostByApi(page.request, { content: "수정 전 내용" });
  const newTitle = `수정된 제목 ${uniqueId()}`;

  await page.goto(`/posts/${post.id}`);
  await expect(page.locator(".post-article-edited")).toHaveCount(0);
  await page.getByRole("link", { name: "수정" }).click();
  await expect(page).toHaveURL(`/posts/${post.id}/edit`);
  await expect(titleField(page)).toHaveValue(post.title);
  await expect(contentField(page)).toHaveValue("수정 전 내용");

  await titleField(page).fill(newTitle);
  await contentField(page).fill("수정 후 내용");
  await page.getByRole("button", { name: "저장" }).click();

  await expect(page).toHaveURL(`/posts/${post.id}`);
  await expect(
    page.getByRole("heading", { level: 1, name: newTitle }),
  ).toBeVisible();
  await expect(page.locator(".post-article-content")).toHaveText(
    "수정 후 내용",
  );
  await expect(page.getByText("수정됨", { exact: true })).toBeVisible();
});
