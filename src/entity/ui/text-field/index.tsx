"use client";

import { useId } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "password";
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
};

// Labelled input/textarea with an inline error message and an optional character counter.
export function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
  maxLength,
  placeholder,
  autoComplete,
}: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const inputProps = {
    id,
    value,
    maxLength,
    placeholder,
    autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div className={`text-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          {...inputProps}
          rows={14}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...inputProps}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {(error || maxLength) && (
        <div className="text-field-footer">
          {error && (
            <p className="text-field-error" id={errorId}>
              {error}
            </p>
          )}
          {maxLength && (
            <span className="text-field-count">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
