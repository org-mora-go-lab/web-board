import { MOCK_OAUTH_URL } from "../__constant__";

export const MOCK_CLIENT_IDS = { kakao: "mock-kakao-client", google: "mock-google-client" } as const;

// Points the app's Kakao and Google endpoints at `oauth-server.mjs`.
export function mockOAuthEnv() {
  return Object.fromEntries(
    (["kakao", "google"] as const).flatMap((provider) => {
      const prefix = provider.toUpperCase();
      return [
        [`${prefix}_CLIENT_ID`, MOCK_CLIENT_IDS[provider]],
        [`${prefix}_CLIENT_SECRET`, `mock-${provider}-secret`],
        [`${prefix}_AUTHORIZE_URL`, `${MOCK_OAUTH_URL}/${provider}/authorize`],
        [`${prefix}_TOKEN_URL`, `${MOCK_OAUTH_URL}/${provider}/token`],
        [`${prefix}_USERINFO_URL`, `${MOCK_OAUTH_URL}/${provider}/userinfo`],
      ];
    }),
  );
}
