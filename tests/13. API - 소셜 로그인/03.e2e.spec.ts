import { expect, test } from "@playwright/test";

import { newOAuthAccount } from "../__util__";
import { approveConsentByApi, callCallbackByApi, startOAuthByApi } from "./__util__";

test("3. 콜백의 state가 없거나 저장된 값과 다르면 /login?error=oauth_state로 리다이렉트한다", async ({ request }) => {
  const { authorizeUrl } = await startOAuthByApi(request, "google");
  const callbackUrl = await approveConsentByApi(request, authorizeUrl, newOAuthAccount("google"));
  const code = callbackUrl.searchParams.get("code");

  for (const query of [`code=${code}&state=tampered`, `code=${code}`]) {
    const { location } = await callCallbackByApi(request, `/api/auth/oauth/google/callback?${query}`);
    expect(`${location.pathname}${location.search}`).toBe("/login?error=oauth_state");
  }
  expect(await (await request.get("/api/auth/me")).json()).toEqual({ user: null });
});
