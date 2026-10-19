"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useId, useRef } from "react";

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Modal confirmation with Cancel focused first; Escape and backdrop clicks cancel.
export function ConfirmPopup({
  title,
  message,
  confirmLabel = "삭제",
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    cancelButtonRef.current?.focus();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-popup"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="confirm-popup-content">
        <div className="confirm-popup-title">
          <AlertTriangle size={18} aria-hidden="true" />
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <p id={`${id}-message`}>{message}</p>
        <div className="confirm-popup-actions">
          <button
            ref={cancelButtonRef}
            className="button"
            type="button"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="button is-danger"
            type="button"
            disabled={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
