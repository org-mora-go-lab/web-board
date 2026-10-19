import { expect, test } from "@playwright/test";

test("2. size 기본값은 10, 최댓값은 50이며 올바르지 않은 page와 size는 보정한다", async ({
  request,
}) => {
  const cases = [
    { query: "", page: 1, size: 10 },
    { query: "?size=999", page: 1, size: 50 },
    { query: "?size=20&page=3", page: 3, size: 20 },
    { query: "?size=0&page=-1", page: 1, size: 10 },
    { query: "?size=abc&page=1.5", page: 1, size: 10 },
  ];

  for (const { query, page, size } of cases) {
    const body = await (await request.get(`/api/posts${query}`)).json();
    expect({ query, page: body.page, size: body.size }).toEqual({
      query,
      page,
      size,
    });
    expect(body.posts.length).toBeLessThanOrEqual(size);
  }
});
