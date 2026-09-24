/**
 * Typy treści współdzielone przez strony i komponenty.
 *
 * Zasada placeholderów: treści w `[nawiasach]` to placeholdery przeniesione 1:1
 * z legacy HTML. Linki-placeholdery mają `href: null` (renderują się jako `#`
 * i nie trafiają do JSON-LD). Sprawdzaj przez `isPlaceholder()` z `site.ts`.
 */

/** Ścieżka wewnętrzna zaczynająca się od `/`. */
export type InternalPath = `/${string}`;

export type SocialNetwork =
  | "instagram"
  | "linkedin"
  | "behance"
  | "dribbble"
  | "github"
  | "x";

export interface SocialLink {
  network: SocialNetwork;
  /** Tekst widoczny w UI (1:1 z legacy, np. „[Instagram]” w stopce). */
  label: string;
  /** Pełny URL albo `null`, gdy link jest jeszcze placeholderem. */
  href: string | null;
}

export interface Person {
  /** Stabilny identyfikator (używany też w `@id` JSON-LD). */
  id: "magda" | "kuba";
  name: string;
  givenName: string;
  familyName: string;
  /** Rola w duecie, copy 1:1 z legacy („design i produkt”, „kod”). */
  role: string;
  /** `jobTitle` dla schema.org. */
  jobTitle: string;
  /** `knowsAbout` dla schema.org: rola z copy rozbita na dziedziny („design i produkt” → design, produkt). */
  knowsAbout: readonly string[];
  social: readonly SocialLink[];
}

export interface Product {
  name: string;
  /** Opis 1:1 z podpisu kafla na stronie głównej. */
  tagline: string;
  url: string;
}

export interface Service {
  /** Numer porządkowy jak w legacy: „01”, „02”… */
  no: string;
  name: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  /** Kafel limonkowy zamiast ciemnego. */
  accent?: boolean;
}

export interface CaseStudyFact {
  term: string;
  /** Tekst albo link zewnętrzny. */
  value: string;
  href?: string;
}

/**
 * Standardowe fakty hero case study (szablon `CaseStudyLayout` renderuje je w tej kolejności
 * przed `facts`): „Rola no-fuss”, „Zakres”, „Czas”, „Klient” (opcjonalnie), „Wynik” (opcjonalnie).
 * Tylko fakty z legacy / repo: bez danych pole zostaje puste i wiersz się nie renderuje.
 */
export interface CaseStudySummary {
  /** Co zrobiło no-fuss, uczciwie, z nazwiskami spoza studia (np. „Design: Magda; kod: …”). */
  role: string;
  /** Zakres prac, np. „Rebranding strony: od discovery do wdrożenia”. */
  scope: string;
  /** Data albo zakres dat z kickera legacy, np. „06.2025”, „01.2025 → teraz”. */
  time: string;
  /** Klient i branża, np. „OTB Ventures, fundusz VC, Amsterdam / Warszawa”. Brak = wiersz pominięty. */
  client?: string;
  /** Wynik tylko jako fakt (np. działająca strona). Bez liczb i ocen spoza danych. */
  result?: { value: string; href?: string };
}

/**
 * Krótka narracja case'u strony WWW (sekcja „W skrócie”): trzy wiersze `dl`.
 * `problemTerm`: „Problem” tylko, gdy problem wynika z danych; inaczej „Zadanie” (brief).
 */
export interface CaseStudyStory {
  problemTerm: "Problem" | "Zadanie";
  problem: string;
  /** „Co zrobiliśmy”. */
  done: string;
  /** „Efekt”: fakty (zakres, adres działającej strony), bez wymyślonych liczb. */
  effect: string;
}

export interface CaseStudyImage {
  /** Ścieżka w `public/`, np. `/assets/otb/d-00.webp`. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Czyj to projekt (JSON-LD `creator` na stronie głównej):
 * `own` – produkt / eksperyment no-fuss, `client` – zlecenie dla klienta,
 * `employment` – praca na etacie jednej z osób (twórcą jest pracodawca, patrz `employer`).
 */
export type CaseOwnership = "own" | "client" | "employment";

/** Pracodawca przy `ownership: "employment"` (węzeł `Organization` w JSON-LD). */
export interface CaseEmployer {
  name: string;
  /** Adres pracodawcy; `@id` organizacji = `${url}/#organization`. */
  url: string;
  /** Osoba z `people` zatrudniona u pracodawcy (`contributor` / `employee`). */
  employee: Person["id"];
}

export interface CaseStudy {
  /** Ścieżka route, np. `/otb`. Musi istnieć w `routes.ts`. */
  path: InternalPath;
  /** Nazwa w nagłówku mega, np. „OTB Ventures”. */
  title: string;
  /** Kategoria z chipa i kafla: „Aplikacja mobilna”, „Strona WWW”, „Eksperyment”. */
  kind: string;
  /** Tekst po chipie „Case study”, np. „Strona WWW · 06.2025”. */
  kicker: string;
  /** Lead w kroju statement (nie każdy case ma lead). */
  lead?: string;
  /** Podpis kafla na stronie głównej, np. „OTB Ventures”. */
  tileLabel: string;
  /** Rok / zakres lat z kafla, np. „2025”, „2025–2026”. */
  years: string;
  /** Czyj to projekt: własny, klienta czy etat (steruje `creator` w JSON-LD strony głównej). */
  ownership: CaseOwnership;
  /** Tylko przy `ownership: "employment"`: pracodawca. */
  employer?: CaseEmployer;
  /** Standardowe fakty hero (rola no-fuss, zakres, czas, klient, wynik). */
  summary: CaseStudySummary;
  /** Dodatkowe fakty hero po standardowych (platformy, sklepy, stack…). Bez powtórzeń `summary`. */
  facts: readonly CaseStudyFact[];
  /** Narracja „Zadanie/Problem → Co zrobiliśmy → Efekt” (case studies stron WWW). */
  story?: CaseStudyStory;
  /**
   * `<meta name="description">` case study (do 155 znaków): co zrobiło no-fuss i dla kogo.
   * Tytuł zostaje z `routes.ts`.
   */
  description: string;
  cover: CaseStudyImage;
  /** ISO 8601 (YYYY-MM lub YYYY-MM-DD) dla `CreativeWork.datePublished`. */
  datePublished?: string;
  /** Temat projektu dla `CreativeWork.about`. */
  about?: string;
  /** Route następnego case study (pętla z legacy). */
  next: InternalPath;
}

export interface FaqItem {
  question: string;
  answer: string;
}
