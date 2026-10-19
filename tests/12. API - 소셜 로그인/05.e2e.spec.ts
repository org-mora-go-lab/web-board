import { expect, test } from "@playwright/test";

import { BASE_URL } from "../__constant__";
import { newOAuthAccount } from "../__util__";
import {
  approveConsentByApi,
  callCallbackByApi,
  startOAuthByApi,
} from "./__util__";

test("5. next가 같은 사이트의 경로가 아니면 로그인 후 /로 리다이렉트한다", async ({
  request,
}) => {
  for (const next of [
    "//evil.example/steal",
    "https://evil.example",
    "/\\evil.example",
    "/\t/evil.example",
    "/\n/evil.example",
  ]) {
    const { authorizeUrl } = await startOAuthByApi(request, "kakao", next);
    const callbackUrl = await approveConsentByApi(
      request,
      authorizeUrl,
      newOAuthAccount("kakao"),
    );
    const { location } = await callCallbackByApi(request, callbackUrl);
    expect(location.toString()).toBe(`${BASE_URL}/`);
  }
});
