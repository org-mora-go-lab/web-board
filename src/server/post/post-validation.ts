import { validatePostInput } from "@/src/entity/post/util";

import { HttpError, readString, validationError } from "../http";
import type { PostInput } from "./post-repository";

export function parsePostInput(body: Record<string, unknown>): PostInput {
  const input = {
    title: readString(body.title).trim(),
    content: readString(body.content),
  };
  const errors = validatePostInput(input);
  if (Object.keys(errors).length > 0) throw validationError(errors);
  return input;
}

export const postNotFound = () =>
  new HttpError(404, "POST_NOT_FOUND", "게시글을 찾을 수 없습니다.");

// Route ids are positive integers; anything else is treated as a missing post.
export function parsePostId(value: string) {
  const id = /^[1-9]\d{0,15}$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(id)) throw postNotFound();
  return id;
}

// Lenient paging: invalid values fall back to the default and `size` is capped.
export function parsePositiveInt(
  value: string | null,
  fallback: number,
  max = Number.MAX_SAFE_INTEGER,
) {
  const number = Number(value);
  if (!value || !Number.isInteger(number) || number < 1) return fallback;
  return Math.min(number, max);
}
