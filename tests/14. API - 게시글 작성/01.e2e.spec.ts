import { expect, test } from "@playwright/test";

import { signupByApi, uniqueId } from "../__util__";

test("1. POST /api/posts는 로그인 사용자의 게시글을 만들어 201로 반환하며 제목 앞뒤 공백을 제거한다", async ({
  request,
}) => {
  const { user } = await signupByApi(request);
  const title = `API 작성 ${uniqueId()}`;

  const response = await request.post("/api/posts", { data: { title: `   ${title}  `, content: "  본문은 그대로  " } });

  expect(response.status()).toBe(201);
  const { post } = await response.json();
  expect(post).toEqual({
    id: expect.any(Number),
    title,
    content: "  본문은 그대로  ",
    author: { id: user.id, nickname: user.nickname },
    createdAt: expect.any(String),
    updatedAt: post.createdAt,
  });
  expect((await request.get(`/api/posts/${post.id}`)).status()).toBe(200);
});
