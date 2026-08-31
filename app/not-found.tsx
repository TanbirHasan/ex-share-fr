import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("errorPages");
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{t("notFoundTitle")}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("notFoundBody")}</p>
      <Button asChild className="mt-6">
        <Link href="/">{t("home")}</Link>
      </Button>
    </main>
  );
}
