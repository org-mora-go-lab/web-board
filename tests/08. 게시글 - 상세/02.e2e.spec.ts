import { expect, test } from "@playwright/test";

test("2. 존재하지 않는 게시글에 접근하면 게시글을 찾을 수 없습니다를 표시한다", async ({
  page,
}) => {
  for (const id of ["999999999", "not-a-number"]) {
    await page.goto(`/posts/${id}`);
    await expect(page.getByText("게시글을 찾을 수 없습니다.")).toBeVisible();
    await expect(page.getByRole("link", { name: "목록" })).toBeVisible();
  }
});
