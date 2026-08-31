"use server";

import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export type RequestFormState = { ok: boolean; error?: string; duplicate?: boolean };

export async function submitProductRequest(
  _prev: RequestFormState,
  fd: FormData,
): Promise<RequestFormState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in first." };

  const rawText = String(fd.get("rawText") ?? "").trim();
  const rawCategory = String(fd.get("categoryGuess") ?? "").trim();
  const categoryGuess = rawCategory && rawCategory !== "__none__" ? rawCategory : "";

  if (rawText.length < 3) {
    return { ok: false, error: "Tell us which product you're looking for." };
  }

  try {
    const res = await apiSend<{ ok: boolean; duplicate: boolean }>(
      "/api/v1/product-requests",
      "POST",
      { rawText, categoryGuess: categoryGuess || undefined },
    );
    return { ok: true, duplicate: res.duplicate };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not send your request.",
    };
  }
}
