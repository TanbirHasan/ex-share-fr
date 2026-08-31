"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { COMPARE_MAX } from "@/lib/compare-types";

const KEY = "eh-compare";

export type CompareItem = { slug: string; name: string };

type CompareCtx = {
  items: CompareItem[];
  has: (slug: string) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  ensure: (items: CompareItem[]) => void;
  full: boolean;
};

const Ctx = createContext<CompareCtx | null>(null);

function read(): CompareItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v)
      ? v
          .filter((i) => i && typeof i.slug === "string")
          .map((i) => ({ slug: String(i.slug), name: String(i.name ?? i.slug) }))
          .slice(0, COMPARE_MAX)
      : [];
  } catch {
    return [];
  }
}

function write(items: CompareItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CompareTrayProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = useCallback((next: CompareItem[]) => {
    setItems(next);
    write(next);
  }, []);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const toggle = useCallback(
    (item: CompareItem) => {
      const exists = items.some((i) => i.slug === item.slug);
      if (exists) set(items.filter((i) => i.slug !== item.slug));
      else if (items.length < COMPARE_MAX) set([...items, item]);
    },
    [items, set],
  );

  const remove = useCallback(
    (slug: string) => set(items.filter((i) => i.slug !== slug)),
    [items, set],
  );

  const clear = useCallback(() => set([]), [set]);

  const ensure = useCallback((incoming: CompareItem[]) => {
    setItems((prev) => {
      const bySlug = new Map(prev.map((i) => [i.slug, i]));
      for (const it of incoming) if (!bySlug.has(it.slug)) bySlug.set(it.slug, it);
      const next = [...bySlug.values()].slice(0, COMPARE_MAX);
      write(next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider
      value={{ items, has, toggle, remove, clear, ensure, full: items.length >= COMPARE_MAX }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCompareTray(): CompareCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompareTray must be used within CompareTrayProvider");
  return ctx;
}

/** Sync URL-provided products into the tray on mount (for shared /compare links). */
export function TraySync({ items }: { items: CompareItem[] }) {
  const { ensure } = useCompareTray();
  useEffect(() => {
    ensure(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.slug).join(",")]);
  return null;
}
