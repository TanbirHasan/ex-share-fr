import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";

/** "Pending review" / "Not approved" pill for a contributor's own dashboard rows. */
export async function ModerationBadge({ status }: { status: string }) {
  if (status !== "pending" && status !== "rejected") return null;
  const t = await getTranslations("dashboard.pages");
  return (
    <Badge
      variant={status === "rejected" ? "destructive" : "secondary"}
      className="text-[11px]"
    >
      {status === "rejected" ? t("statusRejected") : t("statusPending")}
    </Badge>
  );
}
