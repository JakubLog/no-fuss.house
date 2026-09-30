import type { Metadata } from "next";
import { getRoute } from "@/content/routes";
import { site } from "@/content/site";
import { siteUrl } from "./site-url";

/** Sufiks tytułów podstron: „O nas: Magda Nestorowicz i Kuba Fedoszczak — no-fuss”. */
export const TITLE_TEMPLATE = `%s — ${site.name}`;

/** Obraz OG/Twitter; `url` względny względem `metadataBase` albo absolutny. */
export interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

/** Wspólne dyrektywy dla robotów (także Google). */
const ROBOTS_INDEX: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const ROBOTS_NOINDEX: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

/** Metadane bazowe dla `app/layout.tsx`. Strony nadpisują je przez `buildMetadata`. */
export const rootMetadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: site.name,
  title: {
    default: site.homeTitle,
    template: TITLE_TEMPLATE,
  },
  description: site.description,
  authors: [{ name: "Magda Nestorowicz" }, { name: "Kuba Fedoszczak" }],
  creator: site.name,
  publisher: site.name,
  /* Bez `alternates.canonical` i `openGraph.url`: każda strona ustawia je przez
     `buildMetadata`, inaczej podstrona bez metadanych dziedziczyłaby canonical „/”. */
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.homeTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.homeTitle,
    description: site.description,
  },
  robots: ROBOTS_INDEX,
  formatDetection: { telephone: false, email: false, address: false },
};

/**
 * Obraz z `app/opengraph-image.tsx`. Next dokleja obraz z pliku tylko w segmencie, w którym plik
 * leży: strona, która ustawia własne `openGraph` (a `buildMetadata` zawsze ustawia), traciłaby
 * `og:image`. Dlatego domyślny obraz podajemy jawnie (wymiary i alt jak w `opengraph-image.tsx`).
 */
export const DEFAULT_OG_IMAGE: SeoImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.wordmark} — ${site.slogan}`,
};

export interface BuildMetadataInput {
  /**
   * Ścieżka strony, np. `/o-nas`. Jeśli jest w `routes.ts`, tytuł bierzemy stamtąd.
   * Służy też jako canonical i `og:url`.
   */
  path: string;
  /** Nadpisuje tytuł z `routes.ts` (bez sufiksu, sufiks dokleja template). */
  title?: string;
  /** Domyślnie: opis strony głównej dla `/`, krótki opis dla podstron. */
  description?: string;
  /** `article` dla case study, `website` dla reszty. */
  type?: "website" | "article";
  /**
   * Obrazy OG/Twitter. Bez nich: `DEFAULT_OG_IMAGE` (root `opengraph-image.tsx`).
   */
  images?: SeoImage[];
  /** `true` → `noindex, follow` (np. strony robocze). */
  noIndex?: boolean;
}

/**
 * Metadane strony. Użycie w `page.tsx`:
 *
 * ```ts
 * export const metadata = buildMetadata({ path: "/otb", type: "article" });
 * ```
 *
 * Next łączy metadane płytko, więc `openGraph` i `twitter` z layoutu zostałyby
 * nadpisane w całości. Ten helper zawsze składa komplet (siteName, locale, url).
 */
export function buildMetadata({
  path,
  title,
  description,
  type = "website",
  images = [DEFAULT_OG_IMAGE],
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const route = getRoute(path);
  const pageTitle = title ?? route?.title ?? null;
  /* Strona główna: `homeTitle` bez template'u (marka już w nim jest). */
  const fullTitle = pageTitle ? TITLE_TEMPLATE.replace("%s", pageTitle) : site.homeTitle;
  const desc = description ?? (path === "/" ? site.description : site.shortDescription);

  return {
    title: pageTitle ? pageTitle : { absolute: site.homeTitle },
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: site.locale,
      url: path,
      siteName: site.name,
      title: fullTitle,
      description: desc,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images,
    },
    robots: noIndex ? ROBOTS_NOINDEX : ROBOTS_INDEX,
  };
}
