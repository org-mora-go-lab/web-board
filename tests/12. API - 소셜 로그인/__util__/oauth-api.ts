import { type APIRequestContext, expect } from "@playwright/test";

import type { OAuthAccount, Provider } from "../../__util__";

// Calls the start route without following the redirect and returns the provider authorize URL.
export async function startOAuthByApi(api: APIRequestContext, provider: Provider, next?: string) {
  const query = next === undefined ? "" : `?next=${encodeURIComponent(next)}`;
  const response = await api.get(`/api/auth/oauth/${provider}${query}`, { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const authorizeUrl = new URL(response.headers().location);
  return { response, authorizeUrl, state: authorizeUrl.searchParams.get("state") ?? "" };
}

// Approves the mock consent form and returns the app callback URL carrying `code` and `state`.
export async function approveConsentByApi(api: APIRequestContext, authorizeUrl: URL, account: OAuthAccount) {
  const params = authorizeUrl.searchParams;
  const provider = authorizeUrl.pathname.split("/")[1];
  const response = await api.post(`${authorizeUrl.origin}/${provider}/approve`, {
    form: {
      client_id: params.get("client_id") ?? "",
      redirect_uri: params.get("redirect_uri") ?? "",
      state: params.get("state") ?? "",
      id: account.id,
      nickname: account.nickname,
      email: account.email,
      decision: "approve",
    },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(302);
  return new URL(response.headers().location);
}

export async function callCallbackByApi(api: APIRequestContext, callbackUrl: URL | string) {
  const url = typeof callbackUrl === "string" ? callbackUrl : `${callbackUrl.pathname}${callbackUrl.search}`;
  const response = await api.get(url, { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  return { response, location: new URL(response.headers().location) };
}
