import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, MessageSquareText, ShieldCheck, TriangleAlert } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const highlightIcons = [MessageSquareText, TriangleAlert, CheckCircle2];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const t = useTranslations("auth");
  const highlights = [
    { title: t("h1Title"), body: t("h1Body") },
    { title: t("h2Title"), body: t("h2Body") },
    { title: t("h3Title"), body: t("h3Body") },
  ];

  return (
    <main className="flex flex-1 flex-col lg:flex-row">
      {/* Brand / value panel */}
      <section className="relative hidden overflow-hidden bg-primary px-12 py-14 text-primary-foreground lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
        <div className="brand-grid pointer-events-none absolute inset-0 opacity-10" />
        <div className="relative">
          <BrandLogo href="/" className="[&_span]:text-primary-foreground" />
          <h2 className="mt-14 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            {t("panelHeading")}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">{t("panelSub")}</p>
        </div>

        <ul className="relative mt-12 space-y-4">
          {highlights.map((h, i) => {
            const Icon = highlightIcons[i]!;
            return (
              <li
                key={h.title}
                className="flex gap-3 rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm"
              >
                <Icon className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-xs text-primary-foreground/75">{h.body}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="relative flex items-center gap-2 text-xs text-primary-foreground/70">
          <ShieldCheck className="size-4" />
          {t("passwordless")}
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
