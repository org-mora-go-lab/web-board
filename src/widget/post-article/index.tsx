"use client";

import type { ReactNode } from "react";

import type { Post } from "@/src/entity/post";
import { formatDateTime } from "@/src/entity/util";

type Props = {
  post: Post;
  actions?: ReactNode;
};

export function PostArticle({ post, actions }: Props) {
  const edited = post.updatedAt !== post.createdAt;

  return (
    <article className="post-article">
      <header className="post-article-header">
        <h1>{post.title}</h1>
        <div className="post-article-meta">
          <span className="post-article-author">{post.author.nickname}</span>
          <time dateTime={post.createdAt}>{formatDateTime(post.createdAt)}</time>
          {edited && (
            <span className="post-article-edited" title={formatDateTime(post.updatedAt)}>
              수정됨
            </span>
          )}
        </div>
      </header>
      <div className="post-article-content">{post.content}</div>
      {actions && <footer className="post-article-actions">{actions}</footer>}
    </article>
  );
}
