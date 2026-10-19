import {
  EMAIL_PATTERN,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../constant";
import type { SignupInput } from "../type";

// Shared by the signup form and the API so both report identical messages per field.
export function validateSignupInput({
  email,
  nickname,
  password,
}: SignupInput) {
  const errors: Partial<Record<keyof SignupInput, string>> = {};
  if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  const nicknameLength = nickname.trim().length;
  if (
    nicknameLength < NICKNAME_MIN_LENGTH ||
    nicknameLength > NICKNAME_MAX_LENGTH
  ) {
    errors.nickname = `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해 주세요.`;
  }
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    errors.password = `비밀번호는 ${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}자로 입력해 주세요.`;
  }
  return errors;
}
