import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/backend";

export async function GET() {
  try {
    const res = await apiFetch("/api/v1/me/following-ids");
    if (!res.ok) return NextResponse.json({ products: [], problems: [] });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ products: [], problems: [] });
  }
}
