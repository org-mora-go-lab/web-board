"use client";

import type { User } from "@/src/entity/auth";
import { TextField } from "@/src/entity/ui";

import { useEmailLoginForm } from "./hook";

type Props = {
  onSuccess: (user: User) => void;
};

export function EmailLoginForm({ onSuccess }: Props) {
  const { email, setEmail, password, setPassword, error, pending, submit } = useEmailLoginForm(onSuccess);

  return (
    <form className="email-login-form" onSubmit={submit} noValidate>
      <TextField label="이메일" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      {error && (
        <p className="email-login-form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button is-primary" type="submit" disabled={pending}>
        이메일로 로그인
      </button>
    </form>
  );
}
