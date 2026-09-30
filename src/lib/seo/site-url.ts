/**
 * Publiczny adres strony. Źródło: `NEXT_PUBLIC_SITE_URL` (patrz `.env.example`).
 * Domena: no-fuss.house. Fallback działa, gdy zmiennej nie ustawiono.
 */
export const FALLBACK_SITE_URL = "https://no-fuss.house";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // Zły format w env: spadamy na fallback zamiast wywracać build.
    }
  }
  return new URL(FALLBACK_SITE_URL);
}

/** Bazowy URL (bez końcowego ukośnika w `origin`). Używaj jako `metadataBase`. */
export const siteUrl: URL = resolveSiteUrl();

/** Absolutny URL dla ścieżki wewnętrznej, np. `absoluteUrl("/o-nas")`. */
export function absoluteUrl(path: string = "/"): string {
  return new URL(path, siteUrl).toString();
}
