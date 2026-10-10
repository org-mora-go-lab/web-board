import type { ReactNode } from "react";

type Props = {
  message: string;
  tone?: "info" | "error";
  action?: ReactNode;
};

// Centered placeholder for loading, empty, not-found and error states.
export function StatusMessage({ message, tone = "info", action }: Props) {
  return (
    <div className={`status-message is-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <p>{message}</p>
      {action}
    </div>
  );
}
