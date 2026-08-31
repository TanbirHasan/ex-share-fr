"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarkAllRead() {
  const router = useRouter();
  const t = useTranslations("notifications");
  const [pending, start] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await fetch("/api/notifications", { method: "POST", body: "{}" }).catch(() => {});
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
      {t("page.markAllRead")}
    </Button>
  );
}
