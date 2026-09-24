import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { isInternalHref } from "@/lib/href";
import styles from "./Button.module.css";

interface ButtonBaseProps {
  children: ReactNode;
  /** `accent`: limonka + `#101318` (domyślnie). `ghost`: przezroczysty z obrysem 1 px. */
  variant?: "accent" | "ghost";
  className?: string;
}

export type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & { href?: undefined };

export type ButtonAsLinkProps = ButtonBaseProps & {
  /**
   * Z `href` renderuje link (`next/link` dla ścieżek `/…`). `null` = link-placeholder:
   * nieklikalny `<span>` z opacity .5 i dopiskiem dla czytników (`placeholderNote`).
   */
  href: string | null;
  /** Otwórz w nowej karcie (`target="_blank" rel="noopener"`). */
  external?: boolean;
  /** Dopisek sr-only przy `href: null`, domyślnie „wkrótce”. */
  placeholderNote?: string;
  "aria-label"?: string;
  /** Stan własnego kursora (`Cursor`), np. `"calendar"`; przy `href: null` pomijany (placeholder = strzałka). */
  "data-cursor"?: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * Przycisk prostokątny (legacy `.btn` z 404): mono wersalikami, min. 48 px wysokości.
 * Server Component (interakcję dodaje rodzic przez `onClick` w komponencie klienckim).
 */
export function Button({ children, variant = "accent", className, ...props }: ButtonProps) {
  const classes = cx("mono", styles.button, variant === "ghost" && styles.ghost, className);

  if (props.href !== undefined) {
    const {
      href,
      external = false,
      placeholderNote = "wkrótce",
      "aria-label": ariaLabel,
      "data-cursor": dataCursor,
    } = props;
    if (href === null) {
      return (
        <span className={cx(classes, styles.placeholder)}>
          {children}
          <span className="sr-only"> ({placeholderNote})</span>
        </span>
      );
    }
    if (isInternalHref(href) && !external) {
      return (
        <Link href={href} className={classes} aria-label={ariaLabel} data-cursor={dataCursor}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        data-cursor={dataCursor}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}
