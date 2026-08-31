"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export async function toggleFollow(
  targetType: "product" | "problem",
  targetId: string,
  currentlyFollowing: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to follow." };

  try {
    await apiSend("/api/v1/follows", currentlyFollowing ? "DELETE" : "POST", {
      targetType,
      targetId,
    });
    revalidatePath("/dashboard/following");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not update." };
  }
}
