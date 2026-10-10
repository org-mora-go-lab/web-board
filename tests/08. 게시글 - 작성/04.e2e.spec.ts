import { expect, test } from "@playwright/test";

import { contentField, loginAsNewUser, titleField, uniqueId } from "../__util__";

test("4. 취소를 누르면 저장하지 않고 목록 화면으로 이동한다", async ({ page }) => {
  await loginAsNewUser(page);
  const title = `취소할 글 ${uniqueId()}`;

  await page.goto("/posts/new");
  await titleField(page).fill(title);
  await contentField(page).fill("저장하지 않을 내용");
  await page.getByRole("button", { name: "취소" }).click();

  await expect(page).toHaveURL("/");
  const { total } = await (await page.request.get(`/api/posts?q=${encodeURIComponent(title)}`)).json();
  expect(total).toBe(0);
});
