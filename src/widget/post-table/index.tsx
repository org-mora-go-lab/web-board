"use client";

import type { PostSummary } from "@/src/entity/post";

import { PostRow } from "./component";

type Props = {
  posts: PostSummary[];
};

export function PostTable({ posts }: Props) {
  return (
    <table className="post-table">
      <colgroup>
        <col className="post-table-id" />
        <col />
        <col className="post-table-author" />
        <col className="post-table-date" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </tbody>
    </table>
  );
}
