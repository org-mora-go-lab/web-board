import { expect, test } from "@playwright/test";

test("2. POST /api/auth/signup은 형식이 올바르지 않으면 400 VALIDATION_ERROR와 필드별 오류를 반환한다", async ({
  request,
}) => {
  const response = await request.post("/api/auth/signup", {
    data: { email: "wrong-email", nickname: "a", password: "1234567" },
  });

  expect(response.status()).toBe(400);
  const { error } = await response.json();
  expect(error.code).toBe("VALIDATION_ERROR");
  expect(error.fields).toEqual({
    email: "올바른 이메일 주소를 입력해 주세요.",
    nickname: "닉네임은 2~20자로 입력해 주세요.",
    password: "비밀번호는 8~72자로 입력해 주세요.",
  });

  const missing = await request.post("/api/auth/signup", { data: {} });
  expect(missing.status()).toBe(400);
  expect((await missing.json()).error.code).toBe("VALIDATION_ERROR");
});
