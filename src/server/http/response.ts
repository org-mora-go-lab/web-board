import type { NextRequest } from "next/server";

import { HttpError } from "./http-error";

export function errorResponse(error: HttpError) {
  return Response.json(
    { error: { code: error.code, message: error.message, ...(error.fields && { fields: error.fields }) } },
    { status: error.status },
  );
}

// Wraps a route handler so thrown `HttpError`s become `{ error: { code, message } }` JSON responses.
export function handle<Context>(handler: (request: NextRequest, context: Context) => Promise<Response>) {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof HttpError) return errorResponse(error);
      console.error(error);
      return errorResponse(new HttpError(500, "INTERNAL_ERROR", "서버 오류가 발생했습니다."));
    }
  };
}

// Requiring a JSON content type keeps cross-site `text/plain` form posts from being parsed as JSON.
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      const body = await request.json();
      if (body && typeof body === "object" && !Array.isArray(body)) return body;
    } catch {
      // Fall through to the shared error below.
    }
  }
  throw new HttpError(400, "INVALID_JSON", "요청 본문이 올바른 JSON 객체가 아닙니다.");
}

export const readString = (value: unknown) => (typeof value === "string" ? value : "");
