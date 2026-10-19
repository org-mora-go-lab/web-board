import { expect, test } from "@playwright/test";

import { signupByApi } from "../__util__";

test("3. 제목·내용이 비었거나 길이를 넘으면 400 VALIDATION_ERROR, 본문이 JSON 객체가 아니면 400 INVALID_JSON이다", async ({
  request,
}) => {
  await signupByApi(request);
  const cases = [
    { data: { title: "", content: "내용" }, field: "title" },
    { data: { title: "   ", content: "내용" }, field: "title" },
    { data: { title: "가".repeat(101), content: "내용" }, field: "title" },
    { data: { title: "제목", content: "" }, field: "content" },
    { data: { title: "제목", content: "가".repeat(5001) }, field: "content" },
  ];

  for (const { data, field } of cases) {
    const response = await request.post("/api/posts", { data });
    expect(response.status()).toBe(400);
    const { error } = await response.json();
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(Object.keys(error.fields)).toEqual([field]);
  }

  const boundary = await request.post("/api/posts", {
    data: { title: "가".repeat(100), content: "가".repeat(5000) },
  });
  expect(boundary.status()).toBe(201);

  const rawBodies = [
    { body: "not json", contentType: "application/json" },
    { body: "[1, 2]", contentType: "application/json" },
    {
      body: JSON.stringify({ title: "제목", content: "내용" }),
      contentType: "text/plain",
    },
  ];
  for (const { body, contentType } of rawBodies) {
    const response = await request.post("/api/posts", {
      data: body,
      headers: { "Content-Type": contentType },
    });
    expect(response.status()).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_JSON");
  }
});
