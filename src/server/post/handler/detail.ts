import type { NextRequest } from "next/server";

import { requireUser } from "../../auth";
import { forbidden, handle, readJsonBody } from "../../http";
import { deletePost, findPost, updatePost } from "../post-repository";
import { parsePostId, parsePostInput, postNotFound } from "../post-validation";

type Context = { params: Promise<{ id: string }> };

async function loadPost(context: Context) {
  const post = await findPost(parsePostId((await context.params).id));
  if (!post) throw postNotFound();
  return post;
}

// Authentication is checked before lookup so anonymous callers always get 401, never 404/403.
async function loadOwnPost(
  request: NextRequest,
  context: Context,
  action: string,
) {
  const user = await requireUser(request);
  const post = await loadPost(context);
  if (post.author.id !== user.id) throw forbidden(`${action} 권한이 없습니다.`);
  return post;
}

// GET /api/posts/{id}
export const getPost = handle(async (_request, context: Context) => {
  return Response.json({ post: await loadPost(context) });
});

// PATCH /api/posts/{id}
export const patchPost = handle(async (request, context: Context) => {
  const post = await loadOwnPost(request, context, "수정");
  const input = parsePostInput(await readJsonBody(request));
  // The post may have been deleted while the body was being read.
  const updated = await updatePost(post.id, input);
  if (!updated) throw postNotFound();
  return Response.json({ post: updated });
});

// DELETE /api/posts/{id}
export const removePost = handle(async (request, context: Context) => {
  const post = await loadOwnPost(request, context, "삭제");
  await deletePost(post.id);
  return new Response(null, { status: 204 });
});
