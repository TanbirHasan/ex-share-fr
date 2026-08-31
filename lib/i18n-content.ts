import type { Locale } from "@/i18n/config";

/**
 * Pick the field for the active locale, falling back to English when the
 * localized value is missing/empty. Used for canonical content that carries
 * both an `*En` and `*Bn` column (categories, brands, problem categories…).
 */
export function localized(
  locale: Locale,
  en: string | null | undefined,
  bn: string | null | undefined,
): string {
  if (locale === "bn" && bn && bn.trim()) return bn;
  return en ?? "";
}

/** Convenience for the common `{ nameEn, nameBn }` shape. */
export function localizedName(
  locale: Locale,
  row: { nameEn?: string | null; nameBn?: string | null },
): string {
  return localized(locale, row.nameEn, row.nameBn);
}
