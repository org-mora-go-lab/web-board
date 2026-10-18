import { expect, test } from "@playwright/test";

import { createPostByApi, postRows, searchPosts, signupByApi, uniqueId } from "../__util__";

test("1. 검색하면 제목 또는 내용에 검색어가 포함된 게시글만 표시하고 URL q와 검색 결과 수를 반영한다", async ({
  page,
  request,
}) => {
  const tag = uniqueId("search");
  await signupByApi(request);
  const byTitle = await createPostByApi(request, { title: `제목에 ${tag} 포함` });
  const byContent = await createPostByApi(request, { content: `본문에만 ${tag} 포함` });
  await createPostByApi(request, { title: `${uniqueId("other")} 관계없는 글` });

  await page.goto("/");
  await searchPosts(page, tag);

  await expect(page).toHaveURL(`/?q=${tag}`);
  await expect(page.getByText("검색 결과 2개")).toBeVisible();
  await expect(postRows(page).getByRole("link")).toHaveText([byContent.title, byTitle.title]);
});
