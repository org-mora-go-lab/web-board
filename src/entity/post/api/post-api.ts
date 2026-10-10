import { apiRequest } from "../../api";
import type { Post, PostInput, PostList } from "../type";

type PostResponse = { post: Post };

export function fetchPosts({ page, query }: { page: number; query: string }) {
  const search = new URLSearchParams({ page: String(page) });
  if (query) search.set("q", query);
  return apiRequest<PostList>(`/api/posts?${search}`);
}

export const fetchPost = (id: string) =>
  apiRequest<PostResponse>(`/api/posts/${encodeURIComponent(id)}`).then(({ post }) => post);

export const createPost = (input: PostInput) =>
  apiRequest<PostResponse>("/api/posts", { method: "POST", body: input }).then(({ post }) => post);

export const updatePost = (id: number, input: PostInput) =>
  apiRequest<PostResponse>(`/api/posts/${id}`, { method: "PATCH", body: input }).then(({ post }) => post);

export const deletePost = (id: number) => apiRequest<void>(`/api/posts/${id}`, { method: "DELETE" });
