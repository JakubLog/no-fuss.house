import type { Metadata } from "next";
import { NotFoundHero } from "@/components/organisms/NotFoundHero";

/**
 * Tytuł karty „404 — NO-FUSS©2026” (1:1 z legacy/404.html): `title` przechodzi przez
 * `TITLE_TEMPLATE` z root layoutu. Docs Next 16 opisują `metadata` tylko dla eksperymentalnego
 * `global-not-found.js` (omija root layout), ale resolver metadanych Next 16.3
 * (`collectMetadata`, gałąź `errorConvention`) czyta eksport `metadata` z `not-found.js`
 * i dokłada go na końcu łańcucha layoutów. React 19 `<title>` w komponencie nie wystarcza:
 * trafia do `<head>` za tytułem z layoutu, więc `document.title` zostaje „NO-FUSS©2026”.
 * `robots: null`: Next sam wstawia `<meta name="robots" content="noindex">` i status 404
 * (`app-render`, niezależnie od `metadata`), a root layout dokładał `index, follow` i `googlebot`
 * (sprzeczne tagi). `null` kasuje dziedziczone dyrektywy, zostaje jeden tag Nexta (`noindex`,
 * `follow` domyślnie); obiekt `{ index: false, follow: true }` dałby drugi tag robots.
 * `description` 1:1 z legacy (inaczej dziedziczy opis strony głównej).
 */
export const metadata: Metadata = {
  title: "404",
  description: "404: tej strony nie ma.",
  robots: null,
};

/** Strona 404 (legacy/404.html). */
export default function NotFound() {
  return <NotFoundHero />;
}
