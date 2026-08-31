import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiGet } from "@/lib/api";

type BackendItem = {
  id: string;
  slug: string;
  title: string;
  product: { name: string };
};

/** Admin-only typeahead over problems, for the merge tool. */
export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ data: [] }, { status: 403 });
  }

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ data: [] });

  try {
    const res = await apiGet<{ data: BackendItem[] }>(
      `/api/v1/problems?q=${encodeURIComponent(q)}&limit=8`,
    );
    return NextResponse.json({
      data: res.data.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        product: p.product.name,
      })),
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
