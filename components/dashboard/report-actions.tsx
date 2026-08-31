"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { resolveReport } from "@/app/dashboard/(admin)/moderation/actions";
import { Button } from "@/components/ui/button";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const t = useTranslations("catalog.reportActions");
  const [pending, start] = useTransition();

  function run(resolution: "dismiss" | "remove_content" | "keep_content", label: string) {
    start(async () => {
      const res = await resolveReport(reportId, resolution);
      if (res.ok) {
        toast.success(label);
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run("keep_content", t("contentKept"))}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        {t("keepContent")}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => run("remove_content", t("contentRemoved"))}
      >
        <Trash2 className="size-4" />
        {t("removeContent")}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run("dismiss", t("reportDismissed"))}
      >
        <X className="size-4" />
        {t("dismissReport")}
      </Button>
    </div>
  );
}
