import { expect, test } from "@playwright/test";

import { contentField, loginAsNewUser, titleField } from "../__util__";

test("3. 제목은 100자, 내용은 5000자까지 입력할 수 있으며 현재 글자 수를 표시한다", async ({
  page,
}) => {
  await loginAsNewUser(page);
  await page.goto("/posts/new");

  await expect(titleField(page)).toHaveAttribute("maxlength", "100");
  await expect(contentField(page)).toHaveAttribute("maxlength", "5000");
  await expect(page.getByText("0/100")).toBeVisible();
  await expect(page.getByText("0/5000")).toBeVisible();

  await titleField(page).fill("안녕하세요");
  await contentField(page).fill("글자 수 세기");
  await expect(page.getByText("5/100")).toBeVisible();
  await expect(page.getByText("7/5000")).toBeVisible();
});
