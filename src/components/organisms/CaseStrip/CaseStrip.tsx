import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "../Reveal";
import styles from "./CaseStrip.module.css";

export interface CaseStripProps {
  /** Numer i nazwa sekcji mono, np. „03.5 / Codzienność”. Renderowany jako `<h2>`. */
  label: string;
  /** Tekst po prawej w wierszu nagłówka, np. „Zrzuty z aplikacji”. */
  aside: ReactNode;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  /** Treść pod nagłówkiem; zwykle organizm z własnym `Reveal` (CaseScreens, CaseNumbers…). */
  children: ReactNode;
}

/**
 * Sekcja pełnej szerokości z wierszem nagłówka mono (legacy `.section` + `.work__head`):
 * etykieta po lewej, opis po prawej, pod spodem siatka kafli. Server Component.
 */
export function CaseStrip({ label, aside, tone = "light", id, className, children }: CaseStripProps) {
  return (
    <section id={id} className={cx("section", tone === "dark" && "tone-dark", className)}>
      <Reveal className={cx("mono", styles.head)}>
        <h2 className={"mono fade"}>{label}</h2>
        <p className="fade" style={{ "--i": 1 }}>
          {aside}
        </p>
      </Reveal>
      {children}
    </section>
  );
}
