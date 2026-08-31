import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ClipboardCheck,
  MessagesSquare,
  PenLine,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("howItWorks");
  return { title: t("metaTitle"), description: t("intro") };
}

const steps = [
  { icon: Search, key: "search" },
  { icon: MessagesSquare, key: "read" },
  { icon: PenLine, key: "contribute" },
  { icon: TrendingUp, key: "build" },
] as const;

const trust = [
  { icon: ClipboardCheck, key: "moderation" },
  { icon: ShieldCheck, key: "reputation" },
] as const;

export default async function HowItWorksPage() {
  const t = await getTranslations("howItWorks");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs font-medium tracking-wide text-primary uppercase">{t("eyebrow")}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>

      <ol className="mt-10 space-y-4">
        {steps.map(({ icon: Icon, key }, i) => (
          <li key={key} className="flex gap-4 rounded-xl border bg-card p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">
                <span className="text-muted-foreground">{i + 1}.</span> {t(`steps.${key}Title`)}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`steps.${key}Body`)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">{t("trustTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("trustIntro")}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {trust.map(({ icon: Icon, key }) => (
          <div key={key} className="rounded-xl border bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold">{t(`trust.${key}Title`)}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(`trust.${key}Body`)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/products">
            {t("ctaBrowse")} <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contribute">{t("ctaContribute")}</Link>
        </Button>
      </div>
    </div>
  );
}
