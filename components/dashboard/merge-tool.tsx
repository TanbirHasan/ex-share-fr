"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { mergeProblems } from "@/app/dashboard/(admin)/merge/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Hit = { id: string; slug: string; title: string; product: string };

function ProblemPicker({
  label,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  selected: Hit | null;
  onSelect: (h: Hit) => void;
  onClear: () => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/problem-search?q=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        const d = res.ok ? await res.json() : { data: [] };
        setHits(d.data ?? []);
      } catch {
        /* ignore */
      }
    }, 200);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {selected ? (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{selected.title}</p>
            <p className="truncate text-xs text-muted-foreground">{selected.product}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="clear">
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div ref={box} className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="pl-9"
          />
          {open && hits.length > 0 && (
            <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg">
              {hits.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(h);
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full flex-col px-3 py-2 text-left hover:bg-accent"
                  >
                    <span className="truncate text-sm font-medium">{h.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{h.product}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function MergeTool() {
  const router = useRouter();
  const t = useTranslations("dashboard.merge");
  const [source, setSource] = useState<Hit | null>(null);
  const [target, setTarget] = useState<Hit | null>(null);
  const [pending, start] = useTransition();

  const sameProblem = source && target && source.id === target.id;
  const canMerge = source && target && !sameProblem;

  function run() {
    if (!source || !target) return;
    if (!window.confirm(t("confirm", { source: source.title, target: target.title }))) return;
    start(async () => {
      const res = await mergeProblems(source.id, target.id);
      if (res.ok) {
        toast.success(t("merged"));
        setSource(null);
        setTarget(null);
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProblemPicker
          label={t("sourceLabel")}
          selected={source}
          onSelect={setSource}
          onClear={() => setSource(null)}
        />
        <ProblemPicker
          label={t("targetLabel")}
          selected={target}
          onSelect={setTarget}
          onClear={() => setTarget(null)}
        />
      </div>

      <p className={cn("text-xs", sameProblem ? "text-destructive" : "text-muted-foreground")}>
        {sameProblem ? t("sameProblem") : t("pickBoth")}
      </p>

      <Button disabled={!canMerge || pending} onClick={run}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("mergeButton")}
      </Button>
    </div>
  );
}
