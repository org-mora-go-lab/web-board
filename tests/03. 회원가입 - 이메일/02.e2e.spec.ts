import { expect, test } from "@playwright/test";

import { readMe } from "../__util__";
import { fillSignupForm } from "./__util__";

test("2. 이메일·닉네임·비밀번호 형식이 틀리거나 비밀번호 확인이 다르면 가입하지 않고 입력란 아래에 오류를 표시한다", async ({
  page,
}) => {
  await page.goto("/signup");
  await fillSignupForm(page, {
    email: "not-an-email",
    nickname: "a",
    password: "short",
    passwordConfirm: "different",
  });

  await expect(
    page.getByText("올바른 이메일 주소를 입력해 주세요."),
  ).toBeVisible();
  await expect(
    page.getByText("닉네임은 2~20자로 입력해 주세요."),
  ).toBeVisible();
  await expect(
    page.getByText("비밀번호는 8~72자로 입력해 주세요."),
  ).toBeVisible();
  await expect(page.getByText("비밀번호가 일치하지 않습니다.")).toBeVisible();
  await expect(page.getByLabel("이메일")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page).toHaveURL("/signup");
  expect(await readMe(page)).toBeNull();
});
