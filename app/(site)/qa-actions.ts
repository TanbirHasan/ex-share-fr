"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

type Res = { ok: boolean; error?: string };

async function requireUser(): Promise<Res | null> {
  const session = await auth();
  return session?.user ? null : { ok: false, error: "Sign in first." };
}
function fail(e: unknown): Res {
  return { ok: false, error: e instanceof ApiError ? e.message : "Something went wrong." };
}

export async function askQuestion(
  productId: string,
  slug: string,
  body: string,
): Promise<Res> {
  const g = await requireUser();
  if (g) return g;
  if (body.trim().length < 5) return { ok: false, error: "Ask a fuller question." };
  try {
    await apiSend(`/api/v1/products/${productId}/questions`, "POST", { body: body.trim() });
    revalidatePath(`/products/${slug}`);
    revalidatePath("/dashboard/questions");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function postAnswer(
  questionId: string,
  slug: string,
  body: string,
): Promise<Res> {
  const g = await requireUser();
  if (g) return g;
  if (body.trim().length < 5) return { ok: false, error: "Add a bit more detail." };
  try {
    await apiSend(`/api/v1/questions/${questionId}/answers`, "POST", { body: body.trim() });
    revalidatePath(`/products/${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function acceptAnswer(
  questionId: string,
  slug: string,
  answerId: string | null,
): Promise<Res> {
  const g = await requireUser();
  if (g) return g;
  try {
    await apiSend(`/api/v1/questions/${questionId}/accept`, "POST", { answerId });
    revalidatePath(`/products/${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteQuestion(id: string, slug: string): Promise<Res> {
  const g = await requireUser();
  if (g) return g;
  try {
    await apiSend(`/api/v1/questions/${id}`, "DELETE");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/dashboard/questions");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteAnswer(id: string, slug: string): Promise<Res> {
  const g = await requireUser();
  if (g) return g;
  try {
    await apiSend(`/api/v1/answers/${id}`, "DELETE");
    revalidatePath(`/products/${slug}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
