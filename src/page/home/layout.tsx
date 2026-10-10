import "@/src/entity/style/global.scss";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Board", template: "%s | Board" },
  description: "카카오·Google·이메일로 가입해 글을 나누는 게시판",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
