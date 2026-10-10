import { expect, test } from "@playwright/test";

import { createPostByApi, postRows, signupByApi, uniqueId } from "../__util__";

test("2. 한 페이지에 10개씩 표시하고 페이지 번호로 이동하며 현재 페이지를 URL page에 반영한다", async ({
  page,
  request,
}) => {
  const tag = uniqueId("paging");
  await signupByApi(request);
  const posts = [];
  for (let index = 1; index <= 11; index += 1) {
    posts.push(await createPostByApi(request, { title: `${tag} ${index}번 글` }));
  }

  await page.goto(`/?q=${tag}`);
  await expect(postRows(page)).toHaveCount(10);
  const pagination = page.getByRole("navigation", { name: "페이지 이동" });
  await expect(pagination.getByRole("link", { name: "1 페이지" })).toHaveAttribute("aria-current", "page");

  await pagination.getByRole("link", { name: "2 페이지" }).click();
  await expect(page).toHaveURL(`/?page=2&q=${tag}`);
  await expect(postRows(page)).toHaveCount(1);
  await expect(postRows(page).getByRole("link")).toHaveText(posts[0].title);
  await expect(pagination.getByRole("link", { name: "2 페이지" })).toHaveAttribute("aria-current", "page");
});
