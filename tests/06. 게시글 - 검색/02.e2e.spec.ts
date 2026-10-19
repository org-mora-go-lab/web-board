import { expect, test } from "@playwright/test";

import { postRows, searchPosts, uniqueId } from "../__util__";

test("2. 검색 결과가 없으면 검색 결과가 없습니다를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await searchPosts(page, uniqueId("nothing"));

  await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
  await expect(page.getByText("검색 결과 0개")).toBeVisible();
  await expect(postRows(page)).toHaveCount(0);
});
