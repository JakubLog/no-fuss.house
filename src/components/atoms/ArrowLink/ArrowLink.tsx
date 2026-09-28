import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { isInternalHref } from "@/lib/href";
import styles from "./ArrowLink.module.css";

export interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  /** Strzałka po tekście. Domyślnie `↗` dla zewnętrznych, `→` dla wewnętrznych. */
  arrow?: "→" | "↗" | "↓" | null;
  /** Nowa karta. Domyślnie `true` dla `http(s)://`. */
  external?: boolean;
  /** `underline`: podkreślenie 1 px, hover limonkowe tło (link w tekście, DESIGN.md). */
  variant?: "plain" | "underline";
  className?: string;
}

/**
 * Link ze strzałką, która na hover przesuwa się w prawo-górę (legacy `.arrow`). Twarda spacja
 * przed strzałką: „↗” nie spada sama do nowej linii. Server Component.
 */
export function ArrowLink({ href, children, arrow, external, variant = "plain", className }: ArrowLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const glyph = arrow === undefined ? (isExternal ? "↗" : "→") : arrow;
  const classes = cx(styles.link, variant === "underline" && styles.underline, className);
  const content = (
    <>
      {children}
      {glyph ? (
        <>
          {"\u00A0"}
          <span className={styles.arrow} aria-hidden="true">
            {glyph}
          </span>
        </>
      ) : null}
    </>
  );

  if (isInternalHref(href) && !isExternal) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...(isExternal ? { target: "_blank", rel: "noopener" } : {})}>
      {content}
    </a>
  );
}

/** Strzałka na końcu wartości-linku („busybeefilm.pl ↗”), ze spacją przed nią. */
const TRAILING_ARROW = /\s([↗→])$/;

/**
 * Tekst wartości-linku z danych (fakty hero, `SpecList`), np. „Strona działa: sassy-tan.vercel.app ↗”.
 * Ostatnie słowo (zwykle domena) razem ze strzałką to jeden blok `inline-block`: gdy nie mieści się
 * w linii, przechodzi do następnej w całości, więc domena nie łamie się na dywizie („sassy- / tan…”),
 * a „↗” nie zostaje sama. Blok szerszy od kolumny łamie się tylko przed kropką domeny
 * („sassy-tan.vercel / .app ↗”). Tekst (kopiowanie, czytnik) bez zmian poza twardą spacją przed strzałką.
 * Server Component.
 */
export function LinkText({ text }: { text: string }) {
  const arrow = TRAILING_ARROW.exec(text);
  const body = arrow ? text.slice(0, arrow.index) : text;
  const cut = body.lastIndexOf(" ") + 1;
  const segments = body.slice(cut).split(/(?=\.)/);
  const last = segments.length - 1;
  return (
    <>
      {body.slice(0, cut)}
      <span className={styles.keep}>
        {segments.map((segment, i) => (
          <Fragment key={i}>
            {i > 0 ? <wbr /> : null}
            <span className={styles.segment}>
              {i === last && arrow ? `${segment}\u00A0${arrow[1]}` : segment}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
