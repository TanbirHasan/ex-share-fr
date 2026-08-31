"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/backend";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadReviewPhoto(
  reviewId: string,
  fd: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in." };

  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Pick an image." };
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "JPG, PNG, WebP or GIF only." };
  if (file.size > MAX_BYTES) return { ok: false, error: "That image is over 6 MB." };

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const res = await apiFetch(`/api/v1/reviews/${reviewId}/images/upload`, {
      method: "POST",
      body: buf,
      headers: { "content-type": file.type },
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
      return { ok: false, error: j.error?.message ?? "Upload failed." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Upload failed." };
  }
}

export async function deleteReviewPhoto(
  reviewId: string,
  imageId: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in." };
  try {
    const res = await apiFetch(`/api/v1/reviews/${reviewId}/images/${imageId}`, {
      method: "DELETE",
    });
    return res.ok ? { ok: true } : { ok: false, error: "Could not remove." };
  } catch {
    return { ok: false, error: "Could not remove." };
  }
}
