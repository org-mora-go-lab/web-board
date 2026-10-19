import type { Metadata } from "next";

import { toSafeNextPath } from "@/src/entity/auth/util";

import { Signup } from "./index";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { title: "회원가입" };

export default async function SignupPage({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <Signup next={toSafeNextPath(typeof next === "string" ? next : null)} />
  );
}
