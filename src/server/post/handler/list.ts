import { POST_MAX_PAGE_SIZE, POST_PAGE_SIZE } from "@/src/entity/post/constant";

import { handle } from "../../http";
import { listPosts } from "../post-repository";
import { parsePositiveInt } from "../post-validation";

// GET /api/posts?page=1&size=10&q=keyword
export const getPosts = handle(async (request) => {
  const query = request.nextUrl.searchParams;
  const page = parsePositiveInt(query.get("page"), 1);
  const size = parsePositiveInt(query.get("size"), POST_PAGE_SIZE, POST_MAX_PAGE_SIZE);
  const keyword = (query.get("q") ?? "").trim();

  const { posts, total } = await listPosts({ page, size, query: keyword });
  return Response.json({ posts, page, size, total, totalPages: Math.max(1, Math.ceil(total / size)) });
});
