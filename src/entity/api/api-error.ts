export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

export const toApiError = (error: unknown) =>
  error instanceof ApiError
    ? error
    : new ApiError(0, "NETWORK_ERROR", "서버에 연결할 수 없습니다.");
