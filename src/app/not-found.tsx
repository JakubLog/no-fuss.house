import { NotFoundHero } from "@/components/organisms/NotFoundHero";

/**
 * Strona 404 (legacy/404.html). Next sam dodaje `noindex` i status 404.
 *
 * Tytuł: `not-found.tsx` nie obsługuje eksportu `metadata` / `generateMetadata`
 * (to umie tylko eksperymentalny `global-not-found.js`, który omija root layout),
 * więc karta pokazuje domyślny tytuł z layoutu „NO-FUSS©2026”, a nie „404 — NO-FUSS©2026”.
 */
export default function NotFound() {
  return <NotFoundHero />;
}
