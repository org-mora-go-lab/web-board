import type { OAuthProvider } from "./oauth-provider";

type GoogleUser = {
  sub?: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
};

// https://developers.google.com/identity/protocols/oauth2/web-server
export function googleProvider(): OAuthProvider {
  const env = process.env;
  return {
    id: "google",
    clientId: env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
    authorizeUrl: env.GOOGLE_AUTHORIZE_URL || "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token",
    userInfoUrl: env.GOOGLE_USERINFO_URL || "https://openidconnect.googleapis.com/v1/userinfo",
    authorizeParams: { scope: "openid email profile", prompt: "select_account" },
    parseProfile: (json) => {
      const user = json as GoogleUser;
      const email = user.email && user.email_verified !== false ? user.email : null;
      return {
        id: user.sub ?? "",
        nickname: user.name || email?.split("@")[0] || "",
        email,
      };
    },
  };
}
