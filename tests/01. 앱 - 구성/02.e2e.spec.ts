import { existsSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { E2E_DATABASE_PATH } from "../__constant__";

test("2. 백엔드는 /api JSON API를 libSQL 로컬 파일에 저장하고 오류는 { error: { code, message } }로 응답한다", async ({
  request,
}) => {
  const list = await request.get("/api/posts");
  expect(list.status()).toBe(200);
  expect(list.headers()["content-type"]).toContain("application/json");
  expect(await list.json()).toEqual(expect.objectContaining({ posts: expect.any(Array), total: expect.any(Number) }));

  const missing = await request.get("/api/posts/999999999");
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toEqual({
    error: { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다." },
  });

  expect(existsSync(E2E_DATABASE_PATH)).toBe(true);
});
