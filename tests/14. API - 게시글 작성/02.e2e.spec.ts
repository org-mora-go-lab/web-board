import { expect, test } from "@playwright/test";

test("2. 로그인하지 않은 사용자의 작성 요청은 401 UNAUTHORIZED를 반환한다", async ({
  request,
}) => {
  const response = await request.post("/api/posts", {
    data: { title: "익명 글", content: "내용" },
  });

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({
    error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
  });
});
