import { expect, request as requestFactory, test } from "@playwright/test";

import { BASE_URL, SESSION_COOKIE } from "../__constant__";
import { signupByApi } from "../__util__";

test("6. POST /api/auth/logout은 204를 반환하고 세션을 무효화한다", async ({
  request,
}) => {
  await signupByApi(request);
  const { cookies } = await request.storageState();
  const token = cookies.find(({ name }) => name === SESSION_COOKIE)?.value;
  expect(token).toBeTruthy();

  const response = await request.post("/api/auth/logout");
  expect(response.status()).toBe(204);
  expect(await (await request.get("/api/auth/me")).json()).toEqual({
    user: null,
  });

  // Replaying the old token must fail too, proving the session was deleted server-side.
  const replay = await requestFactory.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: { cookie: `${SESSION_COOKIE}=${token}` },
  });
  expect(await (await replay.get("/api/auth/me")).json()).toEqual({
    user: null,
  });
  expect(
    (
      await replay.post("/api/posts", { data: { title: "t", content: "c" } })
    ).status(),
  ).toBe(401);
});
