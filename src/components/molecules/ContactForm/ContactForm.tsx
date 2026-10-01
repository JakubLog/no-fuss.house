"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Button } from "@/components/atoms/Button";
import { CONTACT_CTA_LABELS } from "@/components/molecules/ContactCta";
import { privacyLink } from "@/content/legal";
import { isPlaceholder, site } from "@/content/site";
import { sendContactMessage } from "@/lib/contact/action";
import {
  CONTACT_FIELDS,
  CONTACT_HONEYPOT,
  CONTACT_INITIAL_STATE,
  CONTACT_LIMITS,
  parseContactForm,
  type ContactErrors,
  type ContactField,
  type ContactFormState,
  type ContactValues,
} from "@/lib/contact/form";
import { cx } from "@/lib/cx";
import styles from "./ContactForm.module.css";
import { ContactFormBoundary } from "./ContactFormBoundary";

/** Copy formularza (nowe, bez wzorca w legacy). Komunikaty walidacji: `@/lib/contact/form`. */
export const CONTACT_FORM_COPY = {
  label: "Napisz do nas",
  fields: { name: "Imię", email: "E-mail", message: "Wiadomość" },
  messagePlaceholder: "Co budujemy? Zakres, termin, linki: wszystko się przyda.",
  submit: "Wyślij wiadomość →",
  pending: "Wysyłamy…",
  sent: "Dzięki, wiadomość doszła. Odpiszemy na",
  failed: "Wiadomość nie doszła. Spróbuj jeszcze raz albo napisz na",
  trap: "Zostaw to pole puste",
  privacy: "Dane z formularza służą tylko do odpowiedzi.",
} as const;

export interface ContactFormProps {
  className?: string;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}

function Field({ id, label, error, wide = false, children }: FieldProps) {
  return (
    <div className={cx(styles.field, wide && styles.wide)}>
      <label htmlFor={id} className={cx("mono-sm", styles.label)}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={cx("mono-sm", styles.error)}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

const failedMessage = (
  <>
    {CONTACT_FORM_COPY.failed} <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
  </>
);

interface ContactFormAttemptProps extends ContactFormProps {
  /** `idle` albo (po odrzuconym wywołaniu akcji w poprzedniej próbie) `failed` z wysłanymi wartościami. */
  initialState: ContactFormState;
}

interface ContactFormViewProps extends ContactFormAttemptProps {
  /** Wartości z wysyłanego formularza (przed wywołaniem akcji), dla następnej próby po odrzuceniu. */
  onSubmitValues: (values: ContactValues) => void;
}

function ContactFormView({ className, initialState, onSubmitValues }: ContactFormViewProps) {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const { calendarUrl, responseNote } = site.contact;
  const values = state.status === "invalid" || state.status === "failed" ? state.values : null;
  const errors: ContactErrors = state.status === "invalid" ? state.errors : {};
  const remounted = initialState.status === "failed";

  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = CONTACT_FIELDS.find((field) => state.errors[field]);
    const control = first ? formRef.current?.elements.namedItem(first) : null;
    if (control instanceof HTMLElement) control.focus();
  }, [state]);

  /* Po odrzuconym wywołaniu formularz montuje się od nowa: fokus zgubiony z usuniętym DOM wraca na przycisk. */
  useEffect(() => {
    if (!remounted || document.activeElement !== document.body) return;
    formRef.current?.querySelector<HTMLElement>('[type="submit"]')?.focus();
  }, [remounted]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (pending) event.preventDefault();
    else onSubmitValues(parseContactForm(new FormData(event.currentTarget)).values);
  };

  /* React resetuje pola po każdej akcji do `defaultValue`, więc po błędzie wracają z `values`. */
  const control = (field: ContactField) => ({
    id: `${id}-${field}`,
    name: field,
    required: true,
    maxLength: CONTACT_LIMITS[field],
    defaultValue: values?.[field] ?? "",
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      className={cx(styles.form, className)}
      aria-label={CONTACT_FORM_COPY.label}
    >
      <div className={styles.fields}>
        <Field id={`${id}-name`} label={CONTACT_FORM_COPY.fields.name} error={errors.name}>
          <input {...control("name")} type="text" autoComplete="name" className={styles.input} />
        </Field>
        <Field id={`${id}-email`} label={CONTACT_FORM_COPY.fields.email} error={errors.email}>
          <input
            {...control("email")}
            type="email"
            autoComplete="email"
            spellCheck={false}
            className={styles.input}
          />
        </Field>
        <Field id={`${id}-message`} label={CONTACT_FORM_COPY.fields.message} error={errors.message} wide>
          <textarea
            {...control("message")}
            rows={5}
            placeholder={CONTACT_FORM_COPY.messagePlaceholder}
            className={cx(styles.input, styles.textarea)}
            data-lenis-prevent=""
          />
        </Field>
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${id}-${CONTACT_HONEYPOT}`}>{CONTACT_FORM_COPY.trap}</label>
        <input
          id={`${id}-${CONTACT_HONEYPOT}`}
          name={CONTACT_HONEYPOT}
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" className={styles.submit} aria-disabled={pending || undefined}>
          {pending ? CONTACT_FORM_COPY.pending : CONTACT_FORM_COPY.submit}
        </Button>
        {calendarUrl ? (
          <Button href={calendarUrl} variant="ghost" external data-cursor="calendar">
            {CONTACT_CTA_LABELS.calendar}
          </Button>
        ) : null}
      </div>
      {isPlaceholder(responseNote) ? null : <p className={cx("mono-sm", styles.note)}>{responseNote}</p>}
      <p className={cx("mono-sm", styles.note)}>
        {CONTACT_FORM_COPY.privacy}{" "}
        <ArrowLink href={privacyLink.href} variant="underline">
          {privacyLink.label}
        </ArrowLink>
      </p>
      {/* Po remoncie komunikat jest w regionie od początku: `status` mógłby przemilczeć, `alert` czytniki ogłaszają. */}
      <p role={remounted ? "alert" : "status"} className={styles.status}>
        {state.status === "sent" ? `${CONTACT_FORM_COPY.sent} ${state.email}.` : null}
        {state.status === "failed" ? failedMessage : null}
      </p>
    </form>
  );
}

/**
 * Jedna próba formularza w error boundary. Odrzucone wywołanie akcji `useActionState` rzuca do boundary; fallback
 * montuje nową próbę w stanie `failed` z wartościami ostatniej wysyłki, więc wygląda jak zwykły błąd wysyłki
 * (każde kolejne odrzucenie to kolejny poziom). Bez wysyłki (błąd renderu, nie akcji) sam komunikat, bez pętli.
 */
function ContactFormAttempt({ className, initialState }: ContactFormAttemptProps) {
  const [submitted, setSubmitted] = useState<ContactValues | null>(null);
  const fallback = submitted ? (
    <ContactFormAttempt className={className} initialState={{ status: "failed", values: submitted }} />
  ) : (
    <p role="alert" className={cx(styles.status, className)}>
      {failedMessage}
    </p>
  );

  return (
    <ContactFormBoundary fallback={fallback}>
      <ContactFormView className={className} initialState={initialState} onSubmitValues={setSubmitted} />
    </ContactFormBoundary>
  );
}

/**
 * Formularz kontaktu w stopce `#kontakt` (cel „Porozmawiajmy →”): imię, e-mail, wiadomość → Server Action
 * `sendContactMessage` (Resend na adresy zespołu z `CONTACT_TO`) wprost w `useActionState`, więc działa też bez JS i przed
 * hydratacją. Obok wysyłki „Umów rozmowę ↗” (tylko z `calendarUrl`), pod spodem `responseNote` (placeholder `[…]`
 * się nie renderuje). Walidacja natywna (`required`, `type="email"`, `maxLength` = limity serwera) + serwerowa: błąd
 * pod polem, fokus na pierwsze błędne pole, wpisane wartości zostają. Po wysłaniu pola się czyszczą, wynik
 * w `role="status"`; przy błędzie wysyłki adres e-mail. Odrzucone wywołanie akcji (429 z Vercel Firewall, brak
 * sieci, limit body) łapie `ContactFormBoundary` i pokazuje ten sam stan `failed` (wartości zostają, fokus na
 * przycisku, komunikat w `role="alert"`). W trakcie wysyłki przycisk ma `aria-disabled` (zostaje fokus, wygaszony)
 * i drugi submit jest blokowany w `onSubmit`. Client Component.
 */
export function ContactForm({ className }: ContactFormProps) {
  return <ContactFormAttempt className={className} initialState={CONTACT_INITIAL_STATE} />;
}
