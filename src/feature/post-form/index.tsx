"use client";

import { POST_CONTENT_MAX_LENGTH, POST_TITLE_MAX_LENGTH, type PostInput } from "@/src/entity/post";
import { TextField } from "@/src/entity/ui";

import { usePostForm } from "./hook";

type Props = {
  initialValue?: PostInput;
  submitLabel: string;
  onSubmit: (input: PostInput) => Promise<void>;
  onCancel: () => void;
};

const EMPTY_POST: PostInput = { title: "", content: "" };

export function PostForm({ initialValue = EMPTY_POST, submitLabel, onSubmit, onCancel }: Props) {
  const { title, setTitle, content, setContent, errors, pending, submit } = usePostForm(initialValue, onSubmit);

  return (
    <form className="post-form" onSubmit={submit} noValidate>
      <TextField
        label="제목"
        value={title}
        onChange={setTitle}
        error={errors.title}
        maxLength={POST_TITLE_MAX_LENGTH}
        placeholder="제목을 입력해 주세요"
      />
      <TextField
        label="내용"
        multiline
        value={content}
        onChange={setContent}
        error={errors.content}
        maxLength={POST_CONTENT_MAX_LENGTH}
        placeholder="내용을 입력해 주세요"
      />
      {errors.form && (
        <p className="post-form-error" role="alert">
          {errors.form}
        </p>
      )}
      <div className="post-form-actions">
        <button className="button" type="button" onClick={onCancel}>
          취소
        </button>
        <button className="button is-primary" type="submit" disabled={pending}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
