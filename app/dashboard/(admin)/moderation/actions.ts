"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

export async function resolveReport(
  id: string,
  resolution: "dismiss" | "remove_content" | "keep_content",
): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiSend(`/api/v1/admin/reports/${id}`, "PATCH", { resolution });
    revalidatePath("/dashboard/moderation");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not resolve the report.",
    };
  }
}
