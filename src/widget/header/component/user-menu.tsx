"use client";

import { LogOut } from "lucide-react";

import type { User } from "@/src/entity/auth";

type Props = {
  user: User;
  onLogout: () => void;
};

const PROVIDER_LABELS = { email: "이메일", kakao: "카카오", google: "Google" };

export function UserMenu({ user, onLogout }: Props) {
  return (
    <div className="user-menu">
      <span className={`user-menu-provider is-${user.provider}`}>{PROVIDER_LABELS[user.provider]}</span>
      <strong className="user-menu-nickname">{user.nickname}</strong>
      <button className="button is-ghost" type="button" onClick={onLogout}>
        <LogOut size={15} aria-hidden="true" />
        로그아웃
      </button>
    </div>
  );
}
