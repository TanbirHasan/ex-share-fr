import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
const EMPTY = { products: [], brands: [] };

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json(EMPTY);

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/search/suggest?q=${encodeURIComponent(q)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return NextResponse.json(EMPTY);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(EMPTY);
  }
}
