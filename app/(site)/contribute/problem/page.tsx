import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { ReportProblemForm } from "@/components/site/report-problem-form";
import { ApiError, apiGet } from "@/lib/api";
import type { Product } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contribute");
  return { title: t("problemMetaTitle") };
}

export default async function ReportProblemPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const [session, t, tCommon] = await Promise.all([
    auth(),
    getTranslations("contribute"),
    getTranslations("common"),
  ]);

  if (!session?.user) {
    const target = `/contribute/problem${slug ? `?product=${encodeURIComponent(slug)}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  if (!slug) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted-foreground">
        {t("problemOpenProductPage")}{" "}
        <Link href="/products" className="text-primary hover:underline">
          {tCommon("browseProducts")}
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
          {t("productDoesntExist")}
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
        {t("reportAProblem")}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("problemLede")}</p>

      <div className="mt-8">
        <ReportProblemForm
          product={{ id: product.id, slug: product.slug, name: product.name }}
        />
      </div>
    </div>
  );
}
