import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/backend";

export async function GET() {
  try {
    const res = await apiFetch("/api/v1/me/notifications/unread-count");
    if (!res.ok) return NextResponse.json({ count: 0 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
