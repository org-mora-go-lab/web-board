import {
  type APIRequestContext,
  type APIResponse,
  expect,
  type Page,
  request,
} from "@playwright/test";

import { BASE_URL } from "../__constant__";
import { uniqueId } from "./unique";

export type EmailAccount = {
  email: string;
  nickname: string;
  password: string;
};

export function newEmailAccount(): EmailAccount {
  const id = uniqueId("u");
  return {
    email: `${id}@example.com`,
    nickname: `닉${id}`.slice(0, 20),
    password: "password1234",
  };
}

// Signs up through the API; the session cookie lands in `api`'s cookie jar.
export async function signupByApi(
  api: APIRequestContext,
  account = newEmailAccount(),
) {
  const response = await api.post("/api/auth/signup", { data: account });
  expect(response.status()).toBe(201);
  const { user } = await response.json();
  return { account, user: user as { id: number; nickname: string } };
}

// `page.request` shares cookies with the browser context, so the page is signed in afterwards.
export const loginAsNewUser = (page: Page) => signupByApi(page.request);

// A signed-in API client with its own cookie jar, for tests that need a second user.
export async function newApiUser() {
  const api = await request.newContext({ baseURL: BASE_URL });
  return { api, ...(await signupByApi(api)) };
}

// A signed-out API client with its own empty cookie jar.
export const newAnonymousApi = () => request.newContext({ baseURL: BASE_URL });

// Reads the value of a cookie from a response's Set-Cookie headers (empty string when it is being cleared).
export function readSetCookie(response: APIResponse, name: string) {
  const header = response
    .headersArray()
    .find(
      ({ name: headerName, value }) =>
        headerName.toLowerCase() === "set-cookie" &&
        value.startsWith(`${name}=`),
    );
  return header?.value;
}
