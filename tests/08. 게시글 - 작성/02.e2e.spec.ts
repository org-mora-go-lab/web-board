import { expect, test } from "@playwright/test";

import { contentField, loginAsNewUser, titleField } from "../__util__";

test("2. 제목이나 내용이 비어 있으면 등록하지 않고 입력 요청 메시지를 표시한다", async ({ page }) => {
  await loginAsNewUser(page);
  await page.goto("/posts/new");

  await titleField(page).fill("   ");
  await page.getByRole("button", { name: "등록" }).click();
  await expect(page.getByText("제목을 입력해 주세요.")).toBeVisible();
  await expect(page.getByText("내용을 입력해 주세요.")).toBeVisible();

  await titleField(page).fill("제목만 입력");
  await page.getByRole("button", { name: "등록" }).click();
  await expect(page.getByText("제목을 입력해 주세요.")).toHaveCount(0);
  await expect(page.getByText("내용을 입력해 주세요.")).toBeVisible();
  await expect(contentField(page)).toHaveAttribute("aria-invalid", "true");
  await expect(page).toHaveURL("/posts/new");
});
