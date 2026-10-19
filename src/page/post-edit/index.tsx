"use client";

import "./index.scss";

import Link from "next/link";

import { StatusMessage } from "@/src/entity/ui";
import { PostForm } from "@/src/feature";
import { Header } from "@/src/widget";

import { usePostEdit } from "./hook";

type Props = {
  id: string;
};

export function PostEdit({ id }: Props) {
  const { post, error, loading, isAuthor, submit, cancel } = usePostEdit(id);
  const backToList = (
    <Link className="button" href="/">
      목록으로
    </Link>
  );

  const body = loading ? (
    <StatusMessage message="게시글을 불러오는 중입니다." />
  ) : error || !post ? (
    <StatusMessage
      tone="error"
      message={
        error?.status === 404 || !error
          ? "게시글을 찾을 수 없습니다."
          : error.message
      }
      action={backToList}
    />
  ) : !isAuthor ? (
    <StatusMessage
      tone="error"
      message="수정 권한이 없습니다."
      action={backToList}
    />
  ) : (
    <PostForm
      initialValue={{ title: post.title, content: post.content }}
      submitLabel="저장"
      onSubmit={submit}
      onCancel={cancel}
    />
  );

  return (
    <>
      <Header />
      <main className="post-edit">
        <h1>글 수정</h1>
        <section className="post-edit-card">{body}</section>
      </main>
    </>
  );
}
