import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { EventTile } from "@/components/molecules/EventTile";
import type { TeaserEvent } from "@/content/events";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./KnowledgeTeaser.module.css";

export interface KnowledgeTeaserProps {
  /** Kotwica sekcji, np. „wiedza”. Nagłówek dostaje `${id}-heading`. */
  id: string;
  /** Etykieta mono nad nagłówkiem, np. „Wiedza”. */
  label: string;
  /** `h2` w roli h2, np. „Przekazujemy wiedzę dalej”. */
  title: string;
  /** Link do całej zakładki. */
  more: { label: string; href: string };
  /** Kafle z `teaserEvents()`. Pusta lista → sekcja się nie renderuje. */
  items: readonly TeaserEvent[];
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Zajawka zakładki „Wiedza” na stronie głównej: etykieta mono, `h2`, link „Zobacz wszystko →”
 * i do 3 kafli `EventTile` (najbliższe nadchodzące + najnowsze minione) w siatce 1 → 2 → 3 kolumny.
 * Każdy kafel odsłania się osobno. Server Component, dane z propsów.
 */
export function KnowledgeTeaser({ id, label, title, more, items, tone = "dark", className }: KnowledgeTeaserProps) {
  if (items.length === 0) return null;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx("section", tone === "dark" ? "tone-dark" : "tone-light", className)}
    >
      <Reveal className={styles.head}>
        <MonoLabel muted className={cx("fade", styles.label)}>
          {label}
        </MonoLabel>
        <Heading id={headingId} as="h2" variant="h2" lines={[title]} startIndex={1} className={styles.title} />
        <Fade index={2} className={cx("mono", styles.more)}>
          <ArrowLink href={more.href}>{more.label}</ArrowLink>
        </Fade>
      </Reveal>
      <ul className={styles.list}>
        {items.map(({ event, variant }) => (
          <Reveal as="li" key={event.id}>
            <EventTile event={event} variant={variant} className="fade" />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
