import { getTranslations } from "next-intl/server";
import { MergeTool } from "@/components/dashboard/merge-tool";

export const dynamic = "force-dynamic";

export default async function MergePage() {
  const t = await getTranslations("dashboard.merge");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lede")}</p>
      </div>
      <MergeTool />
    </div>
  );
}
