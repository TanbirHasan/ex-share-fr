"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { fulfillRequest, resolveRequest } from "@/app/dashboard/(admin)/requests/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Suggestion } from "@/lib/catalog-types";

export function RequestActions({
  requestId,
  rawText,
}: {
  requestId: string;
  rawText: string;
}) {
  const router = useRouter();
  const t = useTranslations("dashboard.requests");
  const [pending, start] = useTransition();
  const [linking, setLinking] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion["products"]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (res.ok) setResults(((await res.json()) as Suggestion).products);
      } catch {
        // aborted — ignore
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setLinking(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function reject() {
    start(async () => {
      const res = await resolveRequest(requestId, "rejected");
      if (res.ok) {
        toast.success(t("markedRejected"));
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  function link(productId: string) {
    start(async () => {
      const res = await fulfillRequest(requestId, productId);
      if (res.ok) {
        toast.success(t("linkedSuccess"));
        setLinking(false);
        setQuery("");
        router.refresh();
      } else {
        toast.error(res.error ?? t("failed"));
      }
    });
  }

  return (
    <div ref={boxRef} className="relative flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" disabled={pending} asChild>
        <Link
          href={`/dashboard/catalog/new?requestId=${requestId}&name=${encodeURIComponent(rawText)}`}
        >
          <Plus className="size-4" />
          {t("createProduct")}
        </Link>
      </Button>

      <Button size="sm" variant="outline" disabled={pending} onClick={() => setLinking((v) => !v)}>
        <Search className="size-4" />
        {t("linkExisting")}
      </Button>

      <Button size="sm" variant="ghost" disabled={pending} onClick={reject}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
        {t("reject")}
      </Button>

      {linking && (
        <div className="absolute top-10 left-0 z-20 w-72 rounded-xl border bg-popover p-2 shadow-lg">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("linkExistingPlaceholder")}
            className="h-8 text-sm"
          />
          {results.length > 0 && (
            <ul className="mt-2 max-h-56 space-y-0.5 overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => link(p.id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <Check className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{p.name}</span>
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
