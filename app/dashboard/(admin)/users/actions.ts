"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

type Role = "user" | "trusted" | "moderator" | "admin";

export async function updateUser(
  id: string,
  patch: { role?: Role; suspended?: boolean },
): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiSend(`/api/v1/admin/users/${id}`, "PATCH", patch);
    revalidatePath("/dashboard/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Failed." };
  }
}
