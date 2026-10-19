"use client";

import { useRouter } from "next/navigation";

import { useApiQuery } from "@/src/entity/hook";
import { fetchPosts } from "@/src/entity/post";

// Page 1 and an empty query are omitted so the canonical list URL stays `/`.
function buildListHref(page: number, query: string) {
  const search = new URLSearchParams();
  if (page > 1) search.set("page", String(page));
  if (query) search.set("q", query);
  const queryString = search.toString();
  return queryString ? `/?${queryString}` : "/";
}

export function useHome(page: number, query: string) {
  const router = useRouter();
  const {
    data: list,
    error,
    loading,
  } = useApiQuery(`${page}:${query}`, () => fetchPosts({ page, query }));

  return {
    list,
    error,
    loading,
    getPageHref: (target: number) => buildListHref(target, query),
    search: (nextQuery: string) => router.push(buildListHref(1, nextQuery)),
  };
}
