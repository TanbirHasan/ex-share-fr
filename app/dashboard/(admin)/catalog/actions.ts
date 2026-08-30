"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";
import type { Product } from "@/lib/catalog-types";

export type ProductFormState = { ok: boolean; error?: string; id?: string };

const LIST = "/dashboard/catalog";

function str(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}
function opt(fd: FormData, k: string) {
  const v = str(fd, k);
  return v === "" ? undefined : v;
}
function num(fd: FormData, k: string) {
  const v = str(fd, k);
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : undefined;
}
function parseSpec(raw: FormDataEntryValue | null): Record<string, unknown> {
  try {
    const v = JSON.parse(String(raw ?? "{}"));
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}
function fail(e: unknown): ProductFormState {
  return { ok: false, error: e instanceof ApiError ? e.message : "Something went wrong." };
}

export async function saveProduct(
  _prev: ProductFormState,
  fd: FormData,
): Promise<ProductFormState> {
  const id = opt(fd, "id");
  const editing = Boolean(id);
  const blank = editing ? null : undefined; // update clears; create omits

  const body = {
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    categoryId: str(fd, "categoryId"),
    brandId: str(fd, "brandId"),
    status: str(fd, "status") || "active",
    modelNo: opt(fd, "modelNo") ?? blank,
    priceMin: num(fd, "priceMin") ?? blank,
    priceMax: num(fd, "priceMax") ?? blank,
    warrantyText: opt(fd, "warrantyText") ?? blank,
    spec: parseSpec(fd.get("spec")),
  };

  try {
    if (editing) {
      await apiSend(`/api/v1/products/${id}`, "PATCH", body);
      revalidatePath(`${LIST}/${id}`);
      revalidatePath(LIST);
      return { ok: true, id };
    }
    const created = await apiSend<Product>("/api/v1/products", "POST", body);
    revalidatePath(LIST);
    return { ok: true, id: created.id };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProduct(id: string): Promise<ProductFormState> {
  try {
    await apiSend(`/api/v1/products/${id}`, "DELETE");
    revalidatePath(LIST);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function addImage(productId: string, url: string): Promise<ProductFormState> {
  try {
    await apiSend(`/api/v1/products/${productId}/images`, "POST", { url });
    revalidatePath(`${LIST}/${productId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteImage(
  productId: string,
  imageId: string,
): Promise<ProductFormState> {
  try {
    await apiSend(`/api/v1/products/${productId}/images/${imageId}`, "DELETE");
    revalidatePath(`${LIST}/${productId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
