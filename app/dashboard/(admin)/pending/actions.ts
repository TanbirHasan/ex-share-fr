"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

export async function decidePending(
  type: "review" | "problem" | "solution" | "service",
  id: string,
  decision: "approve" | "reject",
): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiSend(`/api/v1/admin/pending/${type}/${id}`, "POST", { decision });
    revalidatePath("/dashboard/pending");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Failed." };
  }
}
