import { expect, test } from "@playwright/test";

import { createPostByApi, loginAsNewUser, titleField } from "../__util__";

test("3. 수정 화면에서 취소를 누르면 저장하지 않고 상세 화면으로 돌아간다", async ({
  page,
}) => {
  await loginAsNewUser(page);
  const post = await createPostByApi(page.request);

  await page.goto(`/posts/${post.id}/edit`);
  await titleField(page).fill("저장하지 않을 제목");
  await page.getByRole("button", { name: "취소" }).click();

  await expect(page).toHaveURL(`/posts/${post.id}`);
  await expect(
    page.getByRole("heading", { level: 1, name: post.title }),
  ).toBeVisible();
});
