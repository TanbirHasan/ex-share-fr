import "server-only";
import { getLocale } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * The language a user is writing in right now, derived from the active UI
 * locale. Passed as `contentLang` on every content-creating request so the
 * backend can tag reviews / problems / solutions / comments / Q&A for later
 * on-demand translation.
 */
export async function activeContentLang(): Promise<Locale> {
  const raw = await getLocale();
  return isLocale(raw) ? raw : defaultLocale;
}
