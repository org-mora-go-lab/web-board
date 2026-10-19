import { expect, test } from "@playwright/test";

import {
  answerProviderConsent,
  headerLoginLink,
  newOAuthAccount,
  openProviderConsent,
  pageAlert,
  readMe,
} from "../__util__";

test("5. 카카오 인가 화면에서 동의를 취소하면 로그인하지 않고 로그인이 취소되었습니다를 표시한다", async ({
  page,
}) => {
  await page.goto("/login");
  await openProviderConsent(page, "kakao");
  await answerProviderConsent(page, newOAuthAccount("kakao"), "deny");

  await expect(page).toHaveURL("/login?error=oauth_denied");
  await expect(pageAlert(page)).toHaveText("로그인이 취소되었습니다.");
  await expect(headerLoginLink(page)).toBeVisible();
  expect(await readMe(page)).toBeNull();
});
