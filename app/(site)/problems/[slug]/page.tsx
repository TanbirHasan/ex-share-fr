import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronRight, LifeBuoy, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import { auth } from "@/auth";
import { ProblemReportButton } from "@/components/site/problem-report-button";
import { ReportButton } from "@/components/site/report-button";
import { SolutionCard } from "@/components/site/solution-card";
import { SolutionForm } from "@/components/site/solution-form";
import { TranslatableText } from "@/components/site/translatable-text";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api";
import { apiFetch } from "@/lib/backend";
import { formatDate } from "@/lib/format";
import { PROBLEM_STARTED, type ProblemDetail } from "@/lib/problem-types";

async function load(slug: string): Promise<ProblemDetail | null> {
  const res = await apiFetch(`/api/v1/problems/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, "ERROR", "Failed to load problem");
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await load(slug);
  if (!p) {
    const t = await getTranslations("problems");
    return { title: t("metaNotFound") };
  }
  return {
    title: `${p.title} — ${p.product.name}`,
    description: p.description.slice(0, 155),
  };
}

export const dynamic = "force-dynamic";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, tEnum, p] = await Promise.all([
    getTranslations("problems"),
    getTranslations("enums"),
    load(slug),
  ]);
  if (!p) notFound();

  const session = await auth();
  const signedIn = Boolean(session?.user);

  const maxWhen = Math.max(1, ...Object.values(p.whenStarted));
  const solved = p.solutions.filter((s) => s.workedCount > 0).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/problems" className="hover:text-foreground">
          {t("breadcrumb")}
        </Link>
        <ChevronRight className="size-3" />
        <Link href={`/products/${p.product.slug}`} className="hover:text-foreground">
          {p.product.name}
        </Link>
      </nav>

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="secondary">{tEnum(`problemCategory.${p.category}`)}</Badge>
        <span className="text-xs text-muted-foreground">
          {t("reportedOn", { date: formatDate(p.createdAt) })}
        </span>
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{p.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
          {t("ownersReported", { count: p.reportCount })}
        </span>
        <ProblemReportButton
          problemId={p.id}
          hasReported={p.viewerHasReported}
          signedIn={signedIn}
        />
        <ReportButton targetType="problem" targetId={p.id} />
      </div>

      <div className="mt-5">
        <TranslatableText
          text={p.description}
          targetType="problem"
          targetId={p.id}
          sourceLang={p.contentLang}
          className="text-sm whitespace-pre-line text-foreground/90"
        />
      </div>

      {/* Report aggregates */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.keys(p.whenStarted).length > 0 && (
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{t("whenStarted")}</p>
            <ul className="mt-2 space-y-1.5">
              {PROBLEM_STARTED.filter((b) => p.whenStarted[b.value]).map((b) => (
                <li key={b.value} className="flex items-center gap-2 text-xs">
                  <span className="w-28 shrink-0 text-muted-foreground">
                    {tEnum(`problemStarted.${b.value}`)}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(p.whenStarted[b.value]! / maxWhen) * 100}%` }}
                    />
                  </span>
                  <span className="w-5 text-right font-medium tabular-nums">
                    {p.whenStarted[b.value]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          {Object.keys(p.warrantyBreakdown).length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                {t("warrantyOutcome")}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(p.warrantyBreakdown).map(([k, n]) => (
                  <span
                    key={k}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                  >
                    {tEnum(`warrantyCovered.${k}`)} · {n}
                  </span>
                ))}
              </div>
            </div>
          )}
          {p.repairCost && (
            <div className="rounded-xl border bg-card p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Wrench className="size-3.5" />
                {t("repairCost", { count: p.repairCost.count })}
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {p.repairCost.min === p.repairCost.max
                  ? `৳${p.repairCost.min.toLocaleString()}`
                  : `৳${p.repairCost.min.toLocaleString()} – ৳${p.repairCost.max.toLocaleString()}`}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {t("median", { amount: p.repairCost.median.toLocaleString() })}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Solutions */}
      <div className="mt-10">
        <div className="mb-3 flex items-center gap-2">
          <LifeBuoy className="size-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            {t("solutionsHeading", { count: p.solutions.length })}
          </h2>
          {solved > 0 && (
            <span className="text-xs text-muted-foreground">
              {t("confirmedWorking", { count: solved })}
            </span>
          )}
        </div>

        {p.solutions.length > 0 ? (
          <div className="space-y-3">
            {p.solutions.map((s) => (
              <SolutionCard key={s.id} solution={s} slug={p.slug} signedIn={signedIn} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
            {t("noSolutionsYet")}
          </p>
        )}

        <div className="mt-4">
          <SolutionForm problemId={p.id} slug={p.slug} signedIn={signedIn} />
        </div>
      </div>
    </div>
  );
}
