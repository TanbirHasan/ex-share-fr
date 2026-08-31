"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function reportPrice(
  productId: string,
  slug: string,
  input: { price: number; storeName?: string; note?: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to report a price." };
  if (!Number.isFinite(input.price) || input.price < 1) {
    return { ok: false, error: "Enter a valid price." };
  }

  try {
    await apiSend(`/api/v1/products/${productId}/prices`, "POST", {
      price: Math.round(input.price),
      storeName: input.storeName?.trim() || undefined,
      note: input.note?.trim() || undefined,
    });
    revalidatePath(`/products/${slug}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not save." };
  }
}
