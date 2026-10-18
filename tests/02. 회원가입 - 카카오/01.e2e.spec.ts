import { expect, test } from "@playwright/test";

import { providerButton } from "../__util__";

test("1. 로그인 화면과 회원가입 화면에 카카오로 시작하기 버튼을 표시한다", async ({ page }) => {
  for (const path of ["/login", "/signup"]) {
    await page.goto(path);
    await expect(providerButton(page, "kakao")).toBeVisible();
    await expect(providerButton(page, "kakao")).toHaveAttribute("href", "/api/auth/oauth/kakao");
    await expect(page.getByRole("link", { name: "Google로 시작하기" })).toHaveCount(0);
  }
});
