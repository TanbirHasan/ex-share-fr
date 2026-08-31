"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { resolveRequest } from "@/app/dashboard/(admin)/requests/actions";
import { Button } from "@/components/ui/button";

export function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const t = useTranslations("dashboard.requests");
  const [pending, start] = useTransition();

  function run(status: "added" | "rejected", label: string) {
    start(async () => {
      const res = await resolveRequest(requestId, status);
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
        onClick={() => run("added", t("markedAdded"))}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        {t("markAdded")}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run("rejected", t("markedRejected"))}
      >
        <X className="size-4" />
        {t("reject")}
      </Button>
    </div>
  );
}
