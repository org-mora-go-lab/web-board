"use client";

import { useRouter } from "next/navigation";

import { useRequireLogin } from "@/src/entity/auth";
import { createPost, type PostInput } from "@/src/entity/post";

export function usePostWrite() {
  const router = useRouter();
  const { ready } = useRequireLogin();

  return {
    ready,
    submit: async (input: PostInput) => {
      const post = await createPost(input);
      router.push(`/posts/${post.id}`);
    },
    cancel: () => router.push("/"),
  };
}
