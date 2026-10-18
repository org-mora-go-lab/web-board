export type AuthProvider = "email" | "kakao";

export type User = {
  id: number;
  nickname: string;
  email: string | null;
  provider: AuthProvider;
};

export type SignupInput = { email: string; nickname: string; password: string };

export type LoginInput = { email: string; password: string };
