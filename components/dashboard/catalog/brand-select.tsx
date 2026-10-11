"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Brand } from "@/lib/catalog-types";

export function BrandSelect({
  brands,
  defaultValue,
  placeholder,
  searchPlaceholder,
  emptyLabel,
}: {
  brands: Brand[];
  defaultValue?: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => brands.find((b) => b.id === selectedId),
    [brands, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, query]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <input type="hidden" name="brandId" value={selectedId} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute top-10 left-0 z-20 w-full rounded-md border bg-popover p-2 shadow-lg">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 text-sm"
          />
          <ul className="mt-2 max-h-56 space-y-0.5 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">{emptyLabel}</li>
            )}
            {filtered.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(b.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <Check
                    className={`size-3.5 shrink-0 ${b.id === selectedId ? "opacity-100" : "opacity-0"} text-primary`}
                  />
                  <span className="truncate">{b.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
