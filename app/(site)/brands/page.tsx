import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Brand } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manufacturers covered on ExperienceHub, with community product counts.",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default async function BrandsPage() {
  const brands = await apiGet<Brand[]>("/api/v1/brands");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Brands
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          All brands
        </h1>
      </header>

      {brands.length === 0 ? (
        <p className="rounded-xl border bg-card p-12 text-center text-sm text-muted-foreground">
          No brands yet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <li key={b.id}>
              <Link
                href={`/brands/${b.slug}`}
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {b.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logoUrl} alt="" className="h-full w-full object-contain" />
                  ) : (
                    initials(b.name)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{b.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {b.productCount ?? 0} product{(b.productCount ?? 0) === 1 ? "" : "s"}
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
