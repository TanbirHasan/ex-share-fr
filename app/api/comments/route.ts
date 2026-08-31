import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/backend";

const EMPTY = { data: [], total: 0, limit: 50, offset: 0 };

export async function GET(req: Request) {
  const u = new URL(req.url);
  const targetType = u.searchParams.get("targetType") ?? "";
  const targetId = u.searchParams.get("targetId") ?? "";

  if (!["review", "solution"].includes(targetType) || !targetId) {
    return NextResponse.json(EMPTY);
  }

  try {
    const res = await apiFetch(
      `/api/v1/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}&limit=50`,
    );
    if (!res.ok) return NextResponse.json(EMPTY);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(EMPTY);
  }
}
