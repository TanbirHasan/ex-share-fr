"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = { key: string; value: string };

export function SpecEditor({ initial }: { initial?: Record<string, unknown> }) {
  const t = useTranslations("catalog.spec");
  const [rows, setRows] = useState<Row[]>(() => {
    const entries = Object.entries(initial ?? {});
    return entries.length
      ? entries.map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: "", value: "" }];
  });

  const json = useMemo(() => {
    const obj: Record<string, string> = {};
    for (const r of rows) {
      const k = r.key.trim();
      if (k) obj[k] = r.value.trim();
    }
    return JSON.stringify(obj);
  }, [rows]);

  return (
    <div className="space-y-2">
      <Label>{t("label")}</Label>
      <input type="hidden" name="spec" value={json} />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder={t("keyPlaceholder")}
              value={row.key}
              onChange={(e) =>
                setRows((r) => r.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))
              }
            />
            <Input
              placeholder={t("valuePlaceholder")}
              value={row.value}
              onChange={(e) =>
                setRows((r) => r.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setRows((r) => (r.length > 1 ? r.filter((_, j) => j !== i) : r))}
              aria-label={t("removeRow")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRows((r) => [...r, { key: "", value: "" }])}
      >
        <Plus className="size-4" /> {t("addSpec")}
      </Button>
    </div>
  );
}
