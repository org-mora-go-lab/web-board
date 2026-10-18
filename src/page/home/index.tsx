"use client";

import "./index.scss";

import { ArrowUpRight, Layers3, PenSquare } from "lucide-react";
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
        <div className="home-breadcrumb" aria-label="현재 위치">
          <span>Workspace</span>
          <span className="home-breadcrumb-separator">/</span>
          <strong>Board</strong>
        </div>
        <div className="home-heading">
          <div>
            <span className="home-eyebrow">OVERVIEW</span>
            <h1>게시판</h1>
            <p>새로운 생각을 공유하고 대화를 이어가세요.</p>
          </div>
          <Link className="button is-primary home-create" href="/posts/new">
            <PenSquare size={15} aria-hidden="true" />
            글쓰기
          </Link>
        </div>
        <div className="home-metrics">
          <div className="home-metric">
            <span>전체 게시글</span>
            <strong>{list ? list.total : "—"}</strong>
            <Layers3 size={18} aria-hidden="true" />
          </div>
          <div className="home-metric">
            <span>현재 페이지</span>
            <strong>{list ? `${list.page} / ${Math.max(list.totalPages, 1)}` : "—"}</strong>
            <ArrowUpRight size={18} aria-hidden="true" />
          </div>
        </div>
        <section className="home-content" aria-label="게시글 목록">
          <div className="home-section-heading">
            <div>
              <h2>게시글 목록</h2>
              <p>커뮤니티의 모든 이야기를 살펴보세요.</p>
            </div>
            {list && <span className="home-total">{query ? `검색 결과 ${list.total}개` : `전체 ${list.total}개`}</span>}
          </div>
          <div className="home-toolbar">
            <PostSearch key={query} query={query} onSearch={search} />
          </div>
          <div className="home-board">{board}</div>
        </section>
        {list && <Pagination page={list.page} totalPages={list.totalPages} getHref={getPageHref} />}
      </main>
    </>
  );
}
