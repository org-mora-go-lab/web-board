"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  // Remount with `key={query}` so the input follows URL changes.
  query: string;
  onSearch: (query: string) => void;
};

export function PostSearch({ query, onSearch }: Props) {
  const [value, setValue] = useState(query);

  return (
    <form
      className="post-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
    >
      <Search size={16} aria-hidden="true" />
      <input
        type="search"
        aria-label="게시글 검색"
        placeholder="제목, 내용 검색"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="button is-ghost" type="submit">
        검색
      </button>
    </form>
  );
}
