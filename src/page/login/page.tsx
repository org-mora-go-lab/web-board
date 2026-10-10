import type { Metadata } from "next";

import { toSafeNextPath } from "@/src/entity/auth/util";

import { Login } from "./index";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  return (
    <Login
      next={toSafeNextPath(typeof next === "string" ? next : null)}
      errorCode={typeof error === "string" ? error : ""}
    />
  );
}
