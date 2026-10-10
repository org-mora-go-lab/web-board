import type { Metadata } from "next";

import { PostWrite } from "./index";

export const metadata: Metadata = { title: "글쓰기" };

export default function PostWritePage() {
  return <PostWrite />;
}
