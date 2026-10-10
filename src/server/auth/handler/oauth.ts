import { randomBytes } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import { NICKNAME_MAX_LENGTH } from "@/src/entity/auth/constant";
import { toSafeNextPath } from "@/src/entity/auth/util";

import { handle, HttpError } from "../../http";
import { createUser, findAccount, findUserById } from "../../user";
import {
  buildAuthorizeUrl,
  fetchOAuthProfile,
  getOAuthProvider,
  type OAuthProfile,
  type OAuthProvider,
} from "../oauth";
import { isSecureRequest, signIn } from "../session";

type Context = { params: Promise<{ provider: string }> };

const STATE_COOKIE = "board_oauth_state";
const NEXT_COOKIE = "board_oauth_next";
const OAUTH_COOKIE_PATH = "/api/auth/oauth";
const OAUTH_COOKIE_MAX_AGE = 10 * 60;
const DEFAULT_NICKNAMES = { kakao: "카카오 사용자", google: "Google 사용자" };

const appOrigin = (request: NextRequest) => process.env.APP_URL || request.nextUrl.origin;
const callbackUrl = (request: NextRequest, provider: OAuthProvider) =>
  `${appOrigin(request)}/api/auth/oauth/${provider.id}/callback`;

async function resolveProvider(context: Context) {
  const provider = getOAuthProvider((await context.params).provider);
  if (!provider) throw new HttpError(404, "NOT_FOUND", "지원하지 않는 로그인 방식입니다.");
  return provider;
}

function redirectTo(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, appOrigin(request)), 302);
  response.cookies.set(STATE_COOKIE, "", { path: OAUTH_COOKIE_PATH, maxAge: 0 });
  response.cookies.set(NEXT_COOKIE, "", { path: OAUTH_COOKIE_PATH, maxAge: 0 });
  return response;
}

function redirectToLogin(request: NextRequest, error: string, next: string) {
  const search = new URLSearchParams({ error });
  if (next !== "/") search.set("next", next);
  return redirectTo(request, `/login?${search}`);
}

// GET /api/auth/oauth/{provider}?next=/path — sends the browser to the provider's consent screen.
export const startOAuth = handle(async (request, context: Context) => {
  const provider = await resolveProvider(context);
  const next = toSafeNextPath(request.nextUrl.searchParams.get("next"));
  if (!provider.clientId) return redirectToLogin(request, "oauth_unconfigured", next);

  const state = randomBytes(16).toString("base64url");
  const response = NextResponse.redirect(buildAuthorizeUrl(provider, callbackUrl(request, provider), state), 302);
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecureRequest(request),
    path: OAUTH_COOKIE_PATH,
    maxAge: OAUTH_COOKIE_MAX_AGE,
  };
  // The provider is part of the state so a Kakao state can never complete a Google callback.
  response.cookies.set(STATE_COOKIE, `${provider.id}.${state}`, cookieOptions);
  response.cookies.set(NEXT_COOKIE, next, cookieOptions);
  return response;
});

// GET /api/auth/oauth/{provider}/callback?code&state — signs the user in (creating them on first visit).
export const finishOAuth = handle(async (request, context: Context) => {
  const provider = await resolveProvider(context);
  const query = request.nextUrl.searchParams;
  const next = toSafeNextPath(request.cookies.get(NEXT_COOKIE)?.value);
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (query.get("error")) return redirectToLogin(request, "oauth_denied", next);
  const code = query.get("code");
  const state = query.get("state");
  if (!code || !state || expectedState !== `${provider.id}.${state}`) {
    return redirectToLogin(request, "oauth_state", next);
  }

  let profile;
  try {
    profile = await fetchOAuthProfile(provider, code, callbackUrl(request, provider));
  } catch (error) {
    console.error(error);
    return redirectToLogin(request, "oauth_failed", next);
  }

  const user = (await findOAuthUser(provider.id, profile.id)) ?? (await createOAuthUser(provider, profile));
  return signIn(request, redirectTo(request, next), user);
});

async function findOAuthUser(providerId: OAuthProvider["id"], profileId: string) {
  const account = await findAccount(providerId, profileId);
  return account ? findUserById(account.userId) : null;
}

async function createOAuthUser(provider: OAuthProvider, profile: OAuthProfile) {
  try {
    return await createUser({
      nickname: profile.nickname.trim().slice(0, NICKNAME_MAX_LENGTH) || DEFAULT_NICKNAMES[provider.id],
      email: profile.email,
      provider: provider.id,
      providerAccountId: profile.id,
    });
  } catch (error) {
    // A concurrent first login (double tab, retry) may have created the account in the meantime.
    const existing = String(error).includes("UNIQUE") ? await findOAuthUser(provider.id, profile.id) : null;
    if (!existing) throw error;
    return existing;
  }
}
