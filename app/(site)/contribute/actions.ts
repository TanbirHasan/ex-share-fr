"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export type ReviewFormState = { ok: boolean; error?: string };

function str(fd: FormData, k: string) {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? undefined : v;
}
function int(fd: FormData, k: string) {
  const v = str(fd, k);
  if (v === undefined) return undefined;
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : undefined;
}
function jsonArr(fd: FormData, k: string): string[] {
  try {
    const v = JSON.parse(String(fd.get(k) ?? "[]"));
    return Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).slice(0, 8) : [];
  } catch {
    return [];
  }
}
function catRatings(fd: FormData): Record<string, number> {
  try {
    const v = JSON.parse(String(fd.get("categoryRatings") ?? "{}"));
    const out: Record<string, number> = {};
    for (const key of ["reliability", "performance", "value", "after_sales"]) {
      const n = v?.[key];
      if (typeof n === "number" && n >= 1 && n <= 5) out[key] = n;
    }
    return out;
  } catch {
    return {};
  }
}

export async function submitReview(
  _prev: ReviewFormState,
  fd: FormData,
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in to publish a review." };

  const productId = String(fd.get("productId") ?? "");
  const slug = String(fd.get("slug") ?? "");
  const reviewId = (fd.get("reviewId") as string) || null;

  const rating = int(fd, "rating");
  const ownershipDuration = str(fd, "ownershipDuration");
  const wouldBuyAgain = str(fd, "wouldBuyAgain");

  if (!rating || !ownershipDuration || !wouldBuyAgain) {
    return {
      ok: false,
      error: "Add an overall rating, how long you've owned it, and whether you'd buy again.",
    };
  }

  const body: Record<string, unknown> = {
    rating,
    ownershipDuration,
    wouldBuyAgain,
    categoryRatings: catRatings(fd),
    pros: jsonArr(fd, "pros"),
    cons: jsonArr(fd, "cons"),
    comment: reviewId ? (str(fd, "comment") ?? "") : str(fd, "comment"),
    purchasePrice: int(fd, "purchasePrice"),
    purchaseStore: reviewId ? (str(fd, "purchaseStore") ?? "") : str(fd, "purchaseStore"),
  };

  try {
    if (reviewId) {
      await apiSend(`/api/v1/reviews/${reviewId}`, "PATCH", body);
    } else {
      await apiSend(`/api/v1/products/${productId}/reviews`, "POST", body);
    }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not save your review.",
    };
  }

  revalidatePath(`/products/${slug}`);
  revalidatePath("/dashboard/reviews");
  return { ok: true };
}
