import { ApiError } from "./api-error";

type ErrorBody = { error?: { code?: string; message?: string; fields?: Record<string, string> } };

// Calls the board JSON API and throws `ApiError` with the server's `{ error }` payload on failure.
export async function apiRequest<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const { error } = body as ErrorBody;
    throw new ApiError(
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? "요청을 처리하지 못했습니다.",
      error?.fields,
    );
  }
  return body as T;
}
