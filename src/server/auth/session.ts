import { createHash, randomBytes } from "node:crypto";

import type { NextRequest, NextResponse } from "next/server";

import { getDb } from "../db";
import { unauthorized } from "../http";
import { findUserById, type UserDto } from "../user";

export const SESSION_COOKIE = "board_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Only the SHA-256 of the token is stored, so a leaked database cannot be replayed as sessions.
const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

// Secure cookies are dropped on plain-http origins, so only require them when the request is https.
export const isSecureRequest = (request: NextRequest) =>
  request.nextUrl.protocol === "https:";

export async function deleteSession(token: string) {
  const db = await getDb();
  await db.run("DELETE FROM sessions WHERE token_hash = ?", [hashToken(token)]);
}

export async function getSessionUser(
  request: NextRequest,
): Promise<UserDto | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const session = await db.get<{ user_id: number; expires_at: string }>(
    "SELECT user_id, expires_at FROM sessions WHERE token_hash = ?",
    [hashToken(token)],
  );
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await deleteSession(token);
    return null;
  }
  return findUserById(session.user_id);
}

export async function requireUser(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) throw unauthorized();
  return user;
}

// Issues a new session for `user` and attaches its HttpOnly cookie to `response`.
export async function signIn(
  request: NextRequest,
  response: NextResponse,
  user: UserDto,
) {
  // Rotate: the token the browser held before signing in is revoked.
  const previousToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (previousToken) await deleteSession(previousToken);
  const db = await getDb();
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_TTL_MS);
  await db.run(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    [hashToken(token), user.id, expires.toISOString()],
  );
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    path: "/",
    expires,
  });
  return response;
}

export async function signOut(request: NextRequest, response: NextResponse) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
