"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SavedCtx = {
  ready: boolean;
  has: (productId: string) => boolean;
  setSaved: (productId: string, saved: boolean) => void;
};

const Ctx = createContext<SavedCtx | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/saved-ids")
      .then((r) => (r.ok ? r.json() : { ids: [] }))
      .then((d: { ids?: string[] }) => {
        if (alive) {
          setIds(new Set(d.ids ?? []));
          setReady(true);
        }
      })
      .catch(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const has = useCallback((productId: string) => ids.has(productId), [ids]);

  const setSaved = useCallback((productId: string, saved: boolean) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ ready, has, setSaved }}>{children}</Ctx.Provider>;
}

export function useSaved(): SavedCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSaved must be used within SavedProvider");
  return c;
}
