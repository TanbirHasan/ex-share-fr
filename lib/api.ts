import "server-only";
import { apiFetch } from "@/lib/backend";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = (json?.error ?? {}) as { code?: string; message?: string };
    throw new ApiError(
      res.status,
      err.code ?? "ERROR",
      err.message ?? `Request failed (${res.status})`,
    );
  }
  return json as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return parse<T>(await apiFetch(path));
}

export async function apiSend<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  return parse<T>(
    await apiFetch(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
}
