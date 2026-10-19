"use client";

import "./index.scss";

import Link from "next/link";

import { useRedirectWhenSignedIn } from "@/src/entity/auth";
import { EmailSignupForm, SocialLogin } from "@/src/feature";
import { Header } from "@/src/widget";

type Props = {
  next: string;
};

export function Signup({ next }: Props) {
  const { setUser } = useRedirectWhenSignedIn(next);
  const loginHref =
    next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`;

  return (
    <>
      <Header />
      <main className="signup">
        <section className="signup-card">
          <h1>회원가입</h1>
          <p className="signup-description">
            카카오 계정으로 바로 가입할 수 있어요.
          </p>
          <SocialLogin next={next} />
          <div className="signup-divider">또는 이메일로 가입</div>
          <EmailSignupForm onSuccess={setUser} />
          <p className="signup-footer">
            이미 계정이 있나요?
            <Link href={loginHref}>로그인</Link>
          </p>
        </section>
      </main>
    </>
  );
}
