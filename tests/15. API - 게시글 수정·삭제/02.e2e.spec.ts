import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi } from "../__util__";

test("2. DELETE /api/posts/{id}는 작성자의 요청이면 삭제하고 204를 반환하며 이후 조회는 404다", async ({
  request,
}) => {
  await signupByApi(request);
  const post = await createPostByApi(request);

  const response = await request.delete(`/api/posts/${post.id}`);
  expect(response.status()).toBe(204);
  expect(await response.text()).toBe("");

  const after = await request.get(`/api/posts/${post.id}`);
  expect(after.status()).toBe(404);
  expect((await after.json()).error.code).toBe("POST_NOT_FOUND");
});
