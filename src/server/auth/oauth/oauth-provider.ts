export type OAuthProviderId = "kakao" | "google";

export type OAuthProfile = {
  id: string;
  nickname: string;
  email: string | null;
};

export type OAuthProvider = {
  id: OAuthProviderId;
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  authorizeParams: Record<string, string>;
  parseProfile: (json: Record<string, unknown>) => OAuthProfile;
};
