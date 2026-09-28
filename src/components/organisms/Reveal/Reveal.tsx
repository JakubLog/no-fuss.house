"use client";

import { createElement, useState, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useReveal, type RevealTrigger } from "@/lib/hooks/useReveal";

export type RevealElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "figure"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span"
  | "dl";

export interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  /** Element HTML. Domyślnie `div`. */
  as?: RevealElement;
  /**
   * `view` (domyślnie): gdy element wejdzie w viewport (threshold 0.15, raz).
   * `intro`: na starcie wejścia (fonty gotowe, `@/lib/intro`); używaj dla hero każdej strony.
   */
  trigger?: RevealTrigger;
}

/**
 * Wrapper odsłaniający treść (odpowiednik `data-reveal` z legacy). Dodaje klasę
 * `is-in`, a `.line` / `.fade` w środku animują się ze staggerem 80 ms na `--i`.
 * Przy `prefers-reduced-motion` treść jest widoczna od razu (CSS).
 *
 * Client Component, ale `children` mogą być Server Components.
 * Atrybuty `data-*` (np. `data-stickers`) przechodzą dalej.
 */
export function Reveal({ children, as = "div", trigger = "view", className, ...rest }: RevealProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const isIn = useReveal(element, { trigger });

  return createElement(
    as,
    {
      ...rest,
      ref: setElement,
      className: cx(className, isIn && "is-in") || undefined,
      "data-reveal": trigger,
    },
    children,
  );
}
