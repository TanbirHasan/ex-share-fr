"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/backend";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadProductImage(
  productId: string,
  fd: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Pick an image file." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: "Use a JPG, PNG, WebP or GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "That image is over 6 MB." };
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const res = await apiFetch(`/api/v1/products/${productId}/images/upload`, {
      method: "POST",
      body: buf,
      headers: { "content-type": file.type },
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      return { ok: false, error: j.error?.message ?? "Upload failed." };
    }
    revalidatePath(`/dashboard/catalog/${productId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Upload failed." };
  }
}
