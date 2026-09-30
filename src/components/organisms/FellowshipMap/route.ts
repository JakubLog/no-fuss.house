import { FELLOWSHIP_ROUTE, FELLOWSHIP_STOPS, type FellowshipStop } from "@/content/fellowship";

/**
 * Geometria i czas trasy (czysta matematyka, bez DOM): długości odcinków liczone analitycznie,
 * więc serwer i klient dostają te same wartości, a animacja nie mierzy ścieżek w przeglądarce.
 */

export interface Point {
  x: number;
  y: number;
}

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Plansza: `viewBox` 800 × 560 obejmuje mile od (-230, -150) do (1110, ~788) względem Hobbitonu:
 * od Gór Błękitnych po wschodni Mordor.
 */
export const VIEW_W = 800;
export const VIEW_H = 560;
const ORIGIN = { x: -230, y: -150 };
const SCALE = VIEW_W / 1340;

/** Mile od Hobbitonu → jednostki `viewBox` (skala jednolita, więc proporcje odległości zostają). */
export function project(p: Point): Point {
  return { x: (p.x - ORIGIN.x) * SCALE, y: (p.y - ORIGIN.y) * SCALE };
}

const POINTS: readonly Point[] = FELLOWSHIP_ROUTE.map((p) => project("stop" in p ? p.stop : p.via));

/** Długość trasy od startu do każdego punktu `FELLOWSHIP_ROUTE`. */
const CUMULATIVE: readonly number[] = POINTS.reduce<number[]>(
  (acc, p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dist(POINTS[i - 1], p)],
  [],
);

export const ROUTE_LENGTH = CUMULATIVE[CUMULATIVE.length - 1];
export const TOTAL_DAYS = FELLOWSHIP_STOPS[FELLOWSHIP_STOPS.length - 1].day;

/** Klatki kluczowe (dzień → przebyta długość): przystanek z `until` daje dwie, bo Drużyna stoi w miejscu. */
const KEYFRAMES: readonly { day: number; length: number }[] = FELLOWSHIP_ROUTE.flatMap((p, i) => {
  if (!("stop" in p)) return [];
  const length = CUMULATIVE[i];
  const s: FellowshipStop = p.stop;
  return s.until === undefined
    ? [{ day: s.day, length }]
    : [
        { day: s.day, length },
        { day: s.until, length },
      ];
});

/** Dni w marszu: wszystkie minus postoje (Rivendell, Lórien, Henneth Annûn…). */
const MARCHING_DAYS =
  TOTAL_DAYS - FELLOWSHIP_STOPS.reduce((sum, s: FellowshipStop) => sum + ((s.until ?? s.day) - s.day), 0);

export const START: Point = POINTS[0];
export const FINISH: Point = POINTS[POINTS.length - 1];

/**
 * Dzień, w którym no-fuss byłoby na miejscu: linia prosta Hobbiton → Góra Przeznaczenia
 * w średnim tempie marszu Drużyny (bez postojów), na tej samej mapie.
 */
export const NOFUSS_DAYS = (dist(START, FINISH) / ROUTE_LENGTH) * MARCHING_DAYS;

/** Ile trasy Drużyna ma za sobą w danym dniu (interpolacja między klatkami). */
export function lengthAtDay(day: number): number {
  if (day <= 0) return 0;
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const a = KEYFRAMES[i - 1];
    const b = KEYFRAMES[i];
    if (day <= b.day) {
      const t = b.day === a.day ? 1 : (day - a.day) / (b.day - a.day);
      return a.length + (b.length - a.length) * t;
    }
  }
  return ROUTE_LENGTH;
}

/** Punkty trasy od startu do przebytej długości `length` (ostatni interpolowany). */
export function routeUpTo(length: number): Point[] {
  const out: Point[] = [POINTS[0]];
  for (let i = 1; i < POINTS.length; i++) {
    if (CUMULATIVE[i] <= length) {
      out.push(POINTS[i]);
      continue;
    }
    const a = POINTS[i - 1];
    const b = POINTS[i];
    const t = (length - CUMULATIVE[i - 1]) / (CUMULATIVE[i] - CUMULATIVE[i - 1]);
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    break;
  }
  return out;
}

/** Pozycja no-fuss na prostej w danym dniu. */
export function nofussAt(day: number): Point {
  const t = Math.min(1, Math.max(0, day / NOFUSS_DAYS));
  return { x: START.x + (FINISH.x - START.x) * t, y: START.y + (FINISH.y - START.y) * t };
}

/** Ścieżka SVG z listy punktów. */
export function toPath(points: readonly Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
}

export const FULL_ROUTE_PATH = toPath(POINTS);

/** Indeks ostatniego przystanku, do którego Drużyna doszła w danym dniu. */
export function stopIndexAt(day: number): number {
  let index = 0;
  FELLOWSHIP_STOPS.forEach((s, i) => {
    if (s.day <= day) index = i;
  });
  return index;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Data w kalendarzu Shire'u: miesiące po 30 dni, rok kończy 1. dzień Julu, zaczyna 2. dzień Julu.
 * Dzień 0 = 23.09.3018, dzień 97 = 30.12.3018, 98–99 = Jul, dzień 100 = 01.01.3019.
 */
export function shireDate(day: number): string {
  const d = Math.floor(day);
  if (d <= 97) {
    const t = d + 22;
    return `${pad((t % 30) + 1)}.${pad(9 + Math.floor(t / 30))}.3018`;
  }
  if (d === 98) return "Jul 3018";
  if (d === 99) return "Jul 3019";
  const t = d - 100;
  return `${pad((t % 30) + 1)}.${pad(1 + Math.floor(t / 30))}.3019`;
}
