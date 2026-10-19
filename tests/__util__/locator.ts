import type { Page } from "@playwright/test";

export const header = (page: Page) => page.locator("header.header");
export const logoutButton = (page: Page) =>
  page.getByRole("button", { name: "로그아웃" });
export const headerLoginLink = (page: Page) =>
  header(page).getByRole("link", { name: "로그인" });
export const searchInput = (page: Page) =>
  page.getByRole("searchbox", { name: "게시글 검색" });
export const postRows = (page: Page) => page.locator("tbody tr.post-row");
export const titleField = (page: Page) => page.getByLabel("제목");
export const contentField = (page: Page) => page.getByLabel("내용");

// Runs a list search through the UI.
export async function searchPosts(page: Page, query: string) {
  await searchInput(page).fill(query);
  await searchInput(page).press("Enter");
}

export async function readMe(page: Page) {
  const { user } = await (await page.request.get("/api/auth/me")).json();
  return user as {
    id: number;
    nickname: string;
    email: string | null;
    provider: string;
  } | null;
}

// Scoped to <main> because Next.js renders its own route announcer with role="alert".
export const pageAlert = (page: Page) =>
  page.getByRole("main").getByRole("alert");
