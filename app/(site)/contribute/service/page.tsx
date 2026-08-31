import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ServiceForm } from "@/components/site/service-form";
import { ApiError, apiGet } from "@/lib/api";
import { apiFetch } from "@/lib/backend";
import type { Product } from "@/lib/catalog-types";
import type { ServiceExperience } from "@/lib/service-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Rate the customer service" };

export default async function ServicePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    const target = `/contribute/service${slug ? `?product=${encodeURIComponent(slug)}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted-foreground">
        Open a product page and choose “Rate the service”.{" "}
        <Link href="/products" className="text-primary hover:underline">
          Browse products
        </Link>
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
          That product doesn&apos;t exist.
        </div>
      );
    }
    throw e;
  }

  const mineRes = await apiFetch(`/api/v1/products/${product.id}/service/mine`);
  const existing: ServiceExperience | null = mineRes.ok ? await mineRes.json() : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/products/${product.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {product.name}
      </Link>
      <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {existing ? "Edit your service experience" : "Customer service experience"}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        How was dealing with the brand&apos;s after-sales service?
      </p>

      <div className="mt-8">
        <ServiceForm
          product={{ id: product.id, slug: product.slug, name: product.name }}
          existing={existing}
        />
      </div>
    </div>
  );
}
