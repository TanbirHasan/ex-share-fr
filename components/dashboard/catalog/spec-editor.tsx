"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = { key: string; value: string };

function rowsFrom(spec: Record<string, unknown> | undefined): Row[] {
  const entries = Object.entries(spec ?? {});
  return entries.length
    ? entries.map(([key, value]) => ({ key, value: String(value) }))
    : [{ key: "", value: "" }];
}

/**
 * `value`/`onChange` make this controlled (used when the parent form needs to
 * push in AI-drafted specs); omit both to keep it self-contained, seeded once
 * from `initial`, as on the edit page.
 */
export function SpecEditor({
  initial,
  value,
  onChange,
}: {
  initial?: Record<string, unknown>;
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
}) {
  const t = useTranslations("catalog.spec");
  const controlled = value !== undefined;
  const [internalRows, setInternalRows] = useState<Row[]>(() => rowsFrom(initial));
  const rows = controlled ? rowsFrom(value) : internalRows;

  function setRows(next: Row[]) {
    if (controlled) {
      const obj: Record<string, string> = {};
      for (const r of next) {
        const k = r.key.trim();
        if (k) obj[k] = r.value;
      }
      onChange?.(obj);
    } else {
      setInternalRows(next);
    }
  }

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
                setRows(rows.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))
              }
            />
            <Input
              placeholder={t("valuePlaceholder")}
              value={row.value}
              onChange={(e) =>
                setRows(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setRows(rows.length > 1 ? rows.filter((_, j) => j !== i) : rows)}
              aria-label={t("removeRow")}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => setRows([...rows, { key: "", value: "" }])}>
        <Plus className="size-4" /> {t("addSpec")}
      </Button>
    </div>
  );
}
