import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GitCompareArrows } from "lucide-react";
import { CompareTable } from "@/components/site/compare-table";
import { TraySync } from "@/components/site/compare-tray";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { CompareResult } from "@/lib/compare-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("compare");
  return {
    title: t("metaTitle"),
    description: "Side-by-side ratings, reliability, reported problems and specs.",
  };
}

async function Prompt({ message }: { message: string }) {
  const [t, tCommon] = await Promise.all([
    getTranslations("compare"),
    getTranslations("common"),
  ]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <GitCompareArrows className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-6">
        <Link href="/products">{tCommon("browseProducts")}</Link>
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

  const t = await getTranslations("compare");

  if (list.length < 2) {
    return <Prompt message={t("addTwo")} />;
  }

  const result = await apiGet<CompareResult>(
    `/api/v1/compare?slugs=${encodeURIComponent(list.join(","))}`,
  );

  if (result.products.length < 2) {
    return <Prompt message={t("notEnough")} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <TraySync items={result.products.map((p) => ({ slug: p.slug, name: p.name }))} />
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("sideBySide", { count: result.products.length })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("bestValueHighlighted")}</p>
      </header>

      <CompareTable products={result.products} />
    </div>
  );
}
