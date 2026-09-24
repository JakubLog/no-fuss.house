import Link from "next/link";
import type { ReactNode } from "react";
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
 * Link ze strzałką, która na hover przesuwa się w prawo-górę (legacy `.arrow`).
 * Server Component.
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
          {" "}
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
