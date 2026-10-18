import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi } from "../__util__";

test("4. GET /api/posts/{id}는 본문과 작성자를 포함해 반환하고 없거나 잘못된 ID는 404 POST_NOT_FOUND다", async ({
  request,
}) => {
  const { user } = await signupByApi(request);
  const post = await createPostByApi(request, { content: "상세 본문" });

  const found = await request.get(`/api/posts/${post.id}`);
  expect(found.status()).toBe(200);
  expect((await found.json()).post).toEqual({
    id: post.id,
    title: post.title,
    content: "상세 본문",
    author: { id: user.id, nickname: user.nickname },
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });

  for (const id of ["999999999", "abc", "0", "-1", "1.5"]) {
    const missing = await request.get(`/api/posts/${id}`);
    expect(missing.status()).toBe(404);
    expect((await missing.json()).error.code).toBe("POST_NOT_FOUND");
  }
});
