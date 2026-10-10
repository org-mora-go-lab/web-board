"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { toApiError } from "@/src/entity/api";
import { useAuth } from "@/src/entity/auth";
import { useApiQuery } from "@/src/entity/hook";
import { deletePost, fetchPost } from "@/src/entity/post";

export function usePostDetail(id: string) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: post, error, loading } = useApiQuery(id, () => fetchPost(id));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const confirmDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      router.push("/");
    } catch (caught) {
      setDeleteError(toApiError(caught).message);
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return {
    post,
    error,
    loading,
    isAuthor: !!user && !!post && user.id === post.author.id,
    confirmOpen,
    deleting,
    deleteError,
    openConfirm: () => setConfirmOpen(true),
    closeConfirm: () => setConfirmOpen(false),
    confirmDelete,
  };
}
