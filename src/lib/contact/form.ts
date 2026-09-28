/**
 * Formularz kontaktu w stopce (`ContactForm` → Server Action `sendContactMessage`): pola, limity,
 * walidacja i stany. Czysty moduł (bez `"use server"`), więc te same limity dostaje `maxLength` w kliencie.
 */

export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Maksymalna długość pola (znaki po normalizacji); 254 = limit adresu e-mail z RFC 5321. */
export const CONTACT_LIMITS: Readonly<Record<ContactField, number>> = {
  name: 120,
  email: 254,
  message: 5000,
};

/**
 * Pułapka na boty: pole niewidoczne dla ludzi i czytników. Wypełnione = odpowiedź „wysłane” bez maila.
 * Nazwa celowo nic nie znaczy (`website`/`url` wypełniają autouzupełnianie i menedżery haseł).
 */
export const CONTACT_HONEYPOT = "nf_field_2";

export type ContactFormState =
  | { status: "idle" }
  /** Walidacja serwera nie przeszła: wartości wracają do pól, błędy pod polami. */
  | { status: "invalid"; values: ContactValues; errors: ContactErrors }
  /** Wysyłka się nie udała (brak konfiguracji, błąd Resend, timeout): wartości wracają do pól. */
  | { status: "failed"; values: ContactValues }
  | { status: "sent"; email: string };

export const CONTACT_INITIAL_STATE: ContactFormState = { status: "idle" };

export type ContactParseResult =
  | { ok: true; values: ContactValues }
  | { ok: false; values: ContactValues; errors: ContactErrors };

/**
 * Adres tylko w ASCII (Chromium sam zamienia domenę IDN na punycode `xn--`): część lokalna to atomy RFC 5322 rozdzielone
 * pojedynczymi kropkami, domena to etykiety DNS (1–63 znaki, bez `-` na brzegach) z kropką, TLD z liter (min. 2)
 * albo punycode. Kropki rozdzielają powtórzenia jednoznacznie, a etykieta ma górny limit, więc bez katastrofalnego
 * backtrackingu (długość i tak sprawdzana wcześniej).
 */
const EMAIL_ATOM = String.raw`[A-Za-z0-9!#$%&'*+/=?^_\`{|}~-]+`;
const DOMAIN_LABEL = String.raw`[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?`;
const EMAIL_PATTERN = new RegExp(
  String.raw`^${EMAIL_ATOM}(?:\.${EMAIL_ATOM})*@(?:${DOMAIN_LABEL}\.)+(?:[A-Za-z]{2,}|xn--[A-Za-z0-9-]+)$`,
);

/**
 * Niewidoczne znaki usuwane z imienia: formatujące (`\p{Cf}`: bidi U+202A–E / U+2066–9 / U+200E–F / U+061C, U+200B,
 * U+FEFF…) i sterujące (`\p{Cc}`) poza `\t`–`\r`, które normalizacja białych znaków zamienia na spację. Zostają
 * ZWNJ i ZWJ (U+200C, U+200D): bez nich rozpadają się emoji złożone i pisownia części pism.
 */
const NAME_INVISIBLE = /(?![\t-\r\u200C\u200D])[\p{Cc}\p{Cf}]/gu;
/** Jak wyżej dla wiadomości, ale z białych znaków zostaje tylko `\n` (`\r\n`/`\r` → `\n` i `\t` → spacja idą wcześniej). */
const MESSAGE_INVISIBLE = /(?![\n\u200C\u200D])[\p{Cc}\p{Cf}]/gu;

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

/**
 * Normalizuje i sprawdza pola: imię w jednej linii (białe znaki → spacja), e-mail bez spacji,
 * wiadomość z końcami linii `\n` (tak liczy `maxLength` w przeglądarce). Z imienia i wiadomości znikają
 * znaki sterujące i formatujące; limity liczą się po oczyszczeniu. Wszystkie pola są wymagane.
 */
export function parseContactForm(formData: FormData): ContactParseResult {
  const values: ContactValues = {
    name: readText(formData, "name").replace(NAME_INVISIBLE, "").replace(/\s+/g, " ").trim(),
    email: readText(formData, "email").trim(),
    message: readText(formData, "message")
      .replace(/\r\n?/g, "\n")
      .replace(/\t/g, " ")
      .replace(MESSAGE_INVISIBLE, "")
      .trim(),
  };
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Wpisz imię";
  else if (values.name.length > CONTACT_LIMITS.name) {
    errors.name = `Imię jest za długie (maks. ${CONTACT_LIMITS.name} znaków)`;
  }

  if (!values.email) errors.email = "Wpisz adres e-mail";
  else if (values.email.length > CONTACT_LIMITS.email) errors.email = "Adres e-mail jest za długi";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Sprawdź adres e-mail";

  if (!values.message) errors.message = "Napisz, w czym możemy pomóc";
  else if (values.message.length > CONTACT_LIMITS.message) {
    errors.message = `Wiadomość jest za długa (maks. ${CONTACT_LIMITS.message} znaków)`;
  }

  return Object.keys(errors).length > 0 ? { ok: false, values, errors } : { ok: true, values };
}
