"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";
import { activeContentLang } from "@/lib/content-lang";
import type { ProblemDetail } from "@/lib/problem-types";

export type ProblemFormState = { ok: boolean; error?: string; slug?: string; pending?: boolean };

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
function fail(e: unknown): ProblemFormState {
  return { ok: false, error: e instanceof ApiError ? e.message : "Something went wrong." };
}

export async function submitProblem(
  _prev: ProblemFormState,
  fd: FormData,
): Promise<ProblemFormState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in first." };

  const productId = String(fd.get("productId") ?? "");
  const category = str(fd, "category");
  const title = str(fd, "title");
  const description = str(fd, "description");

  if (!category || !title || !description) {
    return { ok: false, error: "Pick a category and add a title and description." };
  }
  if (title.length < 6) return { ok: false, error: "Give the problem a clearer title." };
  if (description.length < 10) return { ok: false, error: "Add a bit more detail to the description." };

  const report = {
    whenStarted: str(fd, "whenStarted"),
    warrantyCovered: str(fd, "warrantyCovered"),
    repairCost: int(fd, "repairCost"),
    note: str(fd, "note"),
  };

  try {
    const problem = await apiSend<ProblemDetail>(
      `/api/v1/products/${productId}/problems`,
      "POST",
      { category, title, description, report, contentLang: await activeContentLang() },
    );
    revalidatePath("/problems");
    revalidatePath("/dashboard/problems");
    return { ok: true, slug: problem.slug, pending: problem.status === "pending" };
  } catch (e) {
    return fail(e);
  }
}

export async function addProblemReport(
  problemId: string,
  input: { whenStarted?: string; warrantyCovered?: string; repairCost?: number; note?: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to report this." };
  try {
    await apiSend(`/api/v1/problems/${problemId}/reports`, "POST", input);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not save your report." };
  }
}
