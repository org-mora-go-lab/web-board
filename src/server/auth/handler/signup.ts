import { NextResponse } from "next/server";

import { validateSignupInput } from "@/src/entity/auth/util";

import { handle, HttpError, readJsonBody, readString, validationError } from "../../http";
import { createUser, findAccount } from "../../user";
import { hashPassword } from "../password";
import { signIn } from "../session";

const EMAIL_TAKEN_MESSAGE = "이미 가입된 이메일입니다.";
const emailTaken = () => new HttpError(409, "EMAIL_TAKEN", EMAIL_TAKEN_MESSAGE, { email: EMAIL_TAKEN_MESSAGE });

export const signup = handle(async (request) => {
  const body = await readJsonBody(request);
  const email = readString(body.email).trim().toLowerCase();
  const nickname = readString(body.nickname).trim();
  const password = readString(body.password);

  const errors = validateSignupInput({ email, nickname, password });
  if (Object.keys(errors).length > 0) throw validationError(errors);
  if (await findAccount("email", email)) throw emailTaken();

  const passwordHash = await hashPassword(password);
  const user = await createUser({ nickname, email, provider: "email", providerAccountId: email, passwordHash }).catch(
    (error: unknown) => {
      // A concurrent signup with the same email can pass the check above and hit the UNIQUE index.
      if (String(error).includes("UNIQUE")) throw emailTaken();
      throw error;
    },
  );
  return signIn(request, NextResponse.json({ user }, { status: 201 }), user);
});
