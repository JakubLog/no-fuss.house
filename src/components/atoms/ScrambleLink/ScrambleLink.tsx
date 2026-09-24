"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, FocusEvent, MouseEvent } from "react";
import { useScramble } from "@/lib/hooks/useScramble";
import { isInternalHref } from "@/lib/href";

type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, "children" | "href">;

export interface ScrambleLinkProps extends AnchorProps {
  /** `/route` i `/#kotwica` → `next/link`; `#kotwica`, `mailto:`, `https://` → zwykłe `<a>`. */
  href: string;
  /** Tylko tekst: scramble podmienia znaki. */
  children: string;
  /** Otwórz w nowej karcie (`target="_blank" rel="noopener"`). */
  external?: boolean;
}

/**
 * Link z efektem scramble na hover i focus (420 ms, znaki `!<>-_\/[]{}=+*^?#%`).
 * Wyłączony przy `prefers-reduced-motion`. `aria-label` = oryginalny tekst,
 * więc czytnik ekranu nie czyta szumu. Client Component.
 */
export function ScrambleLink({
  href,
  children,
  external = false,
  onMouseEnter,
  onFocus,
  onClick,
  "aria-label": ariaLabel,
  ...rest
}: ScrambleLinkProps) {
  const { text, scramble } = useScramble(children);
  const disabled = rest["aria-disabled"] === true || rest["aria-disabled"] === "true";

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    scramble();
    onMouseEnter?.(event);
  };
  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    scramble();
    onFocus?.(event);
  };

  /* Link-placeholder (`aria-disabled`): `href="#"` nie przewija strony na górę. */
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) event.preventDefault();
    onClick?.(event);
  };

  const shared = {
    ...rest,
    "aria-label": ariaLabel ?? children,
    onMouseEnter: handleMouseEnter,
    onFocus: handleFocus,
    onClick: handleClick,
    ...(external && !disabled ? { target: "_blank", rel: "noopener" } : {}),
  };

  if (isInternalHref(href) && !external) {
    return (
      <Link href={href} {...shared}>
        {text}
      </Link>
    );
  }

  return (
    <a href={href} {...shared}>
      {text}
    </a>
  );
}
