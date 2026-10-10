import type { Page } from "@playwright/test";

type SignupFormValues = { email: string; nickname: string; password: string; passwordConfirm?: string };

export async function fillSignupForm(page: Page, values: SignupFormValues) {
  await page.getByLabel("이메일").fill(values.email);
  await page.getByLabel("닉네임").fill(values.nickname);
  await page.getByLabel("비밀번호", { exact: true }).fill(values.password);
  await page.getByLabel("비밀번호 확인").fill(values.passwordConfirm ?? values.password);
  await page.getByRole("button", { name: "회원가입" }).click();
}
