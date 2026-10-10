"use client";

import { type FormEvent, useState } from "react";

import { toApiError } from "@/src/entity/api";
import { loginWithEmail, type User } from "@/src/entity/auth";

export function useEmailLoginForm(onSuccess: (user: User) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setPending(true);
    setError("");
    try {
      onSuccess(await loginWithEmail({ email, password }));
    } catch (caught) {
      setError(toApiError(caught).message);
      setPending(false);
    }
  };

  return { email, setEmail, password, setPassword, error, pending, submit };
}
