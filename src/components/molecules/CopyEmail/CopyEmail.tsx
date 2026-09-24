"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePointerFine, useScramble } from "@/lib/hooks";
import { cx } from "@/lib/cx";

/** Czas pokazywania potwierdzenia (DESIGN.md: 1,8 s). */
export const COPY_FEEDBACK_MS = 1800;

export interface CopyEmailProps {
  email: string;
  /** Etykieta po skopiowaniu (1:1 z legacy). */
  copiedLabel?: string;
  /** Komunikat dla czytnika ekranu (region `role="status"`). */
  statusMessage?: string;
  className?: string;
}

/**
 * E-mail. Mysz / trackpad (`pointer: fine`): klik kopiuje adres do schowka i na 1,8 s
 * zmienia etykietę na „Skopiowano ✓”. Dotyk (i SSR przed hydratacją): zwykły `mailto:`,
 * bo na telefonie klient poczty jest bliżej niż schowek. Bez Clipboard API (albo gdy zapis
 * się nie uda) też `mailto:`. Hover / focus: scramble. Client Component.
 */
export function CopyEmail({
  email,
  copiedLabel = "Skopiowano ✓",
  statusMessage = "Adres e-mail skopiowany do schowka",
  className,
}: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const pointerFine = usePointerFine();
  const timerRef = useRef<number | null>(null);
  const { text, scramble, cancel } = useScramble(email, { disabled: copied });
  const href = `mailto:${email}`;

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!pointerFine) return; // dotyk: zwykły mailto
    const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clipboard) return; // brak API: zostaje zwykły mailto
    event.preventDefault();
    cancel();
    try {
      await clipboard.writeText(email);
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      window.location.href = href;
    }
  };

  return (
    <>
      <a
        href={href}
        className={cx(className)}
        aria-label={email}
        onClick={handleClick}
        onMouseEnter={scramble}
        onFocus={scramble}
      >
        {copied ? copiedLabel : text}
      </a>
      <span className="sr-only" role="status">
        {copied ? statusMessage : ""}
      </span>
    </>
  );
}
