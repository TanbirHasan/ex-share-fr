import Link from "next/link";
import { ImageOff } from "lucide-react";
import { CompareButton } from "@/components/site/compare-button";
import { RatingStars } from "@/components/site/rating-stars";
import { SaveButton } from "@/components/site/save-button";
import { formatPrice } from "@/lib/format";
import type { ProductListItem } from "@/lib/catalog-types";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40">
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <SaveButton productId={product.id} showLabel={false} className="backdrop-blur" />
        <CompareButton slug={product.slug} name={product.name} className="backdrop-blur" />
      </div>
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
          {product.primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.primaryImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <ImageOff className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-medium text-muted-foreground">{product.brand.name}</p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-2">
            <RatingStars value={product.ratingAvg} count={product.ratingCount} />
          </div>
          <p className="mt-auto pt-2 text-sm font-semibold text-foreground tabular-nums">
            {formatPrice(product.priceMin, product.priceMax)}
          </p>
        </div>
      </Link>
    </div>
  );
}
