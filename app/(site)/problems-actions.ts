"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";
import { activeContentLang } from "@/lib/content-lang";
import type { ProblemDetail } from "@/lib/problem-types";

type SolNumbers = {
  ok: boolean;
  error?: string;
  worked?: number;
  didnt?: number;
  helpful?: number;
  confirmed?: "worked" | "didnt" | "none";
  voted?: boolean;
};

function pick(detail: ProblemDetail, solutionId: string): SolNumbers {
  const s = detail.solutions.find((x) => x.id === solutionId);
  return {
    ok: true,
    worked: s?.workedCount,
    didnt: s?.didntWorkCount,
    helpful: s?.helpfulCount,
    confirmed: s?.viewerConfirmed,
    voted: s?.viewerHasVoted,
  };
}
function err(e: unknown): SolNumbers {
  return { ok: false, error: e instanceof ApiError ? e.message : "Something went wrong." };
}

export async function addSolution(
  problemId: string,
  slug: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to add a solution." };
  if (body.trim().length < 10) return { ok: false, error: "Add a bit more detail." };
  try {
    await apiSend(`/api/v1/problems/${problemId}/solutions`, "POST", {
      body: body.trim(),
      contentLang: await activeContentLang(),
    });
    revalidatePath(`/problems/${slug}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not add your solution." };
  }
}

export async function setConfirmation(
  solutionId: string,
  next: "worked" | "didnt" | "none",
): Promise<SolNumbers> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to confirm." };
  try {
    const detail = await apiSend<ProblemDetail>(
      `/api/v1/solutions/${solutionId}/confirm`,
      next === "none" ? "DELETE" : "POST",
      next === "none" ? undefined : { worked: next === "worked" },
    );
    return pick(detail, solutionId);
  } catch (e) {
    return err(e);
  }
}

export async function voteSolution(
  solutionId: string,
  currentlyVoted: boolean,
): Promise<SolNumbers> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in to vote." };
  try {
    const detail = await apiSend<ProblemDetail>(
      `/api/v1/solutions/${solutionId}/vote`,
      currentlyVoted ? "DELETE" : "POST",
    );
    return pick(detail, solutionId);
  } catch (e) {
    return err(e);
  }
}

export async function deleteSolution(
  solutionId: string,
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in first." };
  try {
    await apiSend(`/api/v1/solutions/${solutionId}`, "DELETE");
    revalidatePath(`/problems/${slug}`);
    revalidatePath("/dashboard/solutions");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? e.message : "Could not delete." };
  }
}
