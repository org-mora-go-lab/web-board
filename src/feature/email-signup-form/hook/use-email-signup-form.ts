"use client";

import { type FormEvent, useState } from "react";

import { toApiError } from "@/src/entity/api";
import {
  signupWithEmail,
  type User,
  validateSignupInput,
} from "@/src/entity/auth";

type Field = "email" | "nickname" | "password" | "passwordConfirm";
type Errors = Partial<Record<Field | "form", string>>;

export function useEmailSignupForm(onSuccess: (user: User) => void) {
  const [values, setValues] = useState<Record<Field, string>>({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const setValue = (field: Field) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Errors = validateSignupInput(values);
    if (values.password !== values.passwordConfirm)
      nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const { email, nickname, password } = values;
      onSuccess(await signupWithEmail({ email, nickname, password }));
    } catch (caught) {
      const error = toApiError(caught);
      setErrors(
        Object.keys(error.fields).length > 0
          ? error.fields
          : { form: error.message },
      );
      setPending(false);
    }
  };

  return { values, setValue, errors, pending, submit };
}
