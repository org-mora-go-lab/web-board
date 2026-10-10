"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "./use-auth";

// Leaves the page for `next` as soon as a session exists (already signed in, or just signed in).
export function useRedirectWhenSignedIn(next: string) {
  const { user, ready, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  return { setUser };
}
