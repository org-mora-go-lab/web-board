import { expect, test } from "@playwright/test";

import { pageAlert } from "../__util__";
import { mockPostListResponse, SERVER_ERROR_BODY } from "./__mock__";

test("5. 목록을 불러오지 못하면 서버가 보낸 오류 메시지를 표시한다", async ({ page }) => {
  await mockPostListResponse(page, 500, SERVER_ERROR_BODY);
  await page.goto("/");

  await expect(pageAlert(page)).toHaveText(SERVER_ERROR_BODY.error.message);
});
