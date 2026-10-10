import { handle } from "../../http";
import { getSessionUser } from "../session";

// A session probe, so anonymous visitors get `{ user: null }` rather than an error status.
export const getMe = handle(async (request) => {
  return Response.json({ user: await getSessionUser(request) });
});
