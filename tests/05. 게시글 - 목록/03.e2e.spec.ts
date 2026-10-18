import { expect, test } from "@playwright/test";

import { postRows } from "../__util__";
import { EMPTY_POST_LIST, mockPostListResponse } from "./__mock__";

test("3. 등록된 게시글이 없으면 등록된 게시글이 없습니다를 표시한다", async ({ page }) => {
  await mockPostListResponse(page, 200, EMPTY_POST_LIST);
  await page.goto("/");

  await expect(page.getByText("등록된 게시글이 없습니다.")).toBeVisible();
  await expect(page.getByText("전체 0개")).toBeVisible();
  await expect(postRows(page)).toHaveCount(0);
});
