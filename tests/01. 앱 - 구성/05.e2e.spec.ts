import { createClient } from "@libsql/client";
import { expect, request, test } from "@playwright/test";

import { LIBSQL_MOCK_DATABASE_PATH, REMOTE_APP_BASE_URL } from "../__constant__";
import { newEmailAccount, signupByApi, uniqueId } from "../__util__";

test("5. Vercel에서는 로컬 파일 대신 Turso에 회원·세션·게시글을 저장한다", async () => {
  const api = await request.newContext({ baseURL: REMOTE_APP_BASE_URL });
  const database = createClient({ url: `file:${LIBSQL_MOCK_DATABASE_PATH}` });
  const title = uniqueId("remote-post");
  try {
    const { account, user } = await signupByApi(api, newEmailAccount());
    const created = await api.post("/api/posts", { data: { title, content: "원격 DB 저장 검증" } });
    expect(created.status()).toBe(201);
    const { post } = await created.json();

    const list = await api.get("/api/posts", { params: { q: title } });
    expect(list.status()).toBe(200);
    expect(await list.json()).toMatchObject({ posts: [{ id: post.id, title }], total: 1 });

    const stored = await database.execute({ sql: "SELECT title FROM posts WHERE id = ?", args: [post.id] });
    expect(stored.rows[0].title).toBe(title);
    const session = await database.execute({ sql: "SELECT user_id FROM sessions WHERE user_id = ?", args: [user.id] });
    expect(session.rows).toHaveLength(1);

    expect((await api.post("/api/auth/logout")).status()).toBe(204);
    const loggedOut = await database.execute({ sql: "SELECT user_id FROM sessions WHERE user_id = ?", args: [user.id] });
    expect(loggedOut.rows).toHaveLength(0);
    expect((await api.post("/api/auth/login", { data: account })).status()).toBe(200);
    expect(await (await api.get(`/api/posts/${post.id}`)).json()).toMatchObject({ post: { id: post.id, title } });
  } finally {
    await api.dispose();
    database.close();
  }
});