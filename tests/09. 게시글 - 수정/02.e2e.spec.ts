import { expect, test } from "@playwright/test";

import {
  createPostByApi,
  loginAsNewUser,
  signupByApi,
  titleField,
} from "../__util__";

test("2. 작성자가 아닌 사용자가 수정 화면에 접근하면 수정 권한이 없습니다를 표시하고 폼을 표시하지 않는다", async ({
  page,
  request,
}) => {
  await signupByApi(request);
  const post = await createPostByApi(request);
  await loginAsNewUser(page);

  await page.goto(`/posts/${post.id}/edit`);
  await expect(page.getByText("수정 권한이 없습니다.")).toBeVisible();
  await expect(titleField(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "저장" })).toHaveCount(0);
});
