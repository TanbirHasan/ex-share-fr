import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PenLine, Search } from "lucide-react";
import { auth } from "@/auth";
import { ReviewForm } from "@/components/site/review-form";
import { Button } from "@/components/ui/button";
import { ApiError, apiGet } from "@/lib/api";
import { apiFetch } from "@/lib/backend";
import type { Product } from "@/lib/catalog-types";
import type { Review } from "@/lib/review-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Share your experience" };

export default async function ContributePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    const target = `/contribute${slug ? `?product=${encodeURIComponent(slug)}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  if (!slug) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PenLine className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight">Share your experience</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find the product you own, then add your review from its page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">
            <Search className="size-4" /> Browse products
          </Link>
        </Button>
      </div>
    );
  }

  let product: Product;
  try {
    product = await apiGet<Product>(`/api/v1/products/by-slug/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return (
        <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted-foreground">
          That product doesn&apos;t exist.{" "}
          <Link href="/products" className="text-primary hover:underline">
            Browse products
          </Link>
        </div>
      );
    }
    throw e;
  }

  const mineRes = await apiFetch(`/api/v1/products/${product.id}/reviews/mine`);
  const existing: Review | null = mineRes.ok ? await mineRes.json() : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/products/${product.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {product.name}
      </Link>
      <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {existing ? "Edit your review" : "Write a review"}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {product.brand.name} · {product.category.nameEn}
      </p>

      <div className="mt-8">
        <ReviewForm
          product={{ id: product.id, slug: product.slug, name: product.name }}
          existing={existing}
        />
      </div>
    </div>
  );
}
