import type { ReactNode } from "react";
import { EventTile } from "@/components/molecules/EventTile";
import type { KnowledgeEvent } from "@/content/events";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./EventsSection.module.css";

export interface EventsSectionProps {
  /** Kotwica sekcji, np. „nadchodzace”. Nagłówek dostaje `${id}-heading`. */
  id: string;
  /** Nagłówek `h2` w mono, np. „Nadchodzące wydarzenia”. */
  label: string;
  /** Wydarzenia już posortowane (`splitEvents`). */
  events: readonly KnowledgeEvent[];
  /** Wariant kafli i siatki: `upcoming` 1 → 2 kolumny, `past` 1 → 2 → 3 kolumny ze zdjęciami. */
  variant: "upcoming" | "past";
  /** Zdanie zamiast kafli przy pustej liście. Bez niego pusta sekcja się nie renderuje. */
  empty?: string;
  /** Treść pod listą (np. zaproszenie z linkiem do `#kontakt`). */
  footer?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Sekcja wydarzeń (`/wiedza`): nagłówek mono z licznikiem (jak `ProcessSection`) i kafle
 * `EventTile` w `<ul>`; każdy kafel odsłania się osobno. Server Component, dane z propsów.
 */
export function EventsSection({
  id,
  label,
  events,
  variant,
  empty,
  footer,
  tone = "light",
  className,
}: EventsSectionProps) {
  if (events.length === 0 && !empty) return null;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx("section", tone === "dark" ? "tone-dark" : "tone-light", className)}
    >
      <Reveal className={cx("mono", styles.head)}>
        <h2 id={headingId} className={cx("fade", styles.label)}>
          {label}
        </h2>
        {events.length > 0 ? (
          <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
            {events.length > 1 ? `01–${pad(events.length)}` : "01"}
          </span>
        ) : null}
      </Reveal>
      {events.length > 0 ? (
        <ul className={cx(styles.list, styles[variant])}>
          {events.map((event) => (
            <Reveal as="li" key={event.id}>
              <EventTile event={event} variant={variant} className="fade" />
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal>
          <p className={cx("fade", styles.empty)}>{empty}</p>
        </Reveal>
      )}
      {footer ? (
        <Reveal className={styles.footer}>
          <div className="fade">{footer}</div>
        </Reveal>
      ) : null}
    </section>
  );
}
