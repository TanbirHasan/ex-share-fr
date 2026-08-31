"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ImageOff, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/lib/catalog-types";

export function SearchCommand({ className }: { className?: string }) {
  const router = useRouter();
  const t = useTranslations("header");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Suggestion>({ products: [], brands: [] });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setData({ products: [], brands: [] });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (res.ok) setData((await res.json()) as Suggestion);
      } catch {
        // aborted or offline — ignore
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submit(q: string) {
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  function goto(href: string) {
    setOpen(false);
    setValue("");
    router.push(href);
  }

  const hasResults = data.products.length > 0 || data.brands.length > 0;

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="h-10 pl-9"
          aria-label="Search"
        />
      </form>

      {open && value.trim().length >= 2 && (
        <div className="absolute top-11 right-0 left-0 z-50 overflow-hidden rounded-xl border bg-popover shadow-lg">
          {hasResults ? (
            <div className="max-h-96 overflow-y-auto py-1">
              {data.products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goto(`/products/${p.slug}`)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {p.primaryImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.primaryImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="size-4 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.brandName}</span>
                  </span>
                </button>
              ))}

              {data.brands.length > 0 && (
                <div className="mt-1 border-t pt-1">
                  {data.brands.map((b) => (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => goto(`/brands/${b.slug}`)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                    >
                      <Store className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{b.name}</span>
                        <span className="text-muted-foreground"> · brand</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">No quick matches.</p>
          )}

          <button
            type="button"
            onClick={() => submit(value)}
            className="flex w-full items-center gap-2 border-t px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-accent"
          >
            <Search className="size-4" />
            Search for “{value.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
