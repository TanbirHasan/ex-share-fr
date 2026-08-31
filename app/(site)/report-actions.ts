"use server";

import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function submitReport(
  targetType: "review" | "problem" | "solution",
  targetId: string,
  reason: string,
  detail?: string,
): Promise<{ ok: boolean; already?: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to report content." };

  try {
    const r = await apiSend<{ ok: boolean; alreadyReported: boolean }>(
      "/api/v1/reports",
      "POST",
      { targetType, targetId, reason, detail: detail?.trim() || undefined },
    );
    return { ok: true, already: r.alreadyReported };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not send the report.",
    };
  }
}
