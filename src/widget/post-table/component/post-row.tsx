"use client";

import Link from "next/link";

import type { PostSummary } from "@/src/entity/post";
import { formatListDate } from "@/src/entity/util";

type Props = {
  post: PostSummary;
};

export function PostRow({ post }: Props) {
  return (
    <tr className="post-row">
      <td className="post-row-id">{post.id}</td>
      <td className="post-row-title">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </td>
      <td className="post-row-author">{post.author.nickname}</td>
      <td className="post-row-date">
        <time dateTime={post.createdAt}>{formatListDate(post.createdAt)}</time>
      </td>
    </tr>
  );
}
