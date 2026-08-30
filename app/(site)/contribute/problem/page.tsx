import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReportProblemForm } from "@/components/site/report-problem-form";
import { ApiError, apiGet } from "@/lib/api";
import type { Product } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Report a problem" };

export default async function ReportProblemPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    const target = `/contribute/problem${slug ? `?product=${encodeURIComponent(slug)}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted-foreground">
        Open a product page and choose “Report a problem”.{" "}
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

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={`/products/${product.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {product.name}
      </Link>
      <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Report a problem
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe a real fault so the next buyer sees it coming.
      </p>

      <div className="mt-8">
        <ReportProblemForm
          product={{ id: product.id, slug: product.slug, name: product.name }}
        />
      </div>
    </div>
  );
}
