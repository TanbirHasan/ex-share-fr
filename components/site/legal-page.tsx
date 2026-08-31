import { getTranslations } from "next-intl/server";

/** Renders one of the simple content pages from the `legal` namespace. */
export async function LegalPage({ page }: { page: "about" | "policy" | "terms" | "privacy" }) {
  const t = await getTranslations("legal");
  const paras = ["p1", "p2", "p3", "p4"].filter((k) => t.has(`${page}.${k}`));

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t(`${page}.title`)}
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {paras.map((k) => (
          <p key={k}>{t(`${page}.${k}`)}</p>
        ))}
      </div>
      <p className="mt-10 text-xs text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}
