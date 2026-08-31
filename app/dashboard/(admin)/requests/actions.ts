"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

export async function resolveRequest(
  id: string,
  status: "added" | "rejected",
): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiSend(`/api/v1/admin/product-requests/${id}`, "PATCH", { status });
    revalidatePath("/dashboard/requests");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Failed." };
  }
}
