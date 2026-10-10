import type { OAuthProvider } from "./oauth-provider";

type KakaoUser = {
  id?: number | string;
  properties?: { nickname?: string };
  kakao_account?: { email?: string; is_email_verified?: boolean; profile?: { nickname?: string } };
};

// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
export function kakaoProvider(): OAuthProvider {
  const env = process.env;
  return {
    id: "kakao",
    clientId: env.KAKAO_CLIENT_ID ?? "",
    clientSecret: env.KAKAO_CLIENT_SECRET ?? "",
    authorizeUrl: env.KAKAO_AUTHORIZE_URL || "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: env.KAKAO_TOKEN_URL || "https://kauth.kakao.com/oauth/token",
    userInfoUrl: env.KAKAO_USERINFO_URL || "https://kapi.kakao.com/v2/user/me",
    // Kakao grants the consent items configured in the developer console, so no scope is sent.
    authorizeParams: {},
    parseProfile: (json) => {
      const user = json as KakaoUser;
      const account = user.kakao_account;
      return {
        id: String(user.id ?? ""),
        nickname: account?.profile?.nickname ?? user.properties?.nickname ?? "",
        email: account?.email && account.is_email_verified !== false ? account.email : null,
      };
    },
  };
}
