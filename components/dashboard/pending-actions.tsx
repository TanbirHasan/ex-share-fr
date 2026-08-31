"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { decidePending } from "@/app/dashboard/(admin)/pending/actions";
import { Button } from "@/components/ui/button";

export function PendingActions({
  type,
  id,
}: {
  type: "review" | "problem" | "solution" | "service";
  id: string;
}) {
  const router = useRouter();
  const t = useTranslations("dashboard.pendingQueue");
  const [pending, start] = useTransition();

  function run(decision: "approve" | "reject", label: string) {
    start(async () => {
      const res = await decidePending(type, id, decision);
      if (res.ok) {
        toast.success(label);
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => run("approve", t("approved"))}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        {t("approve")}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run("reject", t("rejected"))}
      >
        <X className="size-4" />
        {t("reject")}
      </Button>
    </div>
  );
}
