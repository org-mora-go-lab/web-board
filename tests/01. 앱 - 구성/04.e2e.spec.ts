import { expect, test } from "@playwright/test";

import { MOCK_APP_BASE_URL, MOCK_APP_OAUTH_URL } from "../__constant__";
import { contentField, titleField, uniqueId } from "../__util__";

test.use({ baseURL: MOCK_APP_BASE_URL });
test.setTimeout(90_000);

test("4. mock 명령으로 실행한 환경에서 기본 mock 계정으로 로그인하고 게시글 CRUD와 로그아웃을 사용할 수 있다", async ({ page }) => {
  for (const provider of ["kakao"] as const) {
    await page.goto("/login");
    await page.getByRole("link", { name: "카카오로 시작하기" }).click();
    await page.waitForURL(`${MOCK_APP_OAUTH_URL}/${provider}/authorize?**`);
    await expect(page.getByLabel("계정 ID")).toHaveValue(`mock-${provider}-user`);
    await expect(page.getByLabel("닉네임")).toHaveValue("Mock User");
    await expect(page.getByLabel("이메일")).toHaveValue(`mock-${provider}@example.com`);
    await page.getByRole("button", { name: "동의하고 계속하기" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
    const user = (await (await page.request.get("/api/auth/me")).json()).user;
    expect(user).toMatchObject({ nickname: "Mock User", provider, email: `mock-${provider}@example.com` });

    const title = `Mock CRUD ${uniqueId(provider)}`;
    await page.getByRole("link", { name: "글쓰기" }).click();
    await titleField(page).fill(title);
    await contentField(page).fill("Mock CRUD content");
    await page.getByRole("button", { name: "등록" }).click();
    await expect(page).toHaveURL(/\/posts\/\d+$/);
    const postUrl = page.url();
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();
    await page.goto(`/?q=${encodeURIComponent(title)}`);
    await page.getByRole("link", { name: title, exact: true }).click();
    await page.getByRole("link", { name: "수정", exact: true }).click();
    await expect(titleField(page)).toHaveValue(title);
    await titleField(page).fill(`${title} edited`);
    await contentField(page).fill("Edited mock content");
    await page.getByRole("button", { name: "저장" }).click();
    await expect(page.getByRole("heading", { level: 1, name: `${title} edited` })).toBeVisible();
    await expect(page.locator(".post-article-content")).toHaveText("Edited mock content");
    await page.getByRole("button", { name: "삭제", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "삭제", exact: true }).click();
    await expect(page).toHaveURL("/");
    expect((await page.request.get(`/api${new URL(postUrl).pathname}`)).status()).toBe(404);
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page.getByRole("link", { name: "로그인", exact: true })).toBeVisible();
    expect((await (await page.request.get("/api/auth/me")).json()).user).toBeNull();
  }
});
