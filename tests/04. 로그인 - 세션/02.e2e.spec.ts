import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../__constant__";
import {
  headerLoginLink,
  loginAsNewUser,
  logoutButton,
  readMe,
} from "../__util__";

test("2. 로그아웃을 누르면 세션을 삭제하고 헤더에 로그인 버튼을 표시한다", async ({
  page,
  context,
}) => {
  await loginAsNewUser(page);
  await page.goto("/");
  await logoutButton(page).click();

  await expect(headerLoginLink(page)).toBeVisible();
  await expect(logoutButton(page)).toHaveCount(0);
  expect(
    (await context.cookies()).some(({ name }) => name === SESSION_COOKIE),
  ).toBe(false);
  expect(await readMe(page)).toBeNull();
});
