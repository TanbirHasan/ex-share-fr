"use server";

import { ApiError, apiSend } from "@/lib/api";

type TranslateTarget = "review" | "problem" | "solution";

export async function translateContent(
  targetType: TranslateTarget,
  targetId: string,
  targetLang: "bn" | "en",
): Promise<{ ok: boolean; text?: string; error?: string }> {
  try {
    const res = await apiSend<{ text: string }>("/api/v1/translate", "POST", {
      targetType,
      targetId,
      targetLang,
    });
    return { ok: true, text: res.text };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not translate this right now.",
    };
  }
}
