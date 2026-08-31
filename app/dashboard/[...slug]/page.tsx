import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPlaceholder({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [{ slug }, t] = await Promise.all([params, getTranslations("dashboard.placeholder")]);
  const title = (slug.at(-1) ?? t("section"))
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Hammer className="size-6" />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("notBuilt")}</p>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/dashboard">{t("backToOverview")}</Link>
      </Button>
    </div>
  );
}
