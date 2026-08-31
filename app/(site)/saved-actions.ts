"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function toggleSave(
  productId: string,
  currentlySaved: boolean,
): Promise<{ ok: boolean; saved?: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to save products." };

  try {
    const r = await apiSend<{ saved: boolean }>(
      `/api/v1/products/${productId}/save`,
      currentlySaved ? "DELETE" : "POST",
    );
    revalidatePath("/dashboard/saved");
    return { ok: true, saved: r.saved };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not update saved products.",
    };
  }
}
