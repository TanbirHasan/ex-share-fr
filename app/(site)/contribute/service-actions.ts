"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ApiError, apiSend } from "@/lib/api";

export type ServiceFormState = { ok: boolean; error?: string };

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

export async function submitServiceExperience(
  _prev: ServiceFormState,
  fd: FormData,
): Promise<ServiceFormState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Please sign in first." };

  const productId = String(fd.get("productId") ?? "");
  const slug = String(fd.get("slug") ?? "");
  const serviceId = (fd.get("serviceId") as string) || null;

  const rating = int(fd, "rating");
  const responseTime = str(fd, "responseTime");
  const channel = str(fd, "channel");
  const repairOutcome = str(fd, "repairOutcome");
  const warranty = str(fd, "warranty");

  if (!rating || !responseTime || !channel || !repairOutcome || !warranty) {
    return {
      ok: false,
      error: "Fill in the rating, response time, contact channel, outcome and warranty.",
    };
  }

  const body: Record<string, unknown> = {
    rating,
    responseTime,
    channel,
    repairOutcome,
    warranty,
    technicianRating: int(fd, "technicianRating"),
    issue: serviceId ? (str(fd, "issue") ?? "") : str(fd, "issue"),
    cost: int(fd, "cost"),
    durationDays: int(fd, "durationDays"),
    comment: serviceId ? (str(fd, "comment") ?? "") : str(fd, "comment"),
  };

  try {
    if (serviceId) {
      await apiSend(`/api/v1/service/${serviceId}`, "PATCH", body);
    } else {
      await apiSend(`/api/v1/products/${productId}/service`, "POST", body);
    }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof ApiError ? e.message : "Could not save your service experience.",
    };
  }

  revalidatePath(`/products/${slug}`);
  revalidatePath("/dashboard/service");
  return { ok: true };
}
