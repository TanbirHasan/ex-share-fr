"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Brand, Category } from "@/lib/catalog-types";

const ALL = "__all__";

type Current = { q: string; category: string; brand: string; sort: string };

export function BrowseToolbar({
  categories,
  brands,
  current,
}: {
  categories: Category[];
  brands: Brand[];
  current: Current;
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q);

  function go(next: Partial<Current>) {
    const merged = { ...current, ...next };
    const sp = new URLSearchParams();
    if (merged.q) sp.set("q", merged.q);
    if (merged.category) sp.set("category", merged.category);
    if (merged.brand) sp.set("brand", merged.brand);
    if (merged.sort) sp.set("sort", merged.sort);
    const qs = sp.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form
        className="relative min-w-56 flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          go({ q });
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="pl-9"
        />
      </form>

      <Select
        value={current.category || ALL}
        onValueChange={(v) => go({ category: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.slug}>
              {c.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.brand || ALL}
        onValueChange={(v) => go({ brand: v === ALL ? "" : v })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All brands</SelectItem>
          {brands.map((b) => (
            <SelectItem key={b.id} value={b.slug}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.sort || "newest"}
        onValueChange={(v) => go({ sort: v === "newest" ? "" : v })}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="trending">Trending</SelectItem>
          <SelectItem value="top_rated">Top rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
