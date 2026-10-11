"use server";

import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";
import { activeContentLang } from "@/lib/content-lang";

export type RequestFormState = { ok: boolean; error?: string; duplicate?: boolean };

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

export async function submitProductRequest(
  _prev: RequestFormState,
  fd: FormData,
): Promise<RequestFormState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in first." };

  const rawText = String(fd.get("rawText") ?? "").trim();
  const rawCategory = String(fd.get("categoryGuess") ?? "").trim();
  const categoryGuess = rawCategory && rawCategory !== "__none__" ? rawCategory : "";

  if (rawText.length < 3) {
    return { ok: false, error: "Tell us which product you're looking for." };
  }

  const contentType = str(fd, "contentType");
  const contentLang = await activeContentLang();
  let content: { type: "review" | "problem" | "service"; payload: Record<string, unknown> } | undefined;

  if (contentType === "review") {
    const rating = int(fd, "rating");
    const ownershipDuration = str(fd, "ownershipDuration");
    const wouldBuyAgain = str(fd, "wouldBuyAgain");
    if (!rating || !ownershipDuration || !wouldBuyAgain) {
      return {
        ok: false,
        error: "For your review, add an overall rating, how long you've owned it, and whether you'd buy again.",
      };
    }
    content = {
      type: "review",
      payload: {
        rating,
        ownershipDuration,
        wouldBuyAgain,
        categoryRatings: catRatings(fd),
        pros: jsonArr(fd, "pros"),
        cons: jsonArr(fd, "cons"),
        comment: str(fd, "comment"),
        purchasePrice: int(fd, "purchasePrice"),
        purchaseStore: str(fd, "purchaseStore"),
        contentLang,
      },
    };
  } else if (contentType === "problem") {
    const category = str(fd, "category");
    const title = str(fd, "title");
    const description = str(fd, "description");
    if (!category || !title || !description) {
      return { ok: false, error: "For your problem report, pick a category and add a title and description." };
    }
    if (title.length < 6) return { ok: false, error: "Give the problem a clearer title." };
    if (description.length < 10) return { ok: false, error: "Add a bit more detail to the problem description." };
    content = {
      type: "problem",
      payload: {
        category,
        title,
        description,
        contentLang,
        report: {
          whenStarted: str(fd, "whenStarted"),
          warrantyCovered: str(fd, "warrantyCovered"),
          repairCost: int(fd, "repairCost"),
          note: str(fd, "note"),
        },
      },
    };
  } else if (contentType === "service") {
    const rating = int(fd, "rating");
    const responseTime = str(fd, "responseTime");
    const channel = str(fd, "channel");
    const repairOutcome = str(fd, "repairOutcome");
    const warranty = str(fd, "warranty");
    if (!rating || !responseTime || !channel || !repairOutcome || !warranty) {
      return {
        ok: false,
        error: "For your service experience, fill in the rating, response time, contact channel, outcome and warranty.",
      };
    }
    content = {
      type: "service",
      payload: {
        rating,
        responseTime,
        channel,
        repairOutcome,
        warranty,
        technicianRating: int(fd, "technicianRating"),
        issue: str(fd, "issue"),
        cost: int(fd, "cost"),
        durationDays: int(fd, "durationDays"),
        comment: str(fd, "comment"),
        contentLang,
      },
    };
  }

  try {
    const res = await apiSend<{ ok: boolean; duplicate: boolean }>(
      "/api/v1/product-requests",
      "POST",
      { rawText, categoryGuess: categoryGuess || undefined, content },
    );
    return { ok: true, duplicate: res.duplicate };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not send your request.",
    };
  }
}
