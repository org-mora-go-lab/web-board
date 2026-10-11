import { getDb } from "../db";

export type PostAuthor = { id: number; nickname: string };

export type PostSummaryDto = {
  id: number;
  title: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};

export type PostDto = PostSummaryDto & { content: string };

export type PostInput = { title: string; content: string };

type PostRow = {
  id: number;
  title: string;
  content?: string;
  author_id: number;
  author_nickname: string;
  created_at: string;
  updated_at: string;
};

const SELECT_SUMMARY = `
  SELECT posts.id, posts.title, posts.author_id, posts.created_at, posts.updated_at,
         users.nickname AS author_nickname
    FROM posts JOIN users ON users.id = posts.author_id`;

const toSummary = (row: PostRow): PostSummaryDto => ({
  id: row.id,
  title: row.title,
  author: { id: row.author_id, nickname: row.author_nickname },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Escapes LIKE wildcards so a search for "50%" matches the literal text.
const toLikePattern = (query: string) => `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;

export async function listPosts({ page, size, query }: { page: number; size: number; query: string }) {
  const db = await getDb();
  const where = query ? "WHERE posts.title LIKE ? ESCAPE '\\' OR posts.content LIKE ? ESCAPE '\\'" : "";
  const params = query ? [toLikePattern(query), toLikePattern(query)] : [];
  const { total } = (await db.get<{ total: number }>(`SELECT COUNT(*) AS total FROM posts ${where}`, params))!;
  const rows = await db.all<PostRow>(`${SELECT_SUMMARY} ${where} ORDER BY posts.id DESC LIMIT ? OFFSET ?`, [
    ...params,
    size,
    (page - 1) * size,
  ]);
  return { posts: rows.map(toSummary), total };
}

export async function findPost(id: number): Promise<PostDto | null> {
  const db = await getDb();
  const row = await db.get<PostRow>(
    `SELECT posts.id, posts.title, posts.content, posts.author_id, posts.created_at, posts.updated_at,
            users.nickname AS author_nickname
       FROM posts JOIN users ON users.id = posts.author_id
      WHERE posts.id = ?`,
    [id],
  );
  return row ? { ...toSummary(row), content: row.content ?? "" } : null;
}

export async function insertPost(authorId: number, input: PostInput) {
  const db = await getDb();
  const now = new Date().toISOString();
  const { lastInsertId } = await db.run(
    "INSERT INTO posts (author_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [authorId, input.title, input.content, now, now],
  );
  return (await findPost(lastInsertId))!;
}

export async function updatePost(id: number, input: PostInput) {
  const db = await getDb();
  await db.run("UPDATE posts SET title = ?, content = ?, updated_at = ? WHERE id = ?", [
    input.title,
    input.content,
    new Date().toISOString(),
    id,
  ]);
  return findPost(id);
}

export async function deletePost(id: number) {
  const db = await getDb();
  await db.run("DELETE FROM posts WHERE id = ?", [id]);
}
