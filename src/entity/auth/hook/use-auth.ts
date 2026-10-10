"use client";

import { useEffect } from "react";

import { useAuthStore } from "../store";

export function useAuth() {
  const { user, status, load, setUser, logout } = useAuthStore();

  useEffect(() => {
    load();
  }, [load]);

  return { user, ready: status === "ready", setUser, logout };
}
