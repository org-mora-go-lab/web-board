export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 20;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const OAUTH_PROVIDERS = ["kakao", "google"] as const;

// Messages for the `?error=` codes the OAuth callback redirects to /login with.
export const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  oauth_state: "로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.",
  oauth_denied: "로그인이 취소되었습니다.",
  oauth_failed: "소셜 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  oauth_unconfigured: "소셜 로그인 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.",
};
