import { expect, test } from "@playwright/test";

import { header, newEmailAccount, readMe } from "../__util__";
import { fillSignupForm } from "./__util__";

test("1. 이메일, 닉네임, 비밀번호로 가입하면 바로 로그인되어 목록으로 이동하고 헤더에 닉네임을 표시한다", async ({
  page,
}) => {
  const account = newEmailAccount();
  await page.goto("/signup");
  await fillSignupForm(page, account);

  await expect(page).toHaveURL("/");
  await expect(header(page).getByText(account.nickname, { exact: true })).toBeVisible();
  expect(await readMe(page)).toEqual(
    expect.objectContaining({ email: account.email, nickname: account.nickname, provider: "email" }),
  );
});
