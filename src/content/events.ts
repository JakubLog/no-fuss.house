import { hasPlaceholder, people, site } from "./site";
import type { CaseStudyImage, Person } from "./types";

/**
 * Treść `/wiedza` (zakładka „Wiedza”): warsztaty, prelekcje i meetupy, na których Magda i Kuba przekazują
 * wiedzę dalej. Nowa strona, bez wzorca w legacy.
 *
 * Placeholdery `[…]` (dziś brak: wszystkie kafle to prawdziwe wydarzenia) są na `/wiedza` i w zajawce na `/` WIDOCZNE
 * (decyzja: układ do przeglądu przed podmianą; jedyny wyjątek od reguły z COMPONENTS.md →
 * Linki-placeholdery). Do JSON-LD i do zajawki na `/o-nas` trafiają tylko wydarzenia bez `[…]`
 * (`isPublishedEvent`).
 */

const NBSP = "\u00A0";
/** Word joiner: bez łamania wiersza po łączniku („AI-Native”); niewidoczny, JSON-LD go usuwa. */
const WJ = "\u2060";

/** Zapisy, nagranie, slajdy albo relacja. */
export interface EventLink {
  /** Tekst linku, np. „Zapisy”, „Nagranie”, „Slajdy”. */
  label: string;
  /** Pełny URL; `null` = link-placeholder (przygaszony, „wkrótce” dla czytników). */
  href: string | null;
}

export interface KnowledgeEvent {
  /** Slug: klucz, kotwica kafla (`/wiedza#<id>`) i `@id` wydarzenia w JSON-LD. */
  id: string;
  /** Temat wystąpienia albo warsztatu. */
  title: string;
  /** Format w tagu kafla: „Warsztat”, „Prelekcja”, „Meetup”, „Webinar”… */
  format: string;
  /**
   * Dzień `YYYY-MM-DD` (czas `site.timeZone`); u wielodniowych pierwszy dzień. Minione bez znanego dnia:
   * sam miesiąc `YYYY-MM` (kafel „06.2026”).
   */
  date: string;
  /** Ostatni dzień wielodniowego wydarzenia `YYYY-MM-DD`. Do końca tego dnia (albo `date`) kafel jest w nadchodzących. */
  endDate?: string;
  /** Godzina rozpoczęcia `HH:MM`. */
  time?: string;
  /** Wydarzenie albo organizator (konferencja, meetup, firma). Bez niego „Gdzie” bez nazwy, JSON-LD bez `organizer`. */
  host?: string;
  /** Miasto albo „Online”. Bez niego (i bez `online`) JSON-LD bez `location`. */
  place?: string;
  /** Obiekt w mieście, np. „PGE Narodowy” („Gdzie” na kaflu, `Place.name` w JSON-LD). */
  venue?: string;
  /** Wydarzenie online (JSON-LD: `VirtualLocation`, tryb online). */
  online?: boolean;
  /** Kto z no-fuss występuje. */
  people: readonly Person["id"][];
  /** Jedno, dwa zdania: o czym będzie (nadchodzące) albo co przekazaliśmy (minione). Bez niego kafel bez opisu. */
  text?: string;
  /** Nadchodzące: zapisy (przycisk). Minione: nagranie, slajdy, relacja (link; placeholder się nie renderuje). */
  link?: EventLink;
  /**
   * Logo wydarzenia albo organizatora, jasne na przezroczystym tle, bez własnego tła:
   * nadchodzące — prawy górny róg ciemnego kafla; minione — wprost na zdjęciu, lewy górny róg (7 px / 10 px).
   */
  logo?: Required<CaseStudyImage>;
  /** Zdjęcie z wydarzenia (kafel minionego). Bez niego `PhotoPlaceholder`. */
  photo?: Required<CaseStudyImage>;
  /** Wyróżnione: tylko takie trafiają do zajawki na `/` (`teaserEvents`). */
  featured?: boolean;
}

export const eventsHero = {
  lines: ["Przekazujemy", "wiedzę dalej"],
  lead: `Wiedzę i${NBSP}doświadczenie z${NBSP}projektów oddajemy dalej: na warsztatach, prelekcjach i${NBSP}meetupach. Tu jest to, co już było, i${NBSP}to, co przed nami.`,
} as const;

/** Opis strony (`<meta name="description">`, `CollectionPage`), do 155 znaków. */
export const eventsDescription =
  "Warsztaty, prelekcje i meetupy no-fuss: Magda Nestorowicz i Kuba Fedoszczak przekazują dalej wiedzę o designie, produkcie i kodzie.";

export const upcomingSection = {
  id: "nadchodzace",
  label: "Nadchodzące wydarzenia",
  /** Zamiast kafli, gdy nic nie jest zaplanowane. */
  empty: "Na razie nic nie planujemy.",
  /** Zdanie pod listą z linkiem do stopki `#kontakt`. */
  invite: { text: "Organizujesz wydarzenie?", link: "Zaproś nas" },
} as const;

export const pastSection = {
  id: "minione",
  label: "Minione wydarzenia",
} as const;

/** Zajawka zakładki na stronie głównej (`/#wiedza`, `KnowledgeTeaser`). */
export const knowledgeTeaser = {
  id: "wiedza",
  label: "Wiedza",
  title: "Przekazujemy wiedzę dalej",
  more: { label: "Zobacz wszystko", href: "/wiedza" },
  /** Ile kafli: najbliższe nadchodzące + najnowsze minione. */
  limit: 3,
} as const;

export interface TeaserEvent {
  event: KnowledgeEvent;
  variant: "upcoming" | "past";
}

/** Podpis placeholdera zdjęcia w kaflu minionego wydarzenia. */
export const eventPhotoLabel = "Zdjęcie z wydarzenia 16:10";

/** Wydarzenia w dowolnej kolejności; stronę sortuje `splitEvents`. */
export const events: readonly KnowledgeEvent[] = [
  {
    id: "infoshare-katowice-2026",
    featured: true,
    title: "Twoim następnym użytkownikiem nie jest człowiek.",
    format: "Prelekcja",
    date: "2026-11-17",
    endDate: "2026-11-18",
    host: "Infoshare Katowice",
    place: "Katowice",
    people: ["kuba"],
    text: `Scena AI${NBSP}&${NBSP}Architecture.`,
    link: { label: "Bilety", href: "https://katowice.infoshare.pl/" },
    logo: {
      src: "/assets/events/infoshare-katowice-logo.webp",
      width: 552,
      height: 178,
      alt: "Infoshare Katowice",
    },
  },
  {
    id: "data-science-summit-2026",
    title: `Czy no/${WJ}low-${WJ}code automatyzacja jaką znamy, jeszcze ma sens w${NBSP}czasach AI?`,
    format: "Prelekcja",
    date: "2026-11-27",
    time: "17:25",
    host: "Data Science Summit",
    place: "Warszawa",
    venue: "PGE Narodowy",
    people: ["kuba"],
    text: `Ścieżka AI Agents: kiedy n8n i${NBSP}Make.com, a${NBSP}kiedy kod pisany z${NBSP}AI. Koszt utrzymania, vendor lock-in i${NBSP}podejście hybrydowe.`,
    link: { label: "Bilety", href: "https://main.dssconf.pl/" },
    logo: { src: "/assets/events/data-science-summit-logo.webp", width: 860, height: 316, alt: "Data Science Summit" },
  },
  {
    id: "22-community-2026-06",
    featured: true,
    title: `Realia wdrażania AI w${NBSP}firmie`,
    format: `Warsztaty i${NBSP}dyskusja`,
    date: "2026-06",
    host: "22 Community",
    place: "Warszawa",
    people: ["magda", "kuba"],
    text: `Rozmawialiśmy z${NBSP}właścicielami firm o${NBSP}technicznej stronie automatyzacji, wyborze narzędzi AI pod konkretne procesy i${NBSP}budowaniu agentów.`,
    photo: {
      src: "/assets/events/22-community-2026-06.webp",
      width: 1600,
      height: 1067,
      alt: `Kuba przy stole z${NBSP}uczestnikami 22 Community, przed nimi tabliczka „Wdrożenia AI”`,
    },
    logo: { src: "/assets/events/22-community-logo.svg", width: 112, height: 20, alt: "22 Community" },
  },
  {
    id: "infoshare-2026",
    featured: true,
    title: `Gen Z: Pierwsze pokolenie AI-${WJ}Native Workers`,
    format: "Prelekcja",
    date: "2026-05-21",
    time: "13:45",
    host: "Infoshare",
    place: "Gdańsk",
    people: ["kuba"],
    text: `Na scenie Tech Trends o${NBSP}pokoleniu, które nie pamięta pracy bez AI: jak Gen Z buduje karierę, gdy firmy szukają doświadczenia, i${NBSP}jak z${NBSP}nim pracować.`,
    link: {
      label: "Nagranie",
      href: "https://infoshare.pl/speeches/gen-z-pierwsze-pokolenie-native-ai-workers-o3267gc219-one.html",
    },
    photo: {
      src: "/assets/events/infoshare-2026.webp",
      width: 1600,
      height: 1000,
      alt: `Kuba na scenie Tech Trends Infoshare 2026, przed nim widownia, obok slajd „Jesteśmy »inni«?”`,
    },
    logo: { src: "/assets/events/infoshare-logo.svg", width: 1084, height: 200, alt: "Infoshare" },
  },
  {
    id: "polska-with-ai-2026-09",
    title: `Polska With AI${NBSP}– Czyli jak sektor publiczny odstaje względem prywatnego`,
    format: "Prelekcja",
    date: "2026-09",
    people: ["kuba"],
    /* Źródło: miniatura 150×150 z Instagrama, powiększona 4× (Real-ESRGAN x4plus); do podmiany na oryginał. */
    photo: {
      src: "/assets/events/polska-with-ai-2026-09-upscaled.webp",
      width: 600,
      height: 600,
      alt: "Kuba z mikrofonem na scenie",
    },
  },
];

const ISO_DAY = new Intl.DateTimeFormat("sv-SE", {
  timeZone: site.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Dzisiejsza data `YYYY-MM-DD` w strefie `site.timeZone` (Europe/Warsaw), nie serwera. */
export function todayIso(now: Date = new Date()): string {
  return ISO_DAY.format(now);
}

/** Ostatni dzień wydarzenia: `endDate` wielodniowego albo `date`. */
const lastDay = (e: KnowledgeEvent): string => e.endDate ?? e.date;

/**
 * Nadchodzące (ostatni dzień od `today` włącznie, najbliższe pierwsze) i minione (najnowsze pierwsze).
 * Daty `YYYY-MM-DD` porównujemy jako tekst.
 */
export function splitEvents(
  list: readonly KnowledgeEvent[],
  today: string,
): { upcoming: KnowledgeEvent[]; past: KnowledgeEvent[] } {
  const upcoming = list
    .filter((e) => lastDay(e) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""));
  const past = list.filter((e) => lastDay(e) < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

/**
 * Kafle zajawki na `/` spośród wyróżnionych (`featured`): najbliższe nadchodzące, potem najnowsze minione, razem
 * do `limit`. Gdy minionych brakuje, dopełniają dalsze nadchodzące. Bez wyróżnionych pusta lista (sekcji nie ma).
 */
export function teaserEvents(list: readonly KnowledgeEvent[], today: string, limit: number): TeaserEvent[] {
  const { upcoming, past } = splitEvents(list.filter((e) => e.featured), today);
  const [next, ...later] = upcoming;
  return [
    ...(next ? [{ event: next, variant: "upcoming" as const }] : []),
    ...past.map((event) => ({ event, variant: "past" as const })),
    ...later.map((event) => ({ event, variant: "upcoming" as const })),
  ].slice(0, limit);
}

/** Wydarzenie bez placeholderów `[…]` w treści: tylko takie trafiają do JSON-LD i na `/o-nas`. */
export function isPublishedEvent(e: KnowledgeEvent): boolean {
  return ![e.title, e.format, e.host, e.place, e.text].some((v) => v !== undefined && hasPlaceholder(v));
}

const WEEKDAY = new Intl.DateTimeFormat("pl-PL", { weekday: "short", timeZone: "UTC" });

export interface EventDate {
  /** „14.11”; wielodniowe „17–18.11” albo „30.11–01.12” */
  day: string;
  /** „2026”; na przełomie lat „2026–2027” */
  year: string;
  /** „pt”, „wt–śr” (UI wersalikami przez mono) */
  weekday: string;
  /** „14.11.2026”, „17–18.11.2026”; sam miesiąc „06.2026” (wtedy też `day`, a `weekday` pusty) */
  label: string;
  /** `dateTime` dla `<time>` i `startDate` w JSON-LD: `2026-11-14`, `2026-11-14T18:00` albo `2026-06`. */
  iso: string;
  /** `endDate` w JSON-LD, tylko wielodniowe: `2026-11-18`. */
  endIso?: string;
}

function dayParts(date: string) {
  const [year, month, day] = date.split("-");
  const weekday = WEEKDAY.format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))));
  return { year, dm: `${day}.${month}`, day, month, weekday: weekday.replace(/\.$/, "") };
}

export function eventDate(e: KnowledgeEvent): EventDate {
  const [year, month, dayOfMonth] = e.date.split("-");
  /* Sam miesiąc (minione bez znanego dnia): „06.2026”, `dateTime` / `startDate` „2026-06”. */
  if (!dayOfMonth) {
    const label = `${month}.${year}`;
    return { day: label, year, weekday: "", label, iso: e.date };
  }
  const start = dayParts(e.date);
  const iso = e.time ? `${e.date}T${e.time}` : e.date;
  if (!e.endDate || e.endDate === e.date) {
    return { day: start.dm, year: start.year, weekday: start.weekday, label: `${start.dm}.${start.year}`, iso };
  }
  const end = dayParts(e.endDate);
  const sameYear = start.year === end.year;
  const day = sameYear && start.month === end.month ? `${start.day}–${end.dm}` : `${start.dm}–${end.dm}`;
  return {
    day,
    year: sameYear ? start.year : `${start.year}–${end.year}`,
    weekday: `${start.weekday}–${end.weekday}`,
    label: sameYear ? `${day}.${end.year}` : `${start.dm}.${start.year}–${end.dm}.${end.year}`,
    iso,
    endIso: e.endDate,
  };
}

/** „Magda”, „Magda i${NBSP}Kuba” (kolejność z `people`). */
export function eventPeople(e: KnowledgeEvent): string {
  const names = people.filter((p) => e.people.includes(p.id)).map((p) => p.givenName);
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} i${NBSP}${names.at(-1)}` : (names[0] ?? "");
}
