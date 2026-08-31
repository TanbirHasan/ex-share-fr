import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand-logo";

const columns = [
  {
    heading: "explore" as const,
    links: [
      ["products", "/products"],
      ["brands", "/brands"],
      ["stores", "/stores"],
      ["problems", "/problems"],
      ["compare", "/compare"],
    ],
  },
  {
    heading: "contribute" as const,
    links: [
      ["shareExperience", "/contribute"],
      ["reportProblem", "/contribute/problem"],
      ["addSolution", "/contribute/solution"],
      ["requestProduct", "/contribute/request"],
    ],
  },
  {
    heading: "about" as const,
    links: [
      ["howItWorks", "/about"],
      ["contentPolicy", "/policy"],
      ["terms", "/terms"],
      ["privacy", "/privacy"],
    ],
  },
] as const;

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <BrandLogo showTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("blurb")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              {t(col.heading)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([key, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} ExperienceHub. {t("built")}
          </p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
