"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiSend } from "@/lib/api";

export type FormState = { ok: boolean; error?: string };

const PATH = "/dashboard/taxonomy";

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}
function opt(fd: FormData, key: string) {
  const v = str(fd, key);
  return v === "" ? undefined : v;
}
function fail(e: unknown): FormState {
  return { ok: false, error: e instanceof ApiError ? e.message : "Something went wrong." };
}
function ok(): FormState {
  revalidatePath(PATH);
  return { ok: true };
}

export async function saveCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = opt(fd, "id");
  const body = {
    slug: str(fd, "slug"),
    nameEn: str(fd, "nameEn"),
    nameBn: str(fd, "nameBn"),
    icon: opt(fd, "icon"),
  };
  try {
    if (id) await apiSend(`/api/v1/categories/${id}`, "PATCH", body);
    else await apiSend("/api/v1/categories", "POST", body);
    return ok();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string): Promise<FormState> {
  try {
    await apiSend(`/api/v1/categories/${id}`, "DELETE");
    return ok();
  } catch (e) {
    return fail(e);
  }
}

export async function saveBrand(_prev: FormState, fd: FormData): Promise<FormState> {
  const id = opt(fd, "id");
  const body = {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    logoUrl: opt(fd, "logoUrl"),
    aboutEn: opt(fd, "aboutEn"),
    aboutBn: opt(fd, "aboutBn"),
  };
  try {
    if (id) await apiSend(`/api/v1/brands/${id}`, "PATCH", body);
    else await apiSend("/api/v1/brands", "POST", body);
    return ok();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteBrand(id: string): Promise<FormState> {
  try {
    await apiSend(`/api/v1/brands/${id}`, "DELETE");
    return ok();
  } catch (e) {
    return fail(e);
  }
}
