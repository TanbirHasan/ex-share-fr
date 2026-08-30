import "server-only";
import { SignJWT } from "jose";
import { auth } from "@/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

function sharedSecret(): Uint8Array {
  const s = process.env.AUTH_SHARED_SECRET;
  if (!s) throw new Error("AUTH_SHARED_SECRET is not set");
  return new TextEncoder().encode(s);
}

/**
 * Short-lived HS256 token the backend accepts, derived from the NextAuth session.
 * Signed with AUTH_SHARED_SECRET — identical to what @fastify/jwt verifies.
 */
export async function mintBackendToken(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return new SignJWT({ role: session.user.role ?? "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(sharedSecret());
}

/** fetch() against the backend API with the current user's bearer token attached. */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await mintBackendToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (token) headers.set("authorization", `Bearer ${token}`);
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
}
