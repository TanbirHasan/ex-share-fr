"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

export async function deleteMyReview(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiSend(`/api/v1/reviews/${id}`, "DELETE");
    revalidatePath("/dashboard/reviews");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not delete the review.",
    };
  }
}
