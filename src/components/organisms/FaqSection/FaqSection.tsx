import { ContactCta } from "@/components/molecules/ContactCta";
import type { FaqItem } from "@/content/types";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./FaqSection.module.css";

export interface FaqSectionProps {
  /** Kotwica sekcji, np. „faq”. Nagłówek dostaje `${id}-heading`. */
  id: string;
  /** Nagłówek `h2` w mono, np. „Częste pytania”. */
  label: string;
  /** Pytania już bez placeholderów (`publishedFaq()`). Pusta lista → sekcja się nie renderuje. */
  items: readonly FaqItem[];
  /** Zdanie nad CTA pod listą; bez niego sam `ContactCta`. */
  more?: string;
  /** CTA kontaktu pod listą. Domyślnie `true`. */
  cta?: boolean;
  tone?: "light" | "dark";
  className?: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * FAQ (strona główna, `#faq`): nagłówek mono z licznikiem i lista pytań na natywnych
 * `<details>/<summary>` (bez JS, działa z klawiatury: Tab + Enter/Spacja). Pytanie w `h3`
 * w roli title, numer i „+” w mono, wiersze z obrysem 1 px jak w `ServicesList`,
 * hover limonkowy jak w `FindSection`. Każdy wiersz odsłania się osobno. Pod listą
 * zdanie + `ContactCta`. Server Component, dane z propsów.
 */
export function FaqSection({ id, label, items, more, cta = true, tone = "light", className }: FaqSectionProps) {
  if (items.length === 0) return null;
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
        <span className="fade" style={{ "--i": 1 }} aria-hidden="true">
          {items.length > 1 ? `01–${pad(items.length)}` : "01"}
        </span>
      </Reveal>
      <div className={styles.list}>
        {items.map((item, i) => (
          <Reveal key={item.question} className={styles.row}>
            <details className={cx("fade", styles.item)}>
              <summary className={styles.summary} data-cursor="help">
                <span className={cx("mono", styles.no)} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.question}>{item.question}</h3>
                <span className={cx("mono", styles.icon)} aria-hidden="true">
                  +
                </span>
              </summary>
              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
      {cta ? (
        <Reveal className={styles.cta}>
          <div>
            {more ? (
              <p className={cx("fade", styles.more)}>{more}</p>
            ) : null}
            <ContactCta index={1} />
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
