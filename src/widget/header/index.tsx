"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/src/entity/auth";

import { UserMenu } from "./component";

const AUTH_PATHS = ["/login", "/signup"];

export function Header() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const loginHref = AUTH_PATHS.includes(pathname) || pathname === "/" ? "/login" : `/login?next=${encodeURIComponent(pathname)}`;

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="header-logo" href="/">
          <span className="header-mark" aria-hidden="true">B</span>
          Board
        </Link>
        <span className="header-divider" aria-hidden="true" />
        <Link className="header-section" href="/">Overview</Link>
        <nav className="header-nav" aria-label="사용자 메뉴">
          {ready &&
            (user ? (
              <UserMenu
                user={user}
                onLogout={async () => {
                  await logout();
                  router.push("/");
                }}
              />
            ) : (
              <Link className="button" href={loginHref}>
                로그인
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}
