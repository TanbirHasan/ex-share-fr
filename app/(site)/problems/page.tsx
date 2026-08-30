import type { Metadata } from "next";
import Link from "next/link";
import { Search, TriangleAlert } from "lucide-react";
import { ProblemCard } from "@/components/site/problem-card";
import { Pager } from "@/components/site/pager";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet } from "@/lib/api";
import type { Paginated } from "@/lib/catalog-types";
import { PROBLEM_CATEGORIES, type ProblemListItem } from "@/lib/problem-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Problems",
  description:
    "Faults owners have actually hit — and the fixes that worked — for everyday electronics in Bangladesh.",
};

const LIMIT = 15;

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "";
  const sort = sp.sort ?? "reported";
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const qs = new URLSearchParams({
    limit: String(LIMIT),
    offset: String((page - 1) * LIMIT),
    sort,
  });
  if (q) qs.set("q", q);
  if (category) qs.set("category", category);

  const list = await apiGet<Paginated<ProblemListItem>>(`/api/v1/problems?${qs.toString()}`);
  const totalPages = Math.max(1, Math.ceil(list.total / LIMIT));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Problems
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Problems owners have reported
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{list.total} reported</p>
      </header>

      <form className="mb-6 flex flex-wrap gap-2" action="/problems">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search problems…" className="pl-9" />
        </div>
        <Select name="category" defaultValue={category || undefined}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            {PROBLEM_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="sort" defaultValue={sort}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reported">Most reported</SelectItem>
            <SelectItem value="recent">Newest</SelectItem>
          </SelectContent>
        </Select>
      </form>

      {list.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-14 text-center">
          <TriangleAlert className="size-7 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {q ? `Nothing matches “${q}”.` : "No problems reported yet."}
          </p>
          <Link href="/products" className="mt-2 text-sm text-primary hover:underline">
            Browse products to report one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.data.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Pager
          basePath="/problems"
          page={page}
          totalPages={totalPages}
          params={{ q, category, sort: sort === "reported" ? "" : sort }}
        />
      </div>
    </div>
  );
}
