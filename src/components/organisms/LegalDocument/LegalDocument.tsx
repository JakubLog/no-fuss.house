import { Fragment, type ReactNode } from "react";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { formatLegalDate } from "@/content/legal";
import type { LegalBlock, LegalDocument as LegalDocumentData, LegalLink, LegalList, LegalText } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./LegalDocument.module.css";

export interface LegalDocumentProps {
  document: LegalDocumentData;
  /** `paragraph`: „§ 1” (regulamin, numer czytany), `index`: „01” (polityka, numer tylko wizualny). */
  numbering: "paragraph" | "index";
  /** Blok nad pierwszą sekcją, np. `Tally` „W skrócie”. */
  summary?: ReactNode;
}

const isList = (block: LegalBlock): block is LegalList => typeof block === "object" && "list" in block;

/** Link w całości w jednej linii: „↗” (inline-block w `ArrowLink`) nie odrywa się od etykiety, adres nie łamie się na „-”. */
function LegalAnchor({ link }: { link: LegalLink }) {
  return (
    <ArrowLink
      href={link.href}
      variant="underline"
      arrow={/^https?:\/\//.test(link.href) ? "↗" : null}
      className={styles.nowrap}
    >
      {link.label}
    </ArrowLink>
  );
}

function Inline({ text }: { text: LegalText }) {
  if (typeof text === "string") return text;
  return text.map((part, i) =>
    typeof part === "string" ? <Fragment key={i}>{part}</Fragment> : <LegalAnchor key={i} link={part} />,
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (!isList(block)) {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  const ListTag = block.ordered ? "ol" : "ul";
  return (
    <ListTag className={cx(styles.list, block.ordered && styles.ordered)}>
      {block.list.map((item, i) => (
        <li key={i}>
          <Inline text={item} />
        </li>
      ))}
    </ListTag>
  );
}

/**
 * Dokument prawny (`/regulamin`, `/polityka-prywatnosci`) pod `PageHero`: jasna sekcja, od 1024 px spis treści
 * przyklejony w kolumnach 1–3 (kotwice przewija `SmoothScroll`, `scroll-margin-top` odsuwa nagłówek spod HUD),
 * treść w kolumnach 5–11. Nad sekcjami data wejścia w życie i opcjonalne `summary`. Bez reveal: tekst prawny
 * widoczny od razu. Server Component.
 */
export function LegalDocument({ document, numbering, summary }: LegalDocumentProps) {
  const number = (i: number) => (numbering === "paragraph" ? `§ ${i + 1}` : String(i + 1).padStart(2, "0"));
  const numberHidden = numbering === "index";

  return (
    <article className={cx("section", "tone-light", styles.doc)}>
      <nav className={styles.toc} aria-labelledby="spis-tresci">
        <h2 id="spis-tresci" className={cx("mono-sm", styles.tocLabel)}>
          Spis treści
        </h2>
        <ol className={styles.tocList}>
          {document.sections.map((section, i) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className={styles.tocLink}>
                <span className="mono-sm" aria-hidden={numberHidden || undefined}>
                  {number(i)}
                </span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.body}>
        <p className={cx("mono", styles.meta)}>
          Obowiązuje od <time dateTime={document.effectiveFrom}>{formatLegalDate(document.effectiveFrom)}</time>
        </p>
        {summary ? <div className={styles.summary}>{summary}</div> : null}
        {document.sections.map((section, i) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className={styles.part}>
            <h2 id={`${section.id}-heading`} className={styles.heading}>
              <span className={cx("mono", styles.number)} aria-hidden={numberHidden || undefined}>
                {number(i)}
              </span>
              <span>{section.title}</span>
            </h2>
            <div className={styles.prose}>
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
