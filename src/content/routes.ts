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

/** Sekcja nawigacji, do której należy route (steruje `aria-current` w HUD). `legal`: bez pozycji w menu (linki w stopce). */
export type NavSection = "home" | "about" | "work" | "events" | "legal";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface SiteRoute {
  path: InternalPath;
  /**
   * Tytuł strony BEZ sufiksu (sufiks „ — NO-FUSS©2026” dokleja template w layout).
   * Copy 1:1 z `<title>` legacy. `null` = strona główna (`site.homeTitle`).
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
    title: "O NAS",
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
    title: "OURMONEY — CASE STUDY",
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
    title: "AION MIND — CASE STUDY",
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
    title: "BUSY BEE — CASE STUDY",
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
    title: "AUTOMATION HOUSE — CASE STUDY",
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
    title: "OTB VENTURES — CASE STUDY",
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
    title: "SASSY — CASE STUDY",
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
    title: "WIEDZA",
    kind: "page",
    section: "events",
    legacy: [],
    source: null,
    lastModified: "2026-09-25",
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    path: "/regulamin",
    title: "REGULAMIN",
    kind: "page",
    section: "legal",
    legacy: [],
    source: null,
    lastModified: "2026-09-30",
    changeFrequency: "yearly",
    priority: 0.2,
  },
  {
    path: "/polityka-prywatnosci",
    title: "POLITYKA PRYWATNOŚCI",
    kind: "page",
    section: "legal",
    legacy: [],
    source: null,
    lastModified: "2026-09-30",
    changeFrequency: "yearly",
    priority: 0.2,
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
