"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { reportPrice } from "@/app/(site)/price-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReportPrice({ productId, slug }: { productId: string; slug: string }) {
  const t = useTranslations("prices");
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");
  const [pending, start] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <Plus className="size-3.5" />
        {t("reportCta")}
      </button>
    );
  }

  function submit() {
    start(async () => {
      const res = await reportPrice(productId, slug, {
        price: Number(price),
        storeName: store,
      });
      if (res.ok) {
        toast.success(t("thanks"));
        setOpen(false);
        setPrice("");
        setStore("");
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg border bg-background p-3">
      <div className="flex gap-2">
        <Input
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t("pricePlaceholder")}
          className="h-9"
        />
        <Input
          value={store}
          onChange={(e) => setStore(e.target.value)}
          placeholder={t("storePlaceholder")}
          className="h-9"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={submit} disabled={pending || !price}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("submit")}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
