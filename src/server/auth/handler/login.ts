import { NextResponse } from "next/server";

import { handle, HttpError, readJsonBody, readString } from "../../http";
import { findAccount, findUserById } from "../../user";
import { verifyPassword } from "../password";
import { signIn } from "../session";

const invalidCredentials = () =>
  new HttpError(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");

export const login = handle(async (request) => {
  const body = await readJsonBody(request);
  const email = readString(body.email).trim().toLowerCase();
  const password = readString(body.password);

  const account = await findAccount("email", email);
  if (!account?.passwordHash || !(await verifyPassword(password, account.passwordHash))) {
    throw invalidCredentials();
  }
  const user = await findUserById(account.userId);
  if (!user) throw invalidCredentials();
  return signIn(request, NextResponse.json({ user }), user);
});
