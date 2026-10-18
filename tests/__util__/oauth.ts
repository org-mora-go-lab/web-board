import { expect, type Page } from "@playwright/test";

import { MOCK_OAUTH_URL } from "../__constant__";
import { uniqueId } from "./unique";

export type Provider = "kakao";
export type OAuthAccount = { id: string; nickname: string; email: string };

const BUTTON_LABELS: Record<Provider, string> = { kakao: "카카오로 시작하기" };

export function newOAuthAccount(provider: Provider): OAuthAccount {
  const id = uniqueId(provider);
  return {
    id,
    nickname: `카카오${id}`.slice(0, 20),
    email: `${id}@kakao.example`,
  };
}

export const providerButton = (page: Page, provider: Provider) =>
  page.getByRole("link", { name: BUTTON_LABELS[provider] });

// Clicks the provider button on the current page and waits for the mock consent screen.
export async function openProviderConsent(page: Page, provider: Provider) {
  await providerButton(page, provider).click();
  await page.waitForURL(`${MOCK_OAUTH_URL}/${provider}/authorize?**`);
}

// Fills the mock consent screen and approves (or denies) it.
export async function answerProviderConsent(page: Page, account: OAuthAccount, decision: "approve" | "deny" = "approve") {
  await page.getByLabel("계정 ID").fill(account.id);
  await page.getByLabel("닉네임").fill(account.nickname);
  await page.getByLabel("이메일").fill(account.email);
  await page.getByRole("button", { name: decision === "approve" ? "동의하고 계속하기" : "취소" }).click();
}

// Full social sign-in from the login page; resolves once the app shows the signed-in header.
export async function loginWithProvider(page: Page, provider: Provider, account = newOAuthAccount(provider)) {
  await page.goto("/login");
  await openProviderConsent(page, provider);
  await answerProviderConsent(page, account);
  await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
  return account;
}
