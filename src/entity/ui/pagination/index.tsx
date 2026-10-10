import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  getHref: (page: number) => string;
};

const WINDOW_SIZE = 5;

// Page links in fixed windows of five (1–5, 6–10, …) with previous/next window arrows.
export function Pagination({ page, totalPages, getHref }: Props) {
  if (totalPages <= 1) return null;
  const start = Math.floor((page - 1) / WINDOW_SIZE) * WINDOW_SIZE + 1;
  const end = Math.min(start + WINDOW_SIZE - 1, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {start > 1 && (
        <Link className="pagination-arrow" href={getHref(start - 1)} aria-label="이전 페이지 목록">
          <ChevronLeft size={16} />
        </Link>
      )}
      {pages.map((number) => (
        <Link
          key={number}
          className={`pagination-page ${number === page ? "is-current" : ""}`}
          href={getHref(number)}
          aria-current={number === page ? "page" : undefined}
          aria-label={`${number} 페이지`}
        >
          {number}
        </Link>
      ))}
      {end < totalPages && (
        <Link className="pagination-arrow" href={getHref(end + 1)} aria-label="다음 페이지 목록">
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
