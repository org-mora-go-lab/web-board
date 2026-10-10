import { POST_CONTENT_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from "../constant";
import type { PostInput } from "../type";

// Shared by the post form and the API so both report identical messages per field.
export function validatePostInput({ title, content }: PostInput) {
  const errors: Partial<Record<keyof PostInput, string>> = {};
  if (!title.trim()) errors.title = "제목을 입력해 주세요.";
  else if (title.trim().length > POST_TITLE_MAX_LENGTH) {
    errors.title = `제목은 ${POST_TITLE_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }
  if (!content.trim()) errors.content = "내용을 입력해 주세요.";
  else if (content.length > POST_CONTENT_MAX_LENGTH) {
    errors.content = `내용은 ${POST_CONTENT_MAX_LENGTH}자 이하로 입력해 주세요.`;
  }
  return errors;
}
