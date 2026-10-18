import { expect, test } from "@playwright/test";

import { createPostByApi, signupByApi, uniqueId } from "../__util__";

test("3. q로 제목 또는 내용을 검색하며 %, _는 문자 그대로 검색한다", async ({ request }) => {
  const tag = uniqueId("like");
  await signupByApi(request);
  const literal = await createPostByApi(request, { title: `${tag} 100%_할인` });
  await createPostByApi(request, { title: `${tag} 100ab할인` });
  const byContent = await createPostByApi(request, { content: `본문 키워드 ${tag}-body` });

  const search = async (q: string) =>
    (await (await request.get(`/api/posts?q=${encodeURIComponent(q)}`)).json()).posts.map(
      ({ id }: { id: number }) => id,
    );

  expect(await search(`${tag} 100%_`)).toEqual([literal.id]);
  expect(await search(`${tag}-body`)).toEqual([byContent.id]);
  expect(await search(`  ${tag}-body  `)).toEqual([byContent.id]);
});
