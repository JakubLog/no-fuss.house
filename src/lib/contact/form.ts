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

/** Pułapka na boty: pole niewidoczne dla ludzi i czytników. Wypełnione = odpowiedź „wysłane” bez maila. */
export const CONTACT_HONEYPOT = "website";

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

/**
 * Normalizuje i sprawdza pola: imię w jednej linii (białe znaki → spacja), e-mail bez spacji,
 * wiadomość z końcami linii `\n` (tak liczy `maxLength` w przeglądarce). Wszystkie pola są wymagane.
 */
export function parseContactForm(formData: FormData): ContactParseResult {
  const values: ContactValues = {
    name: readText(formData, "name").replace(/\s+/g, " ").trim(),
    email: readText(formData, "email").trim(),
    message: readText(formData, "message").replace(/\r\n?/g, "\n").trim(),
  };
  const errors: ContactErrors = {};

  if (!values.name) errors.name = "Wpisz imię";
  else if (values.name.length > CONTACT_LIMITS.name) {
    errors.name = `Imię jest za długie (maks. ${CONTACT_LIMITS.name} znaków)`;
  }

  if (!values.email) errors.email = "Wpisz adres e-mail";
  else if (values.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(values.email)) {
    errors.email = "Sprawdź adres e-mail";
  }

  if (!values.message) errors.message = "Napisz, w czym możemy pomóc";
  else if (values.message.length > CONTACT_LIMITS.message) {
    errors.message = `Wiadomość jest za długa (maks. ${CONTACT_LIMITS.message} znaków)`;
  }

  return Object.keys(errors).length > 0 ? { ok: false, values, errors } : { ok: true, values };
}
