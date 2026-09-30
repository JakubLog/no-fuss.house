import { FALLBACK_SITE_URL } from "@/lib/seo/site-url";
import { people, site } from "./site";
import type { LegalLink, TallyRow } from "./types";

/**
 * Wspólne dane regulaminu (`terms.ts`), polityki prywatności (`privacy-policy.ts`) i komunikatu
 * o ciasteczkach (`CookieNotice`, klient: bez ciężkich importów). Nowe copy, bez wzorca w legacy.
 */

/** Data wejścia w życie obu dokumentów (ISO). Zmiana treści → nowa data tu i `lastModified` w `routes.ts`. */
export const LEGAL_EFFECTIVE_FROM = "2026-09-30";

/** „2026-09-30” → „30.09.2026”. */
export function formatLegalDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

/** Domena strony w treści dokumentów (stała, niezależna od `NEXT_PUBLIC_SITE_URL` w dev i preview). */
export const LEGAL_DOMAIN = new URL(FALLBACK_SITE_URL).host;

/**
 * Współadministratorzy danych i usługodawcy (art. 26 RODO, art. 5 UŚUDE): Magda i Kuba jako osoby fizyczne.
 * `name` to pełne imię i nazwisko do dokumentów (w UI zostają „Magda” i „Kuba” z `people`). `address` to miejsce
 * zamieszkania i adres (art. 5 ust. 2 pkt 2 UŚUDE); `null` = jeszcze nie podany, dokumenty pokazują samo nazwisko.
 */
const legalIdentity = {
  magda: { name: "Magdalena Nestorowicz", address: null },
  kuba: { name: "Jakub Fedoszczak", address: "ul. Wrocławska 63/4, 55-300 Środa Śląska" },
} as const satisfies Record<(typeof people)[number]["id"], { name: string; address: string | null }>;

export const controllers = people.map((person) => legalIdentity[person.id]);

/** „Magdalena Nestorowicz; Jakub Fedoszczak (adres: ul. …)”: średnik oddziela osoby, adres w nawiasie tylko, gdy jest. */
export const controllersSentence = controllers
  .map((c) => (c.address ? `${c.name} (adres: ${c.address})` : c.name))
  .join("; ");

/** `mailto:` wspólnej skrzynki: jedyny punkt kontaktowy w obu dokumentach. */
export const contactLink: LegalLink = { label: site.contact.email, href: `mailto:${site.contact.email}` };

export const privacyLink: LegalLink = { label: "Polityka prywatności", href: "/polityka-prywatnosci" };

export const termsLink: LegalLink = { label: "Regulamin", href: "/regulamin" };

/** Wiersz paragonu w komunikacie: `from` = wartość startowa odliczania do `value`. */
export interface CookieNoticeRow extends TallyRow {
  from: number;
}

/**
 * Komunikat o ciasteczkach (`CookieNotice`). Strona nie ustawia ciasteczek, więc to informacja, nie prośba
 * o zgodę. Zamknięcie zapisuje `version` (data dokumentów) w `localStorage` pod `storageKey`, więc po zmianie
 * polityki (nowa `LEGAL_EFFECTIVE_FROM`) komunikat pokaże się znowu.
 */
export interface CookieNoticeCopy {
  storageKey: string;
  version: string;
  /** Etykieta mono nad tytułem. */
  label: string;
  /** Tytuł: `mark` na limonce (`Mark`), potem `rest`. */
  title: { mark: string; rest: string };
  /** Nazwa paragonu dla czytników. */
  tallyLabel: string;
  rows: readonly CookieNoticeRow[];
  text: string;
  accept: string;
  more: LegalLink;
}

export const cookieNotice = {
  storageKey: "nf:cookie-notice",
  version: LEGAL_EFFECTIVE_FROM,
  label: "Prywatność",
  title: { mark: "Zero", rest: "ciasteczek. Serio." },
  tallyLabel: "Co zapisujemy o Tobie",
  rows: [
    { label: "Ciasteczka", value: "0", from: 24 },
    { label: "Analityka", value: "0", from: 12 },
    { label: "Reklamy i piksele", value: "0", from: 7 },
    { label: "Zamieszanie", value: "0", from: 404 },
  ],
  text: "Nie śledzimy Cię i nie mamy analityki ani reklam. Przeglądarka zapamięta tylko, że zamknięto ten komunikat.",
  accept: "Jasne",
  more: privacyLink,
} as const satisfies CookieNoticeCopy;

/** „W skrócie” nad polityką prywatności. */
export const privacySummary = {
  label: "W skrócie",
  rows: [
    { label: "Ciasteczka", value: "0" },
    { label: "Analityka, reklamy, piksele", value: "0" },
    { label: "Sprzedane dane", value: "0" },
    { label: "Co zbieramy", value: "Tylko to, co wpiszesz w formularz" },
  ],
} as const satisfies { label: string; rows: readonly TallyRow[] };
