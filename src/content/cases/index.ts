import { caseOrder } from "../routes";
import { hasPlaceholder } from "../site";
import type { CaseStudy } from "../types";
import { aionMind } from "./aion-mind";
import { automationHouse } from "./automation-house";
import { busybee } from "./busybee";
import { otb } from "./otb";
import { ourmoney } from "./ourmoney";
import { sassy } from "./sassy";

/**
 * Indeks case studies. Dane bloków specyficznych dla strony (`*Live`, `*Spec`, obrazy…)
 * importuj z pliku case'u; tu tylko rekordy `CaseStudy`.
 */

/** Route case study (kolejność „Następny projekt” z `routes.ts`). */
export type CasePath = (typeof caseOrder)[number];

const byPath = {
  "/ourmoney": ourmoney,
  "/aion-mind": aionMind,
  "/busy-bee": busybee,
  "/automation-house": automationHouse,
  "/otb": otb,
  "/sassy": sassy,
} as const satisfies Record<CasePath, CaseStudy>;

/** Rekord case'u dla route (literalne typy zachowane, np. wymiary okładki). */
export type CaseRecord<P extends CasePath = CasePath> = (typeof byPath)[P];

/** Wszystkie case studies w kolejności `caseOrder`. */
export const cases: readonly CaseRecord[] = caseOrder.map((path) => byPath[path]);

function isCasePath(path: string): path is CasePath {
  return caseOrder.some((p) => p === path);
}

/** Case study dla ścieżki; nieznana ścieżka → `undefined`. */
export function getCase<P extends CasePath>(path: P): CaseRecord<P>;
export function getCase(path: string): CaseRecord | undefined;
export function getCase(path: string): CaseRecord | undefined {
  return isCasePath(path) ? byPath[path] : undefined;
}

/**
 * `<meta name="description">` case study (`CaseStudy.description`, do 155 znaków):
 * co zrobiło no-fuss i dla kogo. Tytuł zostaje z `routes.ts`.
 */
export function caseDescription(c: Pick<CaseStudy, "description">): string {
  return c.description;
}

/** Pozycja „W liczbach” (kształt `CaseNumber` z `CaseNumbers`). */
interface CaseNumberLike {
  value: number | string;
  label: string;
}

/** Minimalna liczba pozycji, przy której sekcja „W liczbach” ma sens (mniej → sekcji nie ma). */
export const MIN_CASE_NUMBERS = 2;

/**
 * Liczby gotowe do publikacji: bez placeholderów `[…]` w wartości i podpisie
 * (jak `publishedFaq()` / `publishedTestimonials()`). Dane z placeholderem zostają w pliku case'u.
 */
export function publishedNumbers<T extends CaseNumberLike>(items: readonly T[]): T[] {
  return items.filter((item) => !hasPlaceholder(String(item.value)) && !hasPlaceholder(item.label));
}

/**
 * Wiersze `SpecList` bez placeholdera `[…]` w wartości (np. „Kod” OTB: brak danych w legacy).
 * Wiersz znika razem z chipem; dane zostają w pliku case'u.
 */
export function publishedSpec<T extends { value: string }>(items: readonly T[]): T[] {
  return items.filter((item) => !hasPlaceholder(item.value));
}
