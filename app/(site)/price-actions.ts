"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function setPriceAlert(
  productId: string,
  slug: string,
  targetPrice: number,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to set an alert." };
  if (!Number.isFinite(targetPrice) || targetPrice < 1) {
    return { ok: false, error: "Enter a valid price." };
  }
  try {
    await apiSend(`/api/v1/products/${productId}/price-alert`, "PATCH", {
      targetPrice: Math.round(targetPrice),
    });
    revalidatePath(`/products/${slug}`);
    revalidatePath("/dashboard/following");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not save." };
  }
}

export async function clearPriceAlert(
  productId: string,
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in first." };
  try {
    await apiSend(`/api/v1/products/${productId}/price-alert`, "DELETE");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/dashboard/following");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not remove." };
  }
}

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
