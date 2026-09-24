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
  /** Ukryj poniżej 640 px (4 linki nie mieszczą się w HUD na telefonie). */
  hideOnSmall?: boolean;
}

/**
 * Nawigacja główna HUD. Etykiety 1:1 z legacy + „Usługi” (sekcja #uslugi z v5).
 * Kolejność jak sekcje strony głównej: usługi, realizacje, o nas, kontakt.
 * Wszystkie 4 linki są widoczne na każdej szerokości: HUD mieści je od ~340 px,
 * przy 320 px nav zawija się pod logo. `hideOnSmall` zostaje w typie na przyszłość.
 */
export const mainNav = [
  { label: "Usługi", href: "/#uslugi" },
  { label: "Realizacje", href: "/#realizacje", section: "work" },
  { label: "O nas", href: "/o-nas", section: "about" },
  { label: "Kontakt", href: "#kontakt" },
] as const satisfies readonly NavItem[];
