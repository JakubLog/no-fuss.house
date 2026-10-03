import { FELLOWSHIP_STOPS, type FellowshipStop } from "@/content/fellowship";
import { NOFUSS_DAYS } from "./route";

/**
 * Tryb opowieści: zamiast płynnego przebiegu 184 dni mapa jedzie od przystanku do przystanku i na każdym
 * stoi tyle, ile trwa przeczytanie opisu (pasek pod opisem pokazuje, ile zostało). Czysta logika, bez DOM.
 */

export interface Beat {
  day: number;
  /** Indeks przystanku albo `null` dla puenty (dzień, w którym no-fuss jest na miejscu). */
  stop: number | null;
  /** Czas czytania na desktopie (opis + „U nas” obok mapy). */
  holdMs: number;
  /** Czas czytania na telefonie (w planszy widać tylko opis). */
  holdNarrowMs: number;
}

/** Czytanie: stała na złapanie wzroku + czas na znak, w widełkach. */
const HOLD_BASE_MS = 1200;
const HOLD_PER_CHAR_MS = 30;
const HOLD_MIN_MS = 2200;
const HOLD_MAX_MS = 6500;
const PUNCHLINE_HOLD_MS = 3200;

const hold = (chars: number) => Math.min(HOLD_MAX_MS, Math.max(HOLD_MIN_MS, HOLD_BASE_MS + chars * HOLD_PER_CHAR_MS));

export const PUNCHLINE_DAY = Math.round(NOFUSS_DAYS);

export const BEATS: readonly Beat[] = [
  ...FELLOWSHIP_STOPS.map((s: FellowshipStop, i) => ({
    day: s.day,
    stop: i,
    holdMs: hold(s.what.length + s.nofuss.length),
    holdNarrowMs: hold(s.what.length),
  })),
  { day: PUNCHLINE_DAY, stop: null, holdMs: PUNCHLINE_HOLD_MS, holdNarrowMs: PUNCHLINE_HOLD_MS },
].sort((a, b) => a.day - b.day);

/** Dni postoju (Drużyna stoi w miejscu) w przedziale [from, to]. */
function stayDays(from: number, to: number): number {
  return FELLOWSHIP_STOPS.reduce((sum, s: FellowshipStop) => {
    if (s.until === undefined) return sum;
    return sum + Math.max(0, Math.min(to, s.until) - Math.max(from, s.day));
  }, 0);
}

/** Przejazd między dniami: krótki, dni postoju liczą się kilka razy szybciej niż dni marszu. */
export function travelMs(from: number, to: number): number {
  const stay = stayDays(from, to);
  const march = Math.max(0, to - from - stay);
  return Math.min(1400, Math.max(450, 300 + march * 28 + stay * 6));
}

/** Takt, od którego rusza opowieść z danego dnia: postój na takcie albo przejazd do następnego. */
export function beatFrom(day: number): { beat: number; phase: "travel" | "hold" } {
  const exact = BEATS.findIndex((b) => Math.abs(b.day - day) < 0.5);
  if (exact >= 0) return { beat: exact, phase: "hold" };
  const next = BEATS.findIndex((b) => b.day > day);
  return next >= 0 ? { beat: next, phase: "travel" } : { beat: BEATS.length - 1, phase: "hold" };
}
