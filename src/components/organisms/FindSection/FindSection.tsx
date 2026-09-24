import type { ReactNode } from "react";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Reveal } from "@/components/organisms/Reveal";
import type { FindItem } from "@/content/about";
import { cx } from "@/lib/cx";
import { externalLinkProps } from "@/lib/href";
import styles from "./FindSection.module.css";

export interface FindSectionProps {
  id: string;
  /** Etykieta mono nad nagłówkiem, np. „Znajdź nas / 03”. */
  label: string;
  title: string;
  lead: string;
  /** Dodatkowa notka mono pod leadem (placeholder listy postów). */
  note?: string;
  /** `aria-label` nawigacji z linkami. */
  ariaLabel: string;
  items: readonly FindItem[];
  /** Element dopisany na końcu listy (np. `CopyEmail` z klasą `findCopyClassName`). */
  extra?: ReactNode;
  tone?: "light" | "dark";
}

/** Wiersz z „⧉” po prawej (e-mail kopiowany do schowka). */
export const findCopyClassName: string = cx(styles.item, styles.copy);

/**
 * Sekcja „nagłówek przyklejony po lewej + lista linków po prawej” (legacy `.find`):
 * `#social` i `#posty` na `/o-nas`. Wiersz na hover dostaje limonkowe tło.
 * Linki zewnętrzne `target=_blank rel=noopener` (`externalLinkProps` z `@/lib/href`).
 * Placeholdery (`href: null`) to nieklikalne wiersze (`<span>`, opacity .5, bez hovera)
 * z dopiskiem „wkrótce” dla czytników.
 * Server Component.
 */
export function FindSection({ id, label, title, lead, note, ariaLabel, items, extra, tone = "light" }: FindSectionProps) {
  return (
    <Reveal
      as="section"
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx("section", tone === "dark" ? "tone-dark" : "tone-light", styles.find)}
    >
      <div className={styles.head}>
        <MonoLabel muted className="fade">
          {label}
        </MonoLabel>
        <Heading id={`${id}-title`} as="h2" variant="h2" lines={[title]} startIndex={1} className={styles.title} />
        <p className={cx("fade", styles.lead)} style={{ "--i": 2 }}>
          {lead}
        </p>
        {note ? (
          <p className={cx("fade", "mono-sm", styles.note)} style={{ "--i": 3 }}>
            {note}
          </p>
        ) : null}
      </div>
      <nav aria-label={ariaLabel} className={cx("fade", styles.list)} style={{ "--i": 2 }}>
        {items.map((item) => {
          const content = (
            <>
              {item.metaMono ? <span className={styles.itemTitle}>{item.title}</span> : `${item.title} `}
              <span className={item.metaMono ? "mono-sm" : undefined}>{item.meta}</span>
            </>
          );
          return item.href ? (
            <a key={item.title} className={styles.item} {...externalLinkProps(item.href)}>
              {content}
            </a>
          ) : (
            <span key={item.title} className={cx(styles.item, styles.soon)}>
              {content}
              <span className="sr-only"> (wkrótce)</span>
            </span>
          );
        })}
        {extra}
      </nav>
    </Reveal>
  );
}
