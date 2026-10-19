"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "./use-auth";

// Sends anonymous visitors to /login and brings them back to the current path afterwards.
export function useRequireLogin() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  return { user, ready: ready && !!user };
}
