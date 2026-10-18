import type { Page } from "@playwright/test";

export const EMPTY_POST_LIST = { posts: [], page: 1, size: 10, total: 0, totalPages: 1 };

export const SERVER_ERROR_BODY = {
  error: { code: "INTERNAL_ERROR", message: "서버 오류가 발생했습니다." },
};

// Replaces the list API response so states that depend on global data can be rendered deterministically.
export async function mockPostListResponse(page: Page, status: number, body: unknown) {
  await page.route(/\/api\/posts\?/, (route) => route.fulfill({ status, json: body }));
}
