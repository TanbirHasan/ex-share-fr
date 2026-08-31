import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PackagePlus } from "lucide-react";
import { auth } from "@/auth";
import { RequestForm } from "@/components/site/request-form";
import { apiGet } from "@/lib/api";
import type { Category } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("requestForm");
  return { title: t("metaTitle") };
}

export default async function RequestProductPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [session, t] = await Promise.all([auth(), getTranslations("requestForm")]);

  if (!session?.user) {
    const target = `/contribute/request${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  const categories = await apiGet<Category[]>("/api/v1/categories").catch(
    () => [] as Category[],
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/products"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t("back")}
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackagePlus className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("lede")}</p>
        </div>
      </div>

      <div className="mt-8">
        <RequestForm categories={categories} defaultText={q ?? ""} />
      </div>
    </div>
  );
}
