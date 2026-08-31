"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clearPriceAlert, setPriceAlert } from "@/app/(site)/price-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PriceAlertControl({
  productId,
  slug,
  current,
}: {
  productId: string;
  slug: string;
  current: { targetPrice: number } | null;
}) {
  const t = useTranslations("prices");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current ? String(current.targetPrice) : "");
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await setPriceAlert(productId, slug, Number(value));
      if (res.ok) {
        toast.success(t("alertSet"));
        setEditing(false);
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  function clear() {
    start(async () => {
      const res = await clearPriceAlert(productId, slug);
      if (res.ok) {
        toast.success(t("alertCleared"));
        setValue("");
        setEditing(false);
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  if (current && !editing) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          <Bell className="size-3.5" />
          {t("alertActive", { price: `৳${current.targetPrice.toLocaleString("en-US")}` })}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-muted-foreground hover:underline"
        >
          {t("alertEdit")}
        </button>
        <button
          type="button"
          onClick={clear}
          disabled={pending}
          className="inline-flex items-center gap-0.5 text-muted-foreground hover:underline"
        >
          <BellOff className="size-3" />
          {t("alertRemove")}
        </button>
      </div>
    );
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <Bell className="size-3.5" />
        {t("alertCta")}
      </button>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <Input
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("alertPlaceholder")}
        className="h-9"
      />
      <Button size="sm" onClick={save} disabled={pending || !value}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("alertSave")}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
        {t("cancel")}
      </Button>
    </div>
  );
}
