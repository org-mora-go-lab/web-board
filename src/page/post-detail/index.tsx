"use client";

import "./index.scss";

import { List, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { ConfirmPopup, StatusMessage } from "@/src/entity/ui";
import { Header, PostArticle } from "@/src/widget";

import { usePostDetail } from "./hook";

type Props = {
  id: string;
};

const backToList = (
  <Link className="button" href="/">
    <List size={15} aria-hidden="true" />
    목록
  </Link>
);

export function PostDetail({ id }: Props) {
  const { post, error, loading, isAuthor, confirmOpen, deleting, deleteError, openConfirm, closeConfirm, confirmDelete } =
    usePostDetail(id);

  const body = loading ? (
    <StatusMessage message="게시글을 불러오는 중입니다." />
  ) : error || !post ? (
    <StatusMessage
      tone="error"
      message={error?.status === 404 || !error ? "게시글을 찾을 수 없습니다." : error.message}
      action={backToList}
    />
  ) : (
    <PostArticle
      post={post}
      actions={
        <>
          {backToList}
          {isAuthor && (
            <div className="post-detail-owner-actions">
              <Link className="button" href={`/posts/${post.id}/edit`}>
                <Pencil size={15} aria-hidden="true" />
                수정
              </Link>
              <button className="button is-danger" type="button" onClick={openConfirm}>
                <Trash2 size={15} aria-hidden="true" />
                삭제
              </button>
            </div>
          )}
        </>
      }
    />
  );

  return (
    <>
      <Header />
      <main className="post-detail">
        {deleteError && (
          <p className="post-detail-alert" role="alert">
            {deleteError}
          </p>
        )}
        {body}
      </main>
      {confirmOpen && (
        <ConfirmPopup
          title="게시글 삭제"
          message="삭제한 게시글은 복구할 수 없습니다. 삭제하시겠습니까?"
          pending={deleting}
          onConfirm={confirmDelete}
          onCancel={closeConfirm}
        />
      )}
    </>
  );
}
