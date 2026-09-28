import { eventDate, events, isPublishedEvent, splitEvents } from "./events";
import { hasPlaceholder } from "./site";
import type { InternalPath, Person } from "./types";

/**
 * Treść podstrony `/o-nas`, copy 1:1 z `legacy/o-nas-v5.html`.
 * Imiona, nazwiska i linki social osób są w `site.ts` (`people`); tu tylko to,
 * czego tam nie ma. Placeholdery `[…]` zostają w danych, ale się nie renderują
 * (`publishedFacts()`, `publishedLinkedinPosts()`); linki-placeholdery mają `href: null`.
 */

/** Link wewnętrzny w treści (np. „Buduje: OurMoney”). */
export interface AboutInternalLink {
  label: string;
  href: InternalPath;
}

/** Link zewnętrzny albo placeholder (`href: null` → `#`). */
export interface AboutExternalLink {
  label: string;
  href: string | null;
}

/** Wartość wiersza w karcie postaci. */
export type AboutFactValue =
  | { kind: "text"; text: string }
  | { kind: "links"; links: readonly AboutInternalLink[] }
  | { kind: "meter"; /** Wypełnienie paska 0–1 (legacy `--v`). */ value: number; label: string };

export interface AboutFact {
  term: string;
  value: AboutFactValue;
}

/** Zdjęcie z `public/` dla `next/image` (wymiary źródła, nie wyświetlane). */
export interface AboutPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  /**
   * `object-position` twarzy w każdym kadrze (karta, „Oklej nas”, `#o-nas` na `/`). Źródło jest 1:1, więc
   * `x` przesuwa tylko kadry 3:4 (widać 75% szerokości), `y` tylko kadr 4:3 karty od 1200 px (75% wysokości).
   */
  focus: string;
}

export interface AboutCard {
  /** Numer z chipa w nagłówku karty: „P1”… */
  code: string;
  /** Podpis placeholdera zdjęcia (1:1 z legacy). */
  photoLabel: string;
  /** Prawdziwe zdjęcie; bez niego karta pokazuje placeholder z `photoLabel`. */
  photo?: AboutPhoto;
  roles: readonly string[];
  bio: string;
  facts: readonly AboutFact[];
}

const NBSP = " ";

/** Usuwa fragmenty `[…]` z tekstu razem z przecinkiem / kropką / spacjami wokół. */
function stripPlaceholders(text: string): string {
  return text.replace(/\s*[,·]?\s*\[[^\]]*\]/g, "").replace(/^[\s,·]+|[\s,·]+$/g, "");
}

/**
 * Wiersze karty postaci gotowe do publikacji: tekst bez placeholderów `[…]`
 * („Claude Code, [placeholder]” → „Claude Code”); wiersz z samym placeholderem znika.
 */
export function publishedFacts(facts: readonly AboutFact[]): AboutFact[] {
  return facts.flatMap((fact): AboutFact[] => {
    if (fact.value.kind !== "text" || !hasPlaceholder(fact.value.text)) return [fact];
    const text = stripPlaceholders(fact.value.text);
    return text ? [{ ...fact, value: { kind: "text", text } }] : [];
  });
}

/** Wskaźnik „Zamieszanie 0%” (identyczny na wszystkich kartach). */
const FUSS_METER: AboutFact = { term: "Zamieszanie", value: { kind: "meter", value: 0.02, label: "0%" } };

export const aboutHero = {
  lines: ["Dwie osoby,", "agenci AI,", "zero zamieszania"],
  lead: `Magda projektuje i${NBSP}prowadzi produkt. Kuba pisze kod i${NBSP}pilnuje, żeby działał. Agenci AI pracują z${NBSP}nami ramię w${NBSP}ramię. Jesteśmy AI native.`,
} as const;

/**
 * Karty osób, kluczowane `Person["id"]` z `site.ts`. Zdjęcia: źródła 1254×1254 (1:1, AVIF) w
 * `public/assets/team/`; karta i „Oklej nas” przycinają je `object-fit: cover`. Podmiana zdjęcia =
 * nowa nazwa pliku (`-v2`…): `/_next/image` i CDN trzymają stary wariant pod tym samym `src`.
 */
export const personCards: Record<Person["id"], AboutCard> = {
  magda: {
    code: "P1",
    photoLabel: "Zdjęcie Magdy 3:4",
    /* Twarz na ~33% szerokości źródła: x 0% daje ją na ~44% kadru 3:4 (bliżej się nie da bez ucinania głowy). */
    photo: {
      src: "/assets/team/magda.avif",
      width: 1254,
      height: 1254,
      alt: "Magda Nestorowicz",
      focus: "0% 10%",
    },
    roles: ["Design", "Produkt"],
    /* AION MIND to etat Magdy, nie produkt no-fuss (decyzja Kuby); daty z case'u AION MIND. */
    bio: `Product Designerka. Buduje OurMoney razem z${NBSP}Kubą. Na etacie w${NBSP}AION MIND od pierwszego ekranu doszła do prowadzenia całego produktu: od czerwca 2026 jest Head of Operations.`,
    facts: [
      { term: "Buduje", value: { kind: "links", links: [{ label: "OurMoney", href: "/ourmoney" }] } },
      { term: "Etat", value: { kind: "links", links: [{ label: "AION MIND", href: "/aion-mind" }] } },
      { term: "Supermoc", value: { kind: "text", text: "[placeholder: jedno zdanie]" } },
      { term: "Narzędzia", value: { kind: "text", text: "[placeholder]" } },
      { term: "Po godzinach", value: { kind: "text", text: "[placeholder]" } },
      FUSS_METER,
    ],
  },
  kuba: {
    code: "P2",
    photoLabel: "Zdjęcie Kuby 3:4",
    photo: {
      src: "/assets/team/kuba-v2.avif",
      width: 1254,
      height: 1254,
      alt: "Kuba Fedoszczak",
      focus: "50% 20%",
    },
    roles: ["Architektura", "Procesy", "Oprogramowanie"],
    bio: `Developer. Odpowiada za produkcję aplikacji, jej bezpieczeństwo i${NBSP}całą stronę technologiczną OurMoney.`,
    facts: [
      { term: "Buduje", value: { kind: "links", links: [{ label: "OurMoney", href: "/ourmoney" }] } },
      { term: "Etat", value: { kind: "links", links: [{ label: "Automation House", href: "/automation-house" }] } },
      { term: "Supermoc", value: { kind: "text", text: "[placeholder: jedno zdanie]" } },
      { term: "Stack", value: { kind: "text", text: "[placeholder]" } },
      { term: "Po godzinach", value: { kind: "text", text: "[placeholder]" } },
      FUSS_METER,
    ],
  },
};

/** Trzecia karta: agenci AI (v5, „AI native”). */
export const aiCard = {
  id: "agenci-ai",
  name: "Agenci AI",
  code: "P3",
  photoLabel: "Agenci AI",
  roles: ["Research", "Kod", "Copy", "QA"],
  bio: `Pracują z${NBSP}nami ramię w${NBSP}ramię, od researchu po code review. Jesteśmy AI native: nie dokładamy AI do procesu, tylko projektujemy proces z${NBSP}AI w${NBSP}środku.`,
  facts: [
    { term: "Rola", value: { kind: "text", text: `Trzecia para rąk w${NBSP}każdym projekcie` } },
    { term: "Narzędzia", value: { kind: "text", text: "Claude Code, [placeholder]" } },
    { term: "Nadzór", value: { kind: "text", text: "Zawsze człowiek. Magda lub Kuba" } },
    FUSS_METER,
  ],
  linksLabel: "Więcej o pracy z AI",
  links: [{ label: `Produkty z${NBSP}AI`, href: "/#uslugi" }],
} as const satisfies AboutCard & {
  id: string;
  name: string;
  linksLabel: string;
  links: readonly AboutInternalLink[];
};

/** Jedna kopia treści paska; komponent powiela ją do pętli. */
export const marqueeItems = ["Dwie osoby", "Agenci AI", "AI native", "Design × Kod", "No fuss"] as const;

export interface RoleRow {
  label: string;
  /** Pozycja rombu na torze: 0% = Magda, 100% = Kuba (legacy `--v`). */
  position: string;
}

export const rolesSplit = {
  label: "Kto co robi",
  number: "[02]",
  rows: [
    { label: "Design", position: "4%" },
    { label: "Produkt", position: "10%" },
    { label: `Strategia i${NBSP}pomysły`, position: "50%" },
    { label: "Kod", position: "92%" },
    { label: `Infrastruktura i${NBSP}bezpieczeństwo`, position: "96%" },
    { label: `Agenci AI, ramię w${NBSP}ramię`, position: "50%" },
  ],
} as const satisfies { label: string; number: string; rows: readonly RoleRow[] };

export interface FindItem {
  /** Tekst główny (kolumna lewa). */
  title: string;
  /** Linia mono nad tytułem, np. data i miasto wydarzenia. */
  kicker?: string;
  /** Tekst po prawej (nie łamie się): strzałka „↗” / „→” albo metadane posta. */
  meta: string;
  /** Metadane w mono 12 px (posty). */
  metaMono?: boolean;
  href: string | null;
}

export const findUs = {
  id: "social",
  label: "Znajdź nas / 03",
  title: `no-fuss w${NBSP}sieci`,
  lead: "Wspólne konta studia. Profile osobiste są przy kartach wyżej.",
  ariaLabel: "Social media no-fuss",
  items: [
    { title: "Instagram", meta: "↗", href: null },
    { title: "LinkedIn", meta: "↗", href: null },
    { title: "Behance", meta: "↗", href: null },
    { title: "GitHub", meta: "↗", href: null },
  ],
} as const satisfies {
  id: string;
  label: string;
  title: string;
  lead: string;
  ariaLabel: string;
  items: readonly FindItem[];
};

export const linkedinPosts = {
  id: "posty",
  label: "Z LinkedIna / 04",
  title: "Co piszemy",
  lead: `Teksty Magdy o${NBSP}designie, produkcie i${NBSP}pracy we dwoje. Każdy wpis prowadzi do LinkedIna.`,
  note: "[Lista do podmiany: tytuł, data, link do posta]",
  ariaLabel: "Posty Magdy na LinkedInie",
  items: [
    { title: `[Tytuł posta 01 — jedno zdanie, które mówi, o${NBSP}czym jest]`, meta: "[data] · LinkedIn ↗", metaMono: true, href: null },
    { title: "[Tytuł posta 02]", meta: "[data] · LinkedIn ↗", metaMono: true, href: null },
    { title: "[Tytuł posta 03]", meta: "[data] · LinkedIn ↗", metaMono: true, href: null },
    { title: "[Tytuł posta 04]", meta: "[data] · LinkedIn ↗", metaMono: true, href: null },
    { title: "Wszystkie posty Magdy", meta: "LinkedIn ↗", metaMono: true, href: null },
  ],
} as const satisfies {
  id: string;
  label: string;
  title: string;
  lead: string;
  note: string;
  ariaLabel: string;
  items: readonly FindItem[];
};

/**
 * `#posty` gotowe do publikacji: wiersze i notka bez placeholderów `[…]`.
 * Bez żadnego wiersza z prawdziwym linkiem → `null` (sekcji nie ma; sam „Wszystkie posty”
 * bez adresu nic nie wnosi). Dane z placeholderami zostają wyżej do podmiany.
 */
export function publishedLinkedinPosts(): (Omit<typeof linkedinPosts, "note" | "items"> & {
  note?: string;
  items: readonly FindItem[];
}) | null {
  const items = linkedinPosts.items.filter((item) => !hasPlaceholder(item.title) && !hasPlaceholder(item.meta));
  if (!items.some((item) => item.href)) return null;
  const { note, ...rest } = linkedinPosts;
  return { ...rest, note: hasPlaceholder(note) ? undefined : note, items };
}

export const eventsTeaser = {
  id: "wydarzenia",
  label: "Na żywo / 05",
  title: "Przekazujemy wiedzę dalej",
  lead: `Warsztaty, prelekcje i${NBSP}meetupy z${NBSP}naszym udziałem: nadchodzące z${NBSP}zapisami, minione ze zdjęciami.`,
  ariaLabel: "Wydarzenia no-fuss",
  /** Ile najbliższych wydarzeń pokazać nad wierszem „Wszystkie wydarzenia”. */
  limit: 3,
  all: { title: "Wszystkie wydarzenia", meta: "→", href: "/wiedza" },
} as const satisfies {
  id: string;
  label: string;
  title: string;
  lead: string;
  ariaLabel: string;
  limit: number;
  all: FindItem;
};

/**
 * `#wydarzenia` na `/o-nas` (jedno z wejść na `/wiedza` na telefonie: HUD chowa link
 * poniżej 640 px). Najbliższe wydarzenia bez placeholderów `[…]` (`isPublishedEvent`, reguła
 * `/o-nas`) prowadzą do kafla `/wiedza#<id>`; ostatni wiersz do całej strony.
 */
export function publishedEventsTeaser(
  today: string,
): Omit<typeof eventsTeaser, "limit" | "all"> & { items: readonly FindItem[] } {
  const { limit, all, ...rest } = eventsTeaser;
  const { upcoming } = splitEvents(events.filter(isPublishedEvent), today);
  const items: FindItem[] = upcoming.slice(0, limit).map((e) => ({
    title: e.title,
    kicker: [eventDate(e).label, e.place].filter(Boolean).join(" · "),
    meta: "→",
    href: `/wiedza#${e.id}`,
  }));
  return { ...rest, items: [...items, all] };
}

export const stickerPlay = {
  id: "play",
  title: "Oklej nas",
  hint: "Przeciągnij naklejki ↓",
  /**
   * Pozycje startowe [left %, top %] planszy: `landscape` 1:1 z legacy (od 768 px w poziomie), `portrait`
   * na rogach i szwie zdjęć (telefon, tablet w pionie; pozycje legacy zasłaniały tam twarze).
   */
  spots: [
    { landscape: [8, 30], portrait: [1, 32] },
    { landscape: [78, 22], portrait: [80, 35] },
    { landscape: [16, 68], portrait: [1, 72] },
    { landscape: [84, 62], portrait: [77, 81] },
    { landscape: [46, 80], portrait: [40, 76] },
    { landscape: [60, 14], portrait: [77, 13] },
  ],
} as const;
