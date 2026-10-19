import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi, uniqueId } from "../__util__";

test("1. GET /api/posts는 최신순 목록과 page, size, total, totalPages를 반환하며 항목에 본문은 없다", async ({
  request,
}) => {
  const tag = uniqueId("apilist");
  const { user } = await signupByApi(request);
  const older = await createPostByApi(request, { title: `${tag} 1` });
  const newer = await createPostByApi(request, { title: `${tag} 2` });

  const response = await request.get(`/api/posts?q=${tag}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual({
    posts: expect.any(Array),
    page: 1,
    size: 10,
    total: 2,
    totalPages: 1,
  });
  expect(body.posts.map(({ id }: { id: number }) => id)).toEqual([
    newer.id,
    older.id,
  ]);
  expect(body.posts[0]).toEqual({
    id: newer.id,
    title: newer.title,
    author: { id: user.id, nickname: user.nickname },
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
  expect(body.posts[0]).not.toHaveProperty("content");
});
