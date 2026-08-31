import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    const t = await getTranslations("dashboard.admin");
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight">{t("accessRequired")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("noPermission")}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/dashboard">{t("backToOverview")}</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
