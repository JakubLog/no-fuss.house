import type { NavSection } from "./routes";

export interface NavItem {
  label: string;
  /** `/…` (route), `/#kotwica` (sekcja strony głównej) albo `#kotwica` (ta sama strona). */
  href: string;
  /**
   * Sekcja, przy której link jest aktywny. Dokładne dopasowanie ścieżki daje
   * `aria-current="page"`, dopasowanie sekcji (np. case study → Realizacje)
   * daje `aria-current="true"`.
   */
  section?: NavSection;
}

/**
 * Nawigacja główna HUD. Etykiety 1:1 z legacy + „Usługi” (sekcja #uslugi z v5) + „Wiedza”.
 * Kolejność: usługi, realizacje, o nas, wiedza, kontakt.
 * Od 768 px linki stoją w wierszu HUD obok logo, niżej w panelu menu (`MobileMenu`).
 */
export const mainNav = [
  { label: "Usługi", href: "/#uslugi" },
  { label: "Realizacje", href: "/#realizacje", section: "work" },
  { label: "O nas", href: "/o-nas", section: "about" },
  { label: "Wiedza", href: "/wiedza", section: "events" },
  { label: "Kontakt", href: "#kontakt" },
] as const satisfies readonly NavItem[];
