import type { Metadata } from "next";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { CompareTable } from "@/components/site/compare-table";
import { TraySync } from "@/components/site/compare-tray";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { CompareResult } from "@/lib/compare-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Compare products",
  description: "Side-by-side ratings, reliability, reported problems and specs.",
};

function Prompt({ message }: { message: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <GitCompareArrows className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">Compare products</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-6">
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string }>;
}) {
  const { slugs } = await searchParams;
  const list = [
    ...new Set(
      (slugs ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ].slice(0, 4);

  if (list.length < 2) {
    return (
      <Prompt message="Add at least two products from any product page or list, then compare them here." />
    );
  }

  const result = await apiGet<CompareResult>(
    `/api/v1/compare?slugs=${encodeURIComponent(list.join(","))}`,
  );

  if (result.products.length < 2) {
    return <Prompt message="We couldn't find enough of those products to compare." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TraySync items={result.products.map((p) => ({ slug: p.slug, name: p.name }))} />
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Compare
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {result.products.length} products, side by side
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Best value in each row is highlighted.
        </p>
      </header>

      <CompareTable products={result.products} />
    </div>
  );
}
