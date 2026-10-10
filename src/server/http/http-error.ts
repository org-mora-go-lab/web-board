export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "POST_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INVALID_JSON"
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "INTERNAL_ERROR";

export type FieldErrors = Record<string, string>;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly fields?: FieldErrors,
  ) {
    super(message);
  }
}

export const unauthorized = () => new HttpError(401, "UNAUTHORIZED", "로그인이 필요합니다.");
export const forbidden = (message = "권한이 없습니다.") => new HttpError(403, "FORBIDDEN", message);
export const validationError = (fields: FieldErrors) =>
  new HttpError(400, "VALIDATION_ERROR", Object.values(fields)[0], fields);
