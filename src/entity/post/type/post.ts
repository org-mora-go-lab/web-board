export type PostAuthor = { id: number; nickname: string };

export type PostSummary = {
  id: number;
  title: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};

export type Post = PostSummary & { content: string };

export type PostList = {
  posts: PostSummary[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export type PostInput = { title: string; content: string };
