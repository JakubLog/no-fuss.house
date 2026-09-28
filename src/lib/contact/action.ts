"use server";

import { site } from "@/content/site";
import {
  CONTACT_HONEYPOT,
  CONTACT_INITIAL_STATE,
  parseContactForm,
  type ContactFormState,
  type ContactValues,
} from "./form";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 10_000;
const SUBJECT = "Kontakt ze strony no-fuss";

/** Opis błędu Resend do logu: tylko `name` i `message` z JSON-a (surowe body może zawierać adres e-mail). */
async function describeResendError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (typeof body !== "object" || body === null) return "";
    const { name, message } = body as Record<string, unknown>;
    return [name, message]
      .filter((part): part is string => typeof part === "string")
      .join(": ")
      .slice(0, 300);
  } catch {
    return "";
  }
}

/**
 * Wysyła wiadomość przez Resend API na `site.contact.email`; Reply-To = adres z formularza,
 * więc „Odpowiedz” w skrzynce trafia do nadawcy. Nadawca (`CONTACT_FROM`) musi być w domenie
 * zweryfikowanej w Resend. Bez `RESEND_API_KEY` / `CONTACT_FROM` albo przy błędzie API: `failed`
 * (formularz pokazuje adres e-mail), szczegóły tylko w logu serwera.
 */
async function deliver(values: ContactValues): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) {
    console.error("[contact] Brak RESEND_API_KEY albo CONTACT_FROM: wiadomość nie została wysłana.");
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [site.contact.email],
        reply_to: values.email,
        subject: SUBJECT,
        text: `Imię: ${values.name}\nE-mail: ${values.email}\n\n${values.message}\n`,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!response.ok) {
      const detail = await describeResendError(response);
      console.error(`[contact] Resend ${response.status}${detail ? `: ${detail}` : ""}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Resend niedostępny:", error);
    return false;
  }
}

/** Server Action formularza kontaktu (`useActionState` w `ContactForm`). Publiczny endpoint: wszystko sprawdza sam. */
export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (!(formData instanceof FormData)) return CONTACT_INITIAL_STATE;
  const parsed = parseContactForm(formData);
  const trap = formData.get(CONTACT_HONEYPOT);
  if (typeof trap === "string" && trap !== "") {
    console.warn("[contact] honeypot hit");
    return { status: "sent", email: parsed.values.email };
  }
  if (!parsed.ok) return { status: "invalid", values: parsed.values, errors: parsed.errors };
  if (!(await deliver(parsed.values))) return { status: "failed", values: parsed.values };
  return { status: "sent", email: parsed.values.email };
}
