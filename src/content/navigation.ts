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
  /** Ukryj poniżej 640 px (więcej niż 4 linki nie mieści się w HUD obok logo na telefonie). */
  hideOnSmall?: boolean;
}

/**
 * Nawigacja główna HUD. Etykiety 1:1 z legacy + „Usługi” (sekcja #uslugi z v5) + „Wiedza”.
 * Kolejność: usługi, realizacje, o nas, wiedza, kontakt.
 * 4 linki mieszczą się obok logo od ~340 px (przy 320 px nav zawija się pod logo). „Wiedza”
 * jest ukryta poniżej 640 px: na telefonie prowadzą tam zajawki na `/` (`#wiedza`) i `/o-nas#wydarzenia`.
 */
export const mainNav = [
  { label: "Usługi", href: "/#uslugi" },
  { label: "Realizacje", href: "/#realizacje", section: "work" },
  { label: "O nas", href: "/o-nas", section: "about" },
  { label: "Wiedza", href: "/wiedza", section: "events", hideOnSmall: true },
  { label: "Kontakt", href: "#kontakt" },
] as const satisfies readonly NavItem[];
