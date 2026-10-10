"use client";

import "./index.scss";

import { PenSquare } from "lucide-react";
import Link from "next/link";

import { Pagination, StatusMessage } from "@/src/entity/ui";
import { PostSearch } from "@/src/feature";
import { Header, PostTable } from "@/src/widget";

import { useHome } from "./hook";

type Props = {
  page: number;
  query: string;
};

export function Home({ page, query }: Props) {
  const { list, error, loading, getPageHref, search } = useHome(page, query);

  const board = loading ? (
    <StatusMessage message="게시글을 불러오는 중입니다." />
  ) : error || !list ? (
    <StatusMessage tone="error" message={error?.message ?? "게시글을 불러오지 못했습니다."} />
  ) : list.posts.length === 0 ? (
    <StatusMessage message={query ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."} />
  ) : (
    <PostTable posts={list.posts} />
  );

  return (
    <>
      <Header />
      <main className="home">
        <div className="home-heading">
          <h1>게시판</h1>
          {list && <span className="home-total">{query ? `검색 결과 ${list.total}개` : `전체 ${list.total}개`}</span>}
        </div>
        <div className="home-toolbar">
          <PostSearch key={query} query={query} onSearch={search} />
          <Link className="button is-primary" href="/posts/new">
            <PenSquare size={16} aria-hidden="true" />
            글쓰기
          </Link>
        </div>
        <section className="home-board" aria-label="게시글 목록">
          {board}
        </section>
        {list && <Pagination page={list.page} totalPages={list.totalPages} getHref={getPageHref} />}
      </main>
    </>
  );
}
