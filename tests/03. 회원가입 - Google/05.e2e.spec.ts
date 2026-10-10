import { expect, test } from "@playwright/test";

import { openProviderConsent, pageAlert, readMe } from "../__util__";

test("5. 돌아온 state가 발급한 값과 다르면 로그인하지 않고 로그인 화면에 오류를 표시한다", async ({ page }) => {
  await page.goto("/login");
  await openProviderConsent(page, "google");
  const issuedState = new URL(page.url()).searchParams.get("state");

  await page.goto(`/api/auth/oauth/google/callback?code=forged-code&state=${issuedState}-tampered`);

  await expect(page).toHaveURL("/login?error=oauth_state");
  await expect(pageAlert(page)).toHaveText(
    "로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.",
  );
  expect(await readMe(page)).toBeNull();
});
