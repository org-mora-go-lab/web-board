import { type APIRequestContext, expect } from "@playwright/test";

import { uniqueId } from "./unique";

export type CreatedPost = { id: number; title: string; content: string };

export async function createPostByApi(api: APIRequestContext, input: Partial<{ title: string; content: string }> = {}) {
  const data = { title: input.title ?? `제목 ${uniqueId("p")}`, content: input.content ?? "본문 내용입니다." };
  const response = await api.post("/api/posts", { data });
  expect(response.status()).toBe(201);
  return (await response.json()).post as CreatedPost;
}
