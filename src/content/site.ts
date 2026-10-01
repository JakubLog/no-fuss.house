import type { Person, Product, SocialLink } from "./types";

/**
 * Dane firmy i osób. Jedno źródło prawdy dla UI, metadanych i JSON-LD.
 * Copy 1:1 z legacy (`legacy/no-fuss-v5.html`, `legacy/o-nas-v5.html`).
 */

/** `true`, jeśli tekst jest placeholderem w `[nawiasach]` albo link nie ma adresu. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  return v === "#" || (v.startsWith("[") && v.endsWith("]"));
}

/** `true`, jeśli w tekście jest placeholder `[…]` (także w środku zdania). */
export function hasPlaceholder(text: string): boolean {
  return isPlaceholder(text) || /\[[^\]]*\]/.test(text);
}

/** Dane kontaktowe (`site.contact`). */
export interface SiteContact {
  /** Adres e-mail (CopyEmail, `mailto:`, JSON-LD). */
  email: string;
  /** Google Calendar appointment schedule; `null` = przycisku „Umów rozmowę ↗” nie ma (`ContactCta`, `ContactForm`). */
  calendarUrl: string | null;
  /** Krótka obietnica odpowiedzi pod CTA. */
  responseNote: string;
}

export const site = {
  /** Nazwa marki (Organization.name). */
  name: "no-fuss",
  /** Zapis z logotypu HUD: „no–fuss” (półpauza). */
  wordmark: "no–fuss",
  /**
   * Marka z legacy (`no-fuss-v5.html`): sufiks tytułów podstron
   * („O NAS — NO-FUSS©2026”, „OTB VENTURES — CASE STUDY — NO-FUSS©2026”, „404 — NO-FUSS©2026”).
   */
  brandTitle: "NO-FUSS©2026",
  /** `<title>` strony głównej: marka + krótki opis oferty (do ~60 znaków, żeby Google nie ucinał). */
  homeTitle: "NO-FUSS©2026 | Studio produktowe: aplikacje, strony i AI",
  /**
   * Opis strony głównej (`<meta name="description">`, manifest, Organization w JSON-LD), do 155 znaków.
   * Nowe copy o usługach (decyzja Kuby, audyt B2B); opis z legacy był o duecie i OurMoney.
   */
  description:
    "Studio produktowe Magdy Nestorowicz i Kuby Fedoszczaka. Projektujemy i kodujemy aplikacje mobilne, strony i produkty z AI dla firm. Bez zamieszania.",
  /** Opis podstron: `<meta name="description">` z o-nas-v5 i case studies. */
  shortDescription:
    "no-fuss — Magda Nestorowicz (design i produkt) i Kuba Fedoszczak (kod). Produkty cyfrowe bez zbędnego zamieszania.",
  /** Hasło z hero strony głównej. */
  slogan: "Budujemy produkty bez zamieszania",
  lang: "pl",
  locale: "pl_PL",
  timeZone: "Europe/Warsaw",
  foundingYear: 2026,
  /**
   * Kontakt: jedno źródło prawdy dla stopki (adres pokazywany przy błędzie formularza; zgłoszenia idą na `CONTACT_TO`), CTA („Porozmawiajmy →”, „Umów rozmowę ↗”),
   * `/o-nas#social`, JSON-LD i `public/llms.txt`. Placeholdery `[…]` do podmiany.
   */
  contact: {
    /** Wspólna skrzynka studia (stopka, `/o-nas#social`, JSON-LD `Organization.email`, `llms.txt`). */
    email: "general@no-fuss.house",
    // link do Google Calendar appointment schedule, poda Kuba
    calendarUrl: null,
    /** Zdanie pod CTA. Placeholder (`[…]`) się nie renderuje (`isPlaceholder`). */
    responseNote: "[Odpowiadamy w 24 h, pierwsza rozmowa bez zobowiązań]",
  } as SiteContact,
  /** Linki social ze stopki (placeholdery 1:1 z legacy; `href: null` się nie renderuje). */
  social: [
    { network: "instagram", label: "[Instagram]", href: null },
    { network: "linkedin", label: "[LinkedIn]", href: null },
    { network: "behance", label: "[Behance]", href: null },
  ] as const satisfies readonly SocialLink[],
  /** Copyright ze stopki, 1:1. */
  copyright: "NO-FUSS (C) 2026",
  colors: {
    dark: "#101318",
    light: "#FCFCFB",
    accent: "#BBFF00",
  },
} as const;

export const people = [
  {
    id: "magda",
    name: "Magda Nestorowicz",
    givenName: "Magda",
    familyName: "Nestorowicz",
    role: "design i produkt",
    jobTitle: "Product Designerka",
    knowsAbout: ["design", "produkt"],
    social: [
      { network: "linkedin", label: "LinkedIn", href: null },
      { network: "instagram", label: "Instagram", href: null },
      { network: "dribbble", label: "Dribbble", href: null },
      { network: "x", label: "X", href: null },
    ],
  },
  {
    id: "kuba",
    name: "Kuba Fedoszczak",
    givenName: "Kuba",
    familyName: "Fedoszczak",
    role: "kod",
    jobTitle: "Developer",
    knowsAbout: ["kod"],
    social: [
      { network: "linkedin", label: "LinkedIn", href: null },
      { network: "github", label: "GitHub", href: "https://github.com/JakubLog" },
      { network: "x", label: "X", href: null },
    ],
  },
] as const satisfies readonly Person[];

/**
 * Produkty własne no-fuss (podpisy 1:1 z kafli). AION MIND tu nie ma: to etat Magdy
 * (Head of Operations), nie produkt studia; jego adres jest w `cases/aion-mind.ts`.
 */
export const products = [
  { name: "OurMoney", tagline: "wspólny budżet dla par", url: "https://ourmoney.pl" },
] as const satisfies readonly Product[];
