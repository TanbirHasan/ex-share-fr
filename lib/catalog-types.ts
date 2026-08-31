export type Category = {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  icon: string | null;
  parentId: string | null;
  createdAt: string;
  productCount?: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  aboutEn: string | null;
  aboutBn: string | null;
  createdAt: string;
  productCount?: number;
};

export type ProductStatus = "new" | "active" | "older" | "discontinued";

export const PRODUCT_STATUSES: ProductStatus[] = [
  "new",
  "active",
  "older",
  "discontinued",
];

export type ProductImage = { id: string; url: string; sort: number };

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  brandId: string;
  category: { id: string; slug: string; nameEn: string; nameBn: string };
  brand: { id: string; slug: string; name: string };
  name: string;
  modelNo: string | null;
  status: ProductStatus;
  priceMin: number | null;
  priceMax: number | null;
  warrantyText: string | null;
  spec: Record<string, unknown>;
  primaryImage: string | null;
  ratingAvg: number;
  ratingCount: number;
  wouldBuyAgainPct: number;
  categoryRatingAvgs: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  problemCount: number;
};

/** Products as returned by the list endpoint (no images array, no problem count). */
export type ProductListItem = Omit<Product, "images" | "problemCount">;

export type BrandHit = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

export type CategoryHit = {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
};

export type SearchResult = {
  query: string;
  total: number;
  products: ProductListItem[];
  brands: BrandHit[];
  categories: CategoryHit[];
};

export type Suggestion = {
  products: {
    id: string;
    slug: string;
    name: string;
    primaryImage: string | null;
    brandName: string;
  }[];
  brands: { slug: string; name: string }[];
};

export type Paginated<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};
