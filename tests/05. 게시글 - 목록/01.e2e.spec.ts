import { expect, test } from "@playwright/test";

import { createPostByApi, postRows, signupByApi, uniqueId } from "../__util__";

test("1. 게시글은 최신 작성순으로 표시하며 각 행에 번호, 제목, 작성자, 작성일을 표시한다", async ({
  page,
  request,
}) => {
  const tag = uniqueId("list");
  const { user } = await signupByApi(request);
  const older = await createPostByApi(request, { title: `${tag} 먼저 쓴 글` });
  const newer = await createPostByApi(request, {
    title: `${tag} 나중에 쓴 글`,
  });

  await page.goto(`/?q=${tag}`);
  await expect(page.getByRole("columnheader")).toHaveText([
    "번호",
    "제목",
    "작성자",
    "작성일",
  ]);
  await expect(postRows(page)).toHaveCount(2);

  const firstCells = postRows(page).first().getByRole("cell");
  await expect(firstCells).toHaveText([
    String(newer.id),
    newer.title,
    user.nickname,
    /^\d{2}:\d{2}$/,
  ]);
  await expect(postRows(page).nth(1).getByRole("cell").nth(1)).toHaveText(
    older.title,
  );
});
