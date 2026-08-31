"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type FollowKind = "product" | "problem";

type FollowCtx = {
  ready: boolean;
  has: (kind: FollowKind, id: string) => boolean;
  set: (kind: FollowKind, id: string, following: boolean) => void;
};

const Ctx = createContext<FollowCtx | null>(null);

export function FollowProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<{ product: Set<string>; problem: Set<string> }>({
    product: new Set(),
    problem: new Set(),
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/following-ids")
      .then((r) => (r.ok ? r.json() : { products: [], problems: [] }))
      .then((d: { products?: string[]; problems?: string[] }) => {
        if (!alive) return;
        setIds({
          product: new Set(d.products ?? []),
          problem: new Set(d.problems ?? []),
        });
        setReady(true);
      })
      .catch(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const has = useCallback(
    (kind: FollowKind, id: string) => ids[kind].has(id),
    [ids],
  );

  const set = useCallback((kind: FollowKind, id: string, following: boolean) => {
    setIds((prev) => {
      const next = new Set(prev[kind]);
      if (following) next.add(id);
      else next.delete(id);
      return { ...prev, [kind]: next };
    });
  }, []);

  return <Ctx.Provider value={{ ready, has, set }}>{children}</Ctx.Provider>;
}

export function useFollow(): FollowCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFollow must be used within FollowProvider");
  return c;
}
