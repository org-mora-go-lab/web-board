"use client";

import "./index.scss";

import { StatusMessage } from "@/src/entity/ui";
import { PostForm } from "@/src/feature";
import { Header } from "@/src/widget";

import { usePostWrite } from "./hook";

export function PostWrite() {
  const { ready, submit, cancel } = usePostWrite();

  return (
    <>
      <Header />
      <main className="post-write">
        <h1>글쓰기</h1>
        <section className="post-write-card">
          {ready ? (
            <PostForm submitLabel="등록" onSubmit={submit} onCancel={cancel} />
          ) : (
            <StatusMessage message="로그인 정보를 확인하는 중입니다." />
          )}
        </section>
      </main>
    </>
  );
}
