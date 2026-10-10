import { expect, test } from "@playwright/test";

import { BASE_URL } from "../__constant__";
import { MOCK_CLIENT_IDS } from "../__mock__";
import { openProviderConsent } from "../__util__";

test("2. 카카오로 시작하기를 누르면 client_id, redirect_uri, response_type=code, state를 담아 카카오 인가 페이지로 이동한다", async ({
  page,
}) => {
  await page.goto("/login");
  await openProviderConsent(page, "kakao");

  const params = new URL(page.url()).searchParams;
  expect(params.get("client_id")).toBe(MOCK_CLIENT_IDS.kakao);
  expect(params.get("redirect_uri")).toBe(`${BASE_URL}/api/auth/oauth/kakao/callback`);
  expect(params.get("response_type")).toBe("code");
  expect(params.get("state")).toMatch(/^[\w-]{16,}$/);
});
