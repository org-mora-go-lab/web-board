"use client";

import "./index.scss";

import Link from "next/link";

import { LOGIN_ERROR_MESSAGES, useRedirectWhenSignedIn } from "@/src/entity/auth";
import { EmailLoginForm, SocialLogin } from "@/src/feature";
import { Header } from "@/src/widget";

type Props = {
  next: string;
  errorCode: string;
};

export function Login({ next, errorCode }: Props) {
  const { setUser } = useRedirectWhenSignedIn(next);
  const errorMessage = LOGIN_ERROR_MESSAGES[errorCode];
  const signupHref = next === "/" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;

  return (
    <>
      <Header />
      <main className="login">
        <section className="login-card">
          <h1>로그인</h1>
          <p className="login-description">카카오 또는 이메일로 시작하세요.</p>
          {errorMessage && (
            <p className="login-alert" role="alert">
              {errorMessage}
            </p>
          )}
          <SocialLogin next={next} />
          <div className="login-divider">또는 이메일로 로그인</div>
          <EmailLoginForm onSuccess={setUser} />
          <p className="login-footer">
            아직 계정이 없나요?
            <Link href={signupHref}>이메일로 회원가입</Link>
          </p>
        </section>
      </main>
    </>
  );
}
