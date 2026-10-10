import { requireUser } from "../../auth";
import { handle, readJsonBody } from "../../http";
import { insertPost } from "../post-repository";
import { parsePostInput } from "../post-validation";

// POST /api/posts
export const createPost = handle(async (request) => {
  const user = await requireUser(request);
  const input = parsePostInput(await readJsonBody(request));
  const post = await insertPost(user.id, input);
  return Response.json({ post }, { status: 201 });
});
