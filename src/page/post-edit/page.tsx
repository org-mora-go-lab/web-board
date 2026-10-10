import type { Metadata } from "next";

import { PostEdit } from "./index";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = { title: "글 수정" };

export default async function PostEditPage({ params }: Props) {
  const { id } = await params;
  return <PostEdit id={id} />;
}
