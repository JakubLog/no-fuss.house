import type { MetadataRoute } from "next";
import type { InternalPath } from "./types";

/**
 * Jedno źródło prawdy dla wszystkich route'ów strony.
 *
 * Z tej listy korzystają: `app/sitemap.ts`, `next.config.ts` (przekierowania 308
 * ze starych plików HTML), `Hud` (aktywny link) i `public/llms.txt` (ręcznie).
 * Dodajesz stronę → dopisz ją tutaj. Sitemap i redirecty zaktualizują się same.
 */

export type RouteKind = "home" | "page" | "case";

/** Sekcja nawigacji, do której należy route (steruje `aria-current` w HUD). */
export type NavSection = "home" | "about" | "work" | "events";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface SiteRoute {
  path: InternalPath;
  /**
   * Tytuł strony BEZ sufiksu (sufiks „ — no-fuss” dokleja template w layout).
   * Mówi, czym jest strona, nie tylko jak się nazywa: z sufiksem do ~60 znaków.
   * `null` = strona główna (`site.homeTitle`).
   */
  title: string | null;
  kind: RouteKind;
  section: NavSection;
  /** Pliki legacy (bez `.html`), z których przekierowujemy 308 (stałe) na `path`. */
  legacy: readonly string[];
  /** Plik legacy, który jest wzorcem treści tej strony; `null` = nowa strona bez wzorca. */
  source: string | null;
  /** Data ostatniej zmiany treści (ISO). */
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const UPDATED = "2026-09-22";

export const routes = [
  {
    path: "/",
    title: null,
    kind: "home",
    section: "home",
    legacy: ["index", "no-fuss-v1", "no-fuss-v2", "no-fuss-v3", "no-fuss-v4", "no-fuss-v5"],
    source: "no-fuss-v5",
    lastModified: UPDATED,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/o-nas",
    title: "O nas: Magda Nestorowicz i Kuba Fedoszczak",
    kind: "page",
    section: "about",
    legacy: ["o-nas-v1", "o-nas-v2", "o-nas-v3", "o-nas-v4", "o-nas-v5"],
    source: "o-nas-v5",
    lastModified: UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/ourmoney",
    title: "OurMoney: wspólny budżet dla par, case study",
    kind: "case",
    section: "work",
    legacy: ["case-ourmoney-v1", "case-ourmoney-v2"],
    source: "case-ourmoney-v2",
    lastModified: UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/aion-mind",
    title: "AION MIND: journaling z AI, case study",
    kind: "case",
    section: "work",
    legacy: ["case-aion-mind-v1"],
    source: "case-aion-mind-v1",
    lastModified: UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/busy-bee",
    title: "Busy Bee: strona domu produkcyjnego, case study",
    kind: "case",
    section: "work",
    legacy: ["case-busybee-v1", "case-busybee-v2", "case-busybee-v3"],
    source: "case-busybee-v3",
    lastModified: UPDATED,
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    path: "/automation-house",
    title: "Automation House: rebranding strony, case study",
    kind: "case",
    section: "work",
    legacy: ["case-automation-house-v1"],
    source: "case-automation-house-v1",
    lastModified: UPDATED,
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    path: "/otb",
    title: "OTB Ventures: strona funduszu VC, case study",
    kind: "case",
    section: "work",
    legacy: ["case-otb-v1", "case-otb-v2"],
    source: "case-otb-v2",
    lastModified: UPDATED,
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    path: "/sassy",
    title: "Sassy: warsztat interakcji, case study",
    kind: "case",
    section: "work",
    legacy: ["case-sassy-v1", "case-sassy-v2"],
    source: "case-sassy-v2",
    lastModified: UPDATED,
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    path: "/wiedza",
    title: "Wiedza: warsztaty, prelekcje i meetupy",
    kind: "page",
    section: "events",
    legacy: [],
    source: null,
    lastModified: "2026-09-25",
    changeFrequency: "weekly",
    priority: 0.6,
  },
] as const satisfies readonly SiteRoute[];

export type RoutePath = (typeof routes)[number]["path"];

/** Kolejność „Następny projekt” z legacy (pętla). */
export const caseOrder = [
  "/ourmoney",
  "/aion-mind",
  "/busy-bee",
  "/automation-house",
  "/otb",
  "/sassy",
] as const satisfies readonly RoutePath[];

export function getRoute(path: string): SiteRoute | undefined {
  return routes.find((r) => r.path === path);
}

/** Następny case study w pętli z legacy. */
export function getNextCase(path: RoutePath): RoutePath {
  const i = caseOrder.findIndex((p) => p === path);
  return caseOrder[(i + 1) % caseOrder.length] ?? caseOrder[0];
}

/** Sekcja nawigacji dla bieżącej ścieżki (nieznana ścieżka → `null`, np. 404). */
export function getNavSection(pathname: string): NavSection | null {
  return getRoute(pathname)?.section ?? null;
}
