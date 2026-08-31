import type { Metadata } from "next";
import Link from "next/link";
import { Check, ImageOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet } from "@/lib/api";
import type { Category } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/format";
import {
  PRIORITIES,
  priorityLabel,
  type Recommendation,
  type RecommendResult,
} from "@/lib/recommend-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Help me choose",
  description: "Answer three questions and get product picks scored from real owner experiences.",
};

export default async function HelpMeChoosePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; budgetMax?: string; priority?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const budgetMax = sp.budgetMax ?? "";
  const priority = sp.priority ?? "balanced";

  const categories = await apiGet<Category[]>("/api/v1/categories").catch(() => [] as Category[]);

  let rec: Recommendation | null = null;
  if (category) {
    const qs = new URLSearchParams({ category, priority });
    if (budgetMax) qs.set("budgetMax", budgetMax);
    rec = await apiGet<Recommendation>(`/api/v1/recommend?${qs.toString()}`).catch(() => null);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary uppercase">
          <Sparkles className="size-3.5" />
          Help me choose
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Let the community narrow it down
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a category, set a budget, and tell us what matters. We rank the options
          using owner ratings, reported problems and after-sales experiences.
        </p>
      </header>

      <form
        method="get"
        action="/help-me-choose"
        className="mt-6 rounded-xl border bg-card p-5"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={category || undefined}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budgetMax">Max budget (৳)</Label>
            <Input
              id="budgetMax"
              name="budgetMax"
              type="number"
              min={0}
              defaultValue={budgetMax}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="priority">What matters most?</Label>
            <Select name="priority" defaultValue={priority}>
              <SelectTrigger id="priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="mt-4">
          Show picks
        </Button>
      </form>

      {!category && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Pick a category above to get started.
        </p>
      )}

      {category && rec && (
        <div className="mt-8">
          {rec.category == null ? (
            <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
              We don&apos;t have that category.
            </p>
          ) : rec.results.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
              Nothing in {rec.category.nameEn}
              {rec.budgetMax ? ` under ৳${rec.budgetMax.toLocaleString()}` : ""} yet.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Top picks for <span className="font-medium text-foreground">{rec.category.nameEn}</span>
                {rec.budgetMax ? ` under ৳${rec.budgetMax.toLocaleString()}` : ""}, optimised for{" "}
                <span className="font-medium text-foreground">
                  {priorityLabel(rec.priority).toLowerCase()}
                </span>
                .
              </p>
              <div className="mt-4 space-y-3">
                {rec.results.map((r, i) => (
                  <ResultCard key={r.product.id} rank={i + 1} result={r} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({ rank, result }: { rank: number; result: RecommendResult }) {
  const p = result.product;
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {rank}
      </div>
      <Link
        href={`/products/${p.slug}`}
        className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted"
      >
        {p.primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="size-5 text-muted-foreground" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{p.brand.name}</p>
        <Link href={`/products/${p.slug}`} className="font-medium hover:text-primary">
          {p.name}
        </Link>
        <p className="text-sm font-semibold tabular-nums">
          {formatPrice(p.priceMin, p.priceMax)}
        </p>
        <ul className="mt-2 space-y-0.5">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex gap-1.5 text-xs text-muted-foreground">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-lg font-semibold tabular-nums">{result.score}</div>
        <div className="text-[10px] tracking-wide text-muted-foreground uppercase">match</div>
      </div>
    </div>
  );
}
