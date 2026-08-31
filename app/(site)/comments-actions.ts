"use server";

import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function postComment(
  targetType: "review" | "solution",
  targetId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to comment." };
  if (body.trim().length < 1) return { ok: false, error: "Write something first." };

  try {
    await apiSend("/api/v1/comments", "POST", {
      targetType,
      targetId,
      body: body.trim(),
    });
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not post your comment.",
    };
  }
}

export async function removeComment(id: string): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in first." };

  try {
    await apiSend(`/api/v1/comments/${id}`, "DELETE");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not delete the comment.",
    };
  }
}
