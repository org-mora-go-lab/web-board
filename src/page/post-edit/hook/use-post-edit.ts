"use client";

import { useRouter } from "next/navigation";

import { useRequireLogin } from "@/src/entity/auth";
import { useApiQuery } from "@/src/entity/hook";
import { fetchPost, type PostInput, updatePost } from "@/src/entity/post";

export function usePostEdit(id: string) {
  const router = useRouter();
  const { user, ready } = useRequireLogin();
  const { data: post, error, loading } = useApiQuery(id, () => fetchPost(id));
  const detailHref = `/posts/${id}`;

  return {
    post,
    error,
    loading: loading || !ready,
    isAuthor: !!user && !!post && user.id === post.author.id,
    submit: async (input: PostInput) => {
      await updatePost(post!.id, input);
      router.push(detailHref);
    },
    cancel: () => router.push(detailHref),
  };
}
