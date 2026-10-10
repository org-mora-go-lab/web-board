import { create } from "zustand";

import { fetchMe, logoutRequest } from "../api";
import type { User } from "../type";

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "ready";
  // Loads the session user once; later calls are no-ops.
  load: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  load: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    const user = await fetchMe().catch(() => null);
    set({ user, status: "ready" });
  },
  setUser: (user) => set({ user, status: "ready" }),
  logout: async () => {
    await logoutRequest();
    set({ user: null, status: "ready" });
  },
}));
