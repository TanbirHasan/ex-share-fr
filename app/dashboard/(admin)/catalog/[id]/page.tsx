import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImageManager } from "@/components/dashboard/catalog/image-manager";
import { ProductForm } from "@/components/dashboard/catalog/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, apiGet } from "@/lib/api";
import type { Brand, Category, Product } from "@/lib/catalog-types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;
  try {
    product = await apiGet<Product>(`/api/v1/products/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const [categories, brands] = await Promise.all([
    apiGet<Category[]>("/api/v1/categories"),
    apiGet<Brand[]>("/api/v1/brands"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Catalog
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          {product.brand.name} · {product.category.nameEn}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} categories={categories} brands={brands} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageManager
            productId={product.id}
            images={product.images}
            primaryImage={product.primaryImage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
