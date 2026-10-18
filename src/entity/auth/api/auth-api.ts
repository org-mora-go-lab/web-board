import { apiRequest } from "../../api";
import type { LoginInput, SignupInput, User } from "../type";

type UserResponse = { user: User };

export const fetchMe = () => apiRequest<{ user: User | null }>("/api/auth/me").then(({ user }) => user);

export const signupWithEmail = (input: SignupInput) =>
  apiRequest<UserResponse>("/api/auth/signup", { method: "POST", body: input }).then(({ user }) => user);

export const loginWithEmail = (input: LoginInput) =>
  apiRequest<UserResponse>("/api/auth/login", { method: "POST", body: input }).then(({ user }) => user);

export const logoutRequest = () => apiRequest<void>("/api/auth/logout", { method: "POST" });

export const oauthStartUrl = (provider: "kakao", next: string) =>
  `/api/auth/oauth/${provider}${next === "/" ? "" : `?next=${encodeURIComponent(next)}`}`;
