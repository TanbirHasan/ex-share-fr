import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { PenLine, Search } from "lucide-react";
import { auth } from "@/auth";
import { ContributeIntro } from "@/components/site/contribute-intro";
import { ReviewForm } from "@/components/site/review-form";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { ApiError, apiGet } from "@/lib/api";
import { apiFetch } from "@/lib/backend";
import type { Product } from "@/lib/catalog-types";
import { localizedName } from "@/lib/i18n-content";
import type { Review } from "@/lib/review-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contribute");
  return { title: t("metaTitle") };
}

export default async function ContributePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: slug } = await searchParams;
  const [session, t, tReviews, tCommon, locale] = await Promise.all([
    auth(),
    getTranslations("contribute"),
    getTranslations("reviews"),
    getTranslations("common"),
    getLocale() as Promise<Locale>,
  ]);

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
        <h1 className="mt-5 text-xl font-semibold tracking-tight">{t("shareExperience")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("findProductThen")}</p>
        <Button asChild className="mt-6">
          <Link href="/products">
            <Search className="size-4" /> {tCommon("browseProducts")}
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
          {t("productDoesntExist")}{" "}
          <Link href="/products" className="text-primary hover:underline">
            {tCommon("browseProducts")}
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
        {existing ? tReviews("editYourReview") : tReviews("writeReview")}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {product.brand.name} · {localizedName(locale, product.category)}
      </p>

      {!existing && (
        <div className="mt-6">
          <ContributeIntro />
        </div>
      )}

      <div className="mt-8">
        <ReviewForm
          product={{ id: product.id, slug: product.slug, name: product.name }}
          existing={existing}
        />
      </div>
    </div>
  );
}
