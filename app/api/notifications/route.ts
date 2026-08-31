import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/backend";

export async function GET(req: Request) {
  const limit = new URL(req.url).searchParams.get("limit") ?? "15";
  try {
    const res = await apiFetch(`/api/v1/me/notifications?limit=${encodeURIComponent(limit)}`);
    if (!res.ok) return NextResponse.json({ data: [], unreadCount: 0, total: 0 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ data: [], unreadCount: 0, total: 0 });
  }
}

export async function POST(req: Request) {
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body = mark all */
  }
  try {
    const res = await apiFetch("/api/v1/me/notifications/read", {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    });
    return NextResponse.json(res.ok ? { ok: true } : { ok: false }, {
      status: res.ok ? 200 : 502,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
