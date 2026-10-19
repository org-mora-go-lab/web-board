import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi } from "../__util__";

test("1. PATCH /api/posts/{id}는 작성자의 요청이면 제목과 내용을 수정하고 updatedAt을 갱신해 200을 반환한다", async ({
  request,
}) => {
  await signupByApi(request);
  const post = await createPostByApi(request);
  const before = (await (await request.get(`/api/posts/${post.id}`)).json())
    .post;

  const response = await request.patch(`/api/posts/${post.id}`, {
    data: { title: " 수정한 제목 ", content: "수정한 본문" },
  });

  expect(response.status()).toBe(200);
  const { post: updated } = await response.json();
  expect(updated).toEqual(
    expect.objectContaining({
      id: post.id,
      title: "수정한 제목",
      content: "수정한 본문",
      createdAt: before.createdAt,
    }),
  );
  expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
    new Date(before.updatedAt).getTime(),
  );
  expect(
    (await (await request.get(`/api/posts/${post.id}`)).json()).post.title,
  ).toBe("수정한 제목");
});
