import { getCase, type CasePath } from "./cases";
import type { RoutePath } from "./routes";
import { isPlaceholder } from "./site";
import type { CaseStudyImage, Service, Testimonial } from "./types";

/**
 * Treść strony głównej. Copy 1:1 z `legacy/no-fuss-v5.html`
 * (`#o-nas`, `#realizacje`, `#uslugi`, `#opinie`). Twarde spacje (`&nbsp;` w legacy)
 * zapisane jako ` `. Placeholdery `[…]` zostają placeholderami.
 */

const NBSP = "\u00A0";

/* ---------- #hero ---------- */

/** Treść hero poza h1 (reszta copy w `HomeHero`). Zmiana wobec legacy pod klientów usługowych (audyt B2B, decyzja Kuby). */
export const hero = {
  /** Nowe copy (spoza legacy): dla kogo i co, zdanie pod h1. */
  lead: `Aplikacje mobilne, strony i${NBSP}produkty z${NBSP}AI dla firm, które chcą wydać produkt, a${NBSP}nie zarządzać agencją.`,
} as const;

/* ---------- #o-nas ---------- */

export const about = {
  /** Etykieta sekcji dla czytników (legacy nie ma nagłówka w tej sekcji). */
  heading: "O nas",
  /**
   * Pierwszy statement, linia po linii (reveal ze staggerem). Podział pod `max-width: 22ch`: przy dwóch liniach
   * „produkty,” spadało samo do nowej linii. „Zamieszanie” zostaje w h1 i stopce.
   */
  statementLines: ["Projektujemy i kodujemy", "produkty, które", "załatwiają sprawę."],
  aboutLink: { label: "Poznaj nas", href: "/o-nas" },
  ourMoneyLink: { label: "OurMoney", href: "https://ourmoney.pl" },
  clientsLabel: "Współpracujemy / Współpracowaliśmy z",
} as const;

/* ---------- #realizacje ---------- */

/**
 * Rozmiar kafla w siatce 12 kolumn (od 768 px), 1:1 z legacy:
 * `xl` = 8 kolumn do prawej, `l` = 5 (dwa `l` z rzędu → 1–5 i 7–11),
 * `m` = 3 od kolumny 6 (drugi `m` → 10–12), `s` = 3 (z `offset`: od 5 lub 9).
 */
/** Obraz z wymiarami (wymagane przez `next/image` bez `fill`; realne wymiary plików). */
export type SizedImage = CaseStudyImage & { width: number; height: number };

export type WorkTileSize = "xl" | "l" | "m" | "s";

export interface WorkTile {
  /** Route case study. */
  href: RoutePath;
  /** Podpis kafla (lewa strona wiersza mono), 1:1 z legacy. */
  title: string;
  /** Nazwa projektu = `CaseStudy.title` (JSON-LD `CreativeWork.name`, ten sam `@id` co na stronie case). */
  name: string;
  /** Rok albo zakres lat, np. „2025–2026”. */
  years: string;
  /** Tag w rogu: „Aplikacja mobilna”, „Strona WWW”, „Eksperyment”. */
  kind: string;
  /**
   * Okładka. Dla kafla z `screens` służy jako opis (`aria-label`) i obraz w JSON-LD,
   * a na stronie renderują się telefony.
   */
  cover: SizedImage;
  /** Okładka z trzema ekranami w mockupach iPhone’a na limonce (legacy `.cover`, OurMoney). */
  screens?: readonly [SizedImage, SizedImage, SizedImage];
  size: WorkTileSize;
  /** Offset kafla `s` w trójkach (legacy `.off` / `.off2`). */
  offset?: 1 | 2;
  /** Proporcja 1:1 zamiast 16:10 (legacy `.tile--sq`). */
  square?: boolean;
}

/**
 * Kafel wyprowadzony z `CaseStudy` (`tileLabel`, `years`, `kind`, `title`, `cover`),
 * tu zostaje tylko to, co dotyczy siatki: rozmiar, offset, proporcja, ekrany.
 * `cover` nadpisuje okładkę case'u, gdy kafel ma w legacy inny `alt`.
 */
type TileLayout = Pick<WorkTile, "size" | "offset" | "square" | "screens"> & { cover?: SizedImage };

function tileFor(href: CasePath, layout: TileLayout): WorkTile {
  const c = getCase(href);
  const { cover, ...rest } = layout;
  return {
    href,
    title: c.tileLabel,
    name: c.title,
    years: c.years,
    kind: c.kind,
    cover: cover ?? c.cover,
    ...rest,
  };
}

export const work = {
  label: "Produkty i realizacje",
  /** Licznik obok etykiety (legacy: „[01]–[06]”, bez nawiasów jak w usługach). */
  counter: "01–06",
  /** Kolejność kafli z legacy (inna niż pętla „Następny projekt”), Sassy przeniesiony na koniec. */
  tiles: [
    tileFor("/ourmoney", {
      /* Kafel ma w legacy inny opis niż okładka case'u (grafika OG). */
      cover: {
        src: "/assets/ourmoney/og-image.png",
        alt: "OurMoney: trzy ekrany aplikacji",
        width: 1200,
        height: 630,
      },
      screens: [
        { src: "/assets/ourmoney/koperty.png", alt: "", width: 388, height: 895 },
        { src: "/assets/ourmoney/ekran-glowny-rownowaga.webp", alt: "", width: 415, height: 903 },
        { src: "/assets/ourmoney/wspolne-cele-finansowe.webp", alt: "", width: 413, height: 901 },
      ],
      size: "xl",
    }),
    /* AION MIND: etat Magdy, nie produkt no-fuss; podpis kafla z `tileLabel` w `cases/aion-mind.ts`. */
    tileFor("/aion-mind", { size: "l" }),
    tileFor("/busy-bee", { size: "l" }),
    /* Sassy (tag „Eksperyment” z case'u) na końcu: projekt własny, nie realizacja dla klienta.
       Zmiana wobec legacy (tam para m + m z OTB, a Automation House jako ostatni `l`). */
    tileFor("/otb", { size: "m" }),
    tileFor("/automation-house", { size: "m" }),
    tileFor("/sassy", { size: "s" }),
  ] satisfies readonly WorkTile[] as readonly WorkTile[],
};

/* ---------- #uslugi ---------- */

export const servicesSection = {
  label: "Co robimy",
  items: [
    {
      no: "01",
      name: "Aplikacje mobilne",
      description: `Od pierwszego ekranu do sklepów. Projekt, kod, wydanie i${NBSP}to, co po nim: metryki, retencja, kolejne wersje.`,
    },
    {
      no: "02",
      name: `Produkty z${NBSP}AI`,
      description: `Agenci AI, automatyzacje. Projektujemy tak, żeby LLM pracował w${NBSP}tle, a${NBSP}użytkownik czuł tylko efekt.`,
    },
    {
      no: "03",
      name: `Strony i${NBSP}landingi`,
      description: `Szybkie, dostępne i${NBSP}zgodne z${NBSP}WCAG. Next.js, CMS do samodzielnej edycji, integracje z${NBSP}tym, co już macie.`,
    },
    {
      no: "04",
      name: "Design produktu",
      description: `Research, flow, prototyp, system wizualny. Decyzje z${NBSP}danych, nie z${NBSP}głowy. Bez slajdów, za to z${NBSP}działającym prototypem.`,
    },
    {
      no: "05",
      name: `Audyt i${NBSP}porządki`,
      description: `Przeglądamy istniejący produkt: UX, dostępność, konwersja, kod. Wychodzicie z${NBSP}listą priorytetów, nie z${NBSP}raportem na 80${NBSP}stron.`,
    },
  ] satisfies readonly Service[] as readonly Service[],
};

/* ---------- #opinie ---------- */

/**
 * Opinie. Sekcja renderuje się tylko z prawdziwymi opiniami: placeholdery (`[…]` w cytacie,
 * `isPlaceholder`) są odfiltrowywane, a bez żadnej prawdziwej sekcji nie ma (także w nawigacji).
 */
export const testimonialsSection = {
  label: "Co mówią klienci",
  items: [
    {
      quote: "[PLACEHOLDER: opinia klienta, 2–3 zdania. Najlepiej konkret: co zrobiliśmy i co to dało.]",
      author: "[Imię i nazwisko]",
      role: "[Rola, firma]",
    },
    {
      quote: "[PLACEHOLDER: krótka opinia, jedno mocne zdanie.]",
      author: "[Imię i nazwisko]",
      role: "[Rola, firma]",
      accent: true,
    },
    {
      quote: "[PLACEHOLDER: opinia klienta, 2–3 zdania.]",
      author: "[Imię i nazwisko]",
      role: "[Rola, firma]",
    },
  ] satisfies readonly Testimonial[] as readonly Testimonial[],
};

/**
 * Opinie gotowe do publikacji: cytat, autor i rola bez placeholderów `[…]`.
 * Pusta tablica → `TestimonialsSection` się nie renderuje, JSON-LD nie ma `Review`.
 */
export function publishedTestimonials(): readonly Testimonial[] {
  return testimonialsSection.items.filter(
    (t) => !isPlaceholder(t.quote) && !isPlaceholder(t.author) && !isPlaceholder(t.role),
  );
}
