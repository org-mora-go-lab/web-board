"use client";

import { type FormEvent, useState } from "react";

import { toApiError } from "@/src/entity/api";
import { type PostInput, validatePostInput } from "@/src/entity/post";

type Errors = Partial<Record<keyof PostInput | "form", string>>;

export function usePostForm(
  initialValue: PostInput,
  onSubmit: (input: PostInput) => Promise<void>,
) {
  const [title, setTitle] = useState(initialValue.title);
  const [content, setContent] = useState(initialValue.content);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const input = { title: title.trim(), content };
    const nextErrors = validatePostInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      // On success the caller navigates away, so `pending` intentionally stays true.
      await onSubmit(input);
    } catch (caught) {
      const error = toApiError(caught);
      setErrors(
        Object.keys(error.fields).length > 0
          ? error.fields
          : { form: error.message },
      );
      setPending(false);
    }
  };

  return { title, setTitle, content, setContent, errors, pending, submit };
}
