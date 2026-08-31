import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, Sparkles } from "lucide-react";

/** Compact "new here?" primer shown at the top of the contribute flows. */
export async function ContributeIntro() {
  const t = await getTranslations("contribute.intro");
  const points = ["good", "moderated", "reputation"] as const;

  return (
    <div className="rounded-xl border bg-muted/40 p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="size-4 text-primary" />
        {t("title")}
      </p>
      <ul className="mt-2 space-y-1.5">
        {points.map((k) => (
          <li key={k} className="flex gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/70" />
            <span>{t(k)}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/how-it-works"
        className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
      >
        {t("more")}
      </Link>
    </div>
  );
}
