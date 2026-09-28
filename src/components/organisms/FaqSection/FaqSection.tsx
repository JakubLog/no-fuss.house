import { ArrowLink } from "@/components/atoms/ArrowLink";
import type { FaqItem, FaqMore } from "@/content/types";
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
  /**
   * Zdanie pod listą („Nie ma tu Waszego pytania?…”) z linkiem w tekście do stopki `#kontakt`
   * (przewija `SmoothScroll` i przenosi fokus na stopkę).
   */
  more?: FaqMore;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * FAQ (strona główna, `#faq`): nagłówek mono (jedyny reveal w sekcji) i lista pytań na natywnych
 * `<details>/<summary>` (bez JS, działa z klawiatury: Tab + Enter/Spacja), widoczna od razu.
 * Pytanie w `h3` w roli title, „+” w mono, wiersze z obrysem 1 px jak w `ServicesList`, hover
 * limonkowy jak w liście usług (tylko myszą). Bez numerów i licznika. Pod listą zdanie `more` z linkiem w tekście
 * (`ArrowLink` bez strzałki) do stopki `#kontakt` tuż pod sekcją. Server Component, dane z propsów.
 */
export function FaqSection({ id, label, items, more, tone = "light", className }: FaqSectionProps) {
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
      </Reveal>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.summary} data-cursor="help">
              <h3 className={styles.question}>{item.question}</h3>
              <span className={cx("mono", styles.icon)} aria-hidden="true">
                +
              </span>
            </summary>
            <div className={styles.answer}>
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
      {more ? (
        <div className={styles.more}>
          <p>
            {more.before}
            <ArrowLink href={more.link.href} variant="underline" arrow={null}>
              {more.link.label}
            </ArrowLink>
            {more.after}
          </p>
        </div>
      ) : null}
    </section>
  );
}
