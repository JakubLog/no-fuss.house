import type { ReactNode } from "react";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Reveal } from "@/components/organisms/Reveal";
import { cx } from "@/lib/cx";
import styles from "./CaseStudyLayout.module.css";

interface CaseStudySectionBase {
  /** Numer i nazwa sekcji mono, np. „01 / Problem”, „03.2 / Onboarding”. */
  label: string;
  /** `dark` = sekcja `tone-dark`. Domyślnie jasna. */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}

export interface CaseStudySectionWideProps extends CaseStudySectionBase {
  /** Jedna szeroka kolumna (legacy `.cs-wide`: kolumny 3–12 od 1024 px). */
  layout?: "wide";
  children: ReactNode;
}

export interface CaseStudySectionSplitProps extends CaseStudySectionBase {
  /** Tekst (sticky, kolumny 3–6) + wizualizacja (kolumny 8–12). */
  layout: "split";
  text: ReactNode;
  visual: ReactNode;
  /** Zamiana stron: wizualizacja po lewej (legacy `.flip`). */
  flip?: boolean;
}

export interface CaseStudySectionLiteProps extends CaseStudySectionBase {
  /**
   * Sekcja „lite” z case studies stron (legacy `.lite` / `.cs-lite`): wiersz nagłówka
   * mono (etykieta jako `<h2>` po lewej, `hint` po prawej), pod spodem treść na pełną szerokość.
   */
  layout: "lite";
  /** Podpowiedź po prawej w wierszu nagłówka, np. „Przeciągnij taśmę”. */
  hint?: ReactNode;
  /** Treść od krawędzi do krawędzi (bez bocznego paddingu sekcji), np. taśma filmowa. */
  bleed?: boolean;
  children: ReactNode;
}

export type CaseStudySectionProps =
  | CaseStudySectionWideProps
  | CaseStudySectionSplitProps
  | CaseStudySectionLiteProps;

/**
 * Sekcja case study (legacy `.section.cs-block`): etykieta mono w kolumnach 1–2,
 * treść na siatce 12 kolumn. Odsłania się przy wejściu w viewport. Server Component.
 */
export function CaseStudySection(props: CaseStudySectionProps) {
  const { label, tone = "light", id, className } = props;
  const isSplit = props.layout === "split";

  if (props.layout === "lite") {
    return (
      <Reveal
        as="section"
        id={id}
        className={cx("section", styles.lite, tone === "dark" && "tone-dark", props.bleed && styles.bleed, className)}
      >
        <div className={cx("mono", styles.liteHead)}>
          <h2 className={cx("mono", "fade", styles.liteLabel)}>{label}</h2>
          {props.hint ? (
            <p className="fade" style={{ "--i": 1 }}>
              {props.hint}
            </p>
          ) : null}
        </div>
        {props.children}
      </Reveal>
    );
  }

  return (
    <Reveal
      as="section"
      id={id}
      className={cx("section", styles.block, tone === "dark" && "tone-dark", isSplit && props.flip && styles.flip, className)}
    >
      <MonoLabel muted className={cx("fade", styles.no)}>
        {label}
      </MonoLabel>
      {props.layout === "split" ? (
        <>
          <div className={styles.txt}>{props.text}</div>
          <div className={styles.vis}>{props.visual}</div>
        </>
      ) : (
        <div className={styles.wide}>{props.children}</div>
      )}
    </Reveal>
  );
}
