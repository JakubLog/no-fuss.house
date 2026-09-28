/**
 * Publiczny adres strony. Źródło: `NEXT_PUBLIC_SITE_URL` (patrz `.env.example`).
 * Bez zmiennej (albo przy złym formacie) używamy docelowej domeny.
 */
export const FALLBACK_SITE_URL = "https://no-fuss.house";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // Zły format w env: ostrzegamy i spadamy na fallback zamiast wywracać build.
      console.warn(`NEXT_PUBLIC_SITE_URL="${raw}" to nie jest poprawny URL; używam ${FALLBACK_SITE_URL}.`);
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
