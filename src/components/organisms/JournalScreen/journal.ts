/**
 * Dane Dziennika AION MIND 1:1 z legacy (`case-aion-mind-v1.html`): 5 tygodni
 * od pon. 27.04.2026, maj 2026. Czysta arytmetyka dat (bez `Date` lokalnego i `toLocale*`),
 * więc serwer i przeglądarka renderują to samo niezależnie od strefy czasowej.
 */

export interface JournalDay {
  /** Klucz „m-d” jak w legacy, np. „5-30”. */
  key: string;
  year: number;
  /** 1–12 */
  month: number;
  day: number;
  /** Dzień spoza maja (przygaszony). */
  out: boolean;
  /** Dzień z wpisem (niebieskie tło). */
  has: boolean;
  /** Tydzień zamknięty podsumowaniem (✓). */
  done: boolean;
  /** Podsumowanie czeka (obrys). */
  wait: boolean;
}

const HAS = new Set([
  "4-29", "5-1", "5-2", "5-4", "5-5", "5-6", "5-7", "5-13", "5-14", "5-15",
  "5-19", "5-20", "5-21", "5-23", "5-27", "5-28", "5-29", "5-30",
]);
const DONE = new Set(["5-3", "5-10", "5-17"]);
const WAIT = new Set(["5-24", "5-31"]);

/** Dopełniacz miesięcy (aria-label dnia jak `toLocaleDateString("pl-PL", { day, month: "long" })`). */
const MONTHS_GENITIVE = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
] as const;

export const WEEKDAYS = [
  { short: "PN", long: "poniedziałek" },
  { short: "WT", long: "wtorek" },
  { short: "ŚR", long: "środa" },
  { short: "CZ", long: "czwartek" },
  { short: "PT", long: "piątek" },
  { short: "SB", long: "sobota" },
  { short: "ND", long: "niedziela" },
] as const;

function buildDays(): JournalDay[] {
  const days: JournalDay[] = [];
  const start = Date.UTC(2026, 3, 27); // pon. 27.04.2026
  for (let i = 0; i < 35; i++) {
    const d = new Date(start + i * 864e5);
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const key = `${month}-${day}`;
    days.push({
      key,
      year: d.getUTCFullYear(),
      month,
      day,
      out: month !== 5,
      has: HAS.has(key),
      done: DONE.has(key),
      wait: WAIT.has(key),
    });
  }
  return days;
}

export const JOURNAL_DAYS: readonly JournalDay[] = buildDays();

/** Domyślnie zaznaczony dzień (legacy: 30 maja). */
export const JOURNAL_INITIAL_INDEX = JOURNAL_DAYS.findIndex((d) => d.key === "5-30");

export function dayLabel(d: JournalDay): string {
  return `${d.day} ${MONTHS_GENITIVE[d.month - 1]}`;
}

/** Numer tygodnia ISO 8601 (jak w legacy). */
export function isoWeek(d: JournalDay): number {
  const t = new Date(Date.UTC(d.year, d.month - 1, d.day));
  const weekday = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  return Math.ceil(((t.getTime() - yearStart) / 864e5 + 1) / 7);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Tydzień zaznaczonego dnia: „Tydzień 22” i „25.05–31.05.2026”.
 * Wiersze siatki to tygodnie pon.–nd., więc poniedziałek = początek wiersza.
 */
export function weekOf(index: number): { title: string; range: string } {
  const monday = JOURNAL_DAYS[index - (index % 7)];
  const sunday = JOURNAL_DAYS[index - (index % 7) + 6];
  const selected = JOURNAL_DAYS[index];
  return {
    title: `Tydzień ${isoWeek(selected)}`,
    range: `${pad(monday.day)}.${pad(monday.month)}–${pad(sunday.day)}.${pad(sunday.month)}.${sunday.year}`,
  };
}
