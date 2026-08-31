"use server";

import { ApiError, apiSend } from "@/lib/api";

export async function mergeProblems(
  sourceId: string,
  targetId: string,
): Promise<{ ok: boolean; targetSlug?: string; error?: string }> {
  try {
    const res = await apiSend<{ ok: boolean; targetSlug: string }>(
      "/api/v1/admin/problems/merge",
      "POST",
      { sourceId, targetId },
    );
    return { ok: true, targetSlug: res.targetSlug };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Merge failed." };
  }
}
