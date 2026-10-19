"use client";

import { NICKNAME_MAX_LENGTH, type User } from "@/src/entity/auth";
import { TextField } from "@/src/entity/ui";

import { useEmailSignupForm } from "./hook";

type Props = {
  onSuccess: (user: User) => void;
};

export function EmailSignupForm({ onSuccess }: Props) {
  const { values, setValue, errors, pending, submit } =
    useEmailSignupForm(onSuccess);

  return (
    <form className="email-signup-form" onSubmit={submit} noValidate>
      <TextField
        label="이메일"
        type="email"
        value={values.email}
        onChange={setValue("email")}
        error={errors.email}
        autoComplete="email"
      />
      <TextField
        label="닉네임"
        value={values.nickname}
        onChange={setValue("nickname")}
        error={errors.nickname}
        maxLength={NICKNAME_MAX_LENGTH}
        autoComplete="nickname"
      />
      <TextField
        label="비밀번호"
        type="password"
        value={values.password}
        onChange={setValue("password")}
        error={errors.password}
        placeholder="8자 이상"
        autoComplete="new-password"
      />
      <TextField
        label="비밀번호 확인"
        type="password"
        value={values.passwordConfirm}
        onChange={setValue("passwordConfirm")}
        error={errors.passwordConfirm}
        autoComplete="new-password"
      />
      {errors.form && (
        <p className="email-signup-form-error" role="alert">
          {errors.form}
        </p>
      )}
      <button className="button is-primary" type="submit" disabled={pending}>
        회원가입
      </button>
    </form>
  );
}
