import { kakaoProvider } from "./kakao";
import type { OAuthProfile, OAuthProvider } from "./oauth-provider";

const PROVIDERS = { kakao: kakaoProvider };

export function getOAuthProvider(id: string): OAuthProvider | null {
  return Object.hasOwn(PROVIDERS, id) ? PROVIDERS[id as keyof typeof PROVIDERS]() : null;
}

export function buildAuthorizeUrl(provider: OAuthProvider, redirectUri: string, state: string) {
  const url = new URL(provider.authorizeUrl);
  url.search = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
    ...provider.authorizeParams,
  }).toString();
  return url.toString();
}

// Exchanges the authorization code for an access token, then loads the provider's user profile.
export async function fetchOAuthProfile(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
): Promise<OAuthProfile> {
  const tokenResponse = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: provider.clientId,
      // Kakao's client secret is optional; an empty value would be rejected as a bad credential.
      ...(provider.clientSecret && { client_secret: provider.clientSecret }),
      redirect_uri: redirectUri,
      code,
    }),
    cache: "no-store",
  });
  if (!tokenResponse.ok) throw new Error(`${provider.id} token exchange failed: ${tokenResponse.status}`);
  const { access_token: accessToken } = (await tokenResponse.json()) as { access_token?: string };
  if (!accessToken) throw new Error(`${provider.id} token response has no access_token`);

  const userResponse = await fetch(provider.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!userResponse.ok) throw new Error(`${provider.id} profile request failed: ${userResponse.status}`);
  const profile = provider.parseProfile(await userResponse.json());
  if (!profile.id) throw new Error(`${provider.id} profile has no id`);
  return profile;
}
