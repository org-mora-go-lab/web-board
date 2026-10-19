import { type APIResponse, expect, test } from "@playwright/test";

import {
  createPostByApi,
  newAnonymousApi,
  newApiUser,
  signupByApi,
} from "../__util__";

test("3. 작성자가 아니면 403 FORBIDDEN, 비로그인은 401 UNAUTHORIZED, 없는 게시글은 404 POST_NOT_FOUND다", async ({
  request,
}) => {
  await signupByApi(request);
  const post = await createPostByApi(request);
  const { api: stranger } = await newApiUser();
  const anonymous = await newAnonymousApi();
  const data = { title: "바꾼 제목", content: "바꾼 내용" };

  const expectError = async (
    responsePromise: Promise<APIResponse>,
    status: number,
    code: string,
  ) => {
    const response = await responsePromise;
    expect(response.status()).toBe(status);
    expect((await response.json()).error.code).toBe(code);
  };

  await expectError(
    stranger.patch(`/api/posts/${post.id}`, { data }),
    403,
    "FORBIDDEN",
  );
  await expectError(stranger.delete(`/api/posts/${post.id}`), 403, "FORBIDDEN");
  await expectError(
    anonymous.patch(`/api/posts/${post.id}`, { data }),
    401,
    "UNAUTHORIZED",
  );
  await expectError(
    anonymous.delete(`/api/posts/${post.id}`),
    401,
    "UNAUTHORIZED",
  );
  await expectError(
    request.patch("/api/posts/999999999", { data }),
    404,
    "POST_NOT_FOUND",
  );
  await expectError(
    request.delete("/api/posts/999999999"),
    404,
    "POST_NOT_FOUND",
  );

  expect(
    (await (await request.get(`/api/posts/${post.id}`)).json()).post.title,
  ).toBe(post.title);
});
