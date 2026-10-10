import type { Metadata } from "next";

import { PostDetail } from "./index";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "게시글" };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  return <PostDetail id={id} />;
}
