import Link from "next/link";
import type { ReactNode } from "react";
import { Fade } from "@/components/atoms/Fade";
import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
import { Heading } from "@/components/atoms/Heading";
import { ContactCta } from "@/components/molecules/ContactCta";
import { Line } from "@/components/atoms/Line";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { Tag } from "@/components/atoms/Tag";
import { FactRow } from "@/components/molecules/FactRow";
import { Reveal } from "@/components/organisms/Reveal";
import type { CaseStudyFact, CaseStudySummary } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./CaseStudyLayout.module.css";

export interface CaseStudyHeroProps {
  /** Tekst po chipie „Case study”, np. „Strona WWW · 06.2025”. */
  kicker: string;
  /** Nazwa projektu w roli mega (h1). */
  title: string;
  /** Lead w roli statement (opcjonalny, nie każdy case go ma). */
  lead?: ReactNode;
  /**
   * Standardowe fakty (`CaseStudy.summary`), zawsze pierwsze i w stałej kolejności:
   * „Rola no-fuss”, „Zakres”, „Czas”, „Klient” (opcjonalnie), „Wynik” (opcjonalnie).
   */
  summary: CaseStudySummary;
  /**
   * Dodatkowe fakty po standardowych (siatka `<dl>`: 2 kolumny, od 1024 px 3).
   * Wiersz z terminem standardowym jest pomijany (bez dublowania).
   */
  facts: readonly CaseStudyFact[];
  /**
   * ISO 8601 (`CaseStudy.datePublished`). Data w kickerze („06.2025”, „2024”) dostaje
   * `<time dateTime>`; tekst zostaje 1:1.
   */
  datePublished?: string;
}

export interface CaseStudyNextProps {
  href: string;
  /** Nazwa następnego projektu, np. „AION MIND”. */
  title: string;
  /** Legacy: `→` dla większości, `↗` przy OurMoney → AION MIND. */
  arrow?: "→" | "↗";
}

export interface CaseStudyCtaProps {
  /**
   * Tonacja sekcji: przeciwna do ostatniej sekcji case'u (szablon nie zna tonu `children`).
   * Domyślnie `dark`.
   */
  tone?: "light" | "dark";
  /** Nagłówek h2. Domyślnie `CASE_CTA_COPY.title`. */
  title?: string;
  /** Jedno zdanie pod nagłówkiem. Domyślnie `CASE_CTA_COPY.text`. */
  text?: string;
}

export interface CaseStudyLayoutProps {
  hero: CaseStudyHeroProps;
  /** Sekcje case study (zwykle `CaseStudySection`). */
  children: ReactNode;
  /** Blok CTA kontaktu przed „Następny projekt” (renderuje się zawsze). */
  cta?: CaseStudyCtaProps;
  /** Limonkowy blok „Następny projekt” na końcu. */
  next?: CaseStudyNextProps;
}

/** Terminy standardowych faktów hero (kolejność renderu). */
export const CASE_SUMMARY_TERMS = {
  role: "Rola no-fuss",
  scope: "Zakres",
  time: "Czas",
  client: "Klient",
  result: "Wynik",
} as const;

/** Copy bloku CTA (nowe, decyzja Kuby: case study ma prowadzić do kontaktu). */
export const CASE_CTA_COPY = {
  title: "Chcesz podobny projekt?",
  text: "Opowiedz, co chcesz zbudować, a powiemy, od czego zacząć.",
} as const;

const CTA_HEADING_ID = "case-cta-heading";

/**
 * Fakty hero: standardowe z `summary` (puste pola pominięte), potem `facts` bez wierszy,
 * które powtarzają termin standardowy.
 */
export function caseHeroFacts(summary: CaseStudySummary, facts: readonly CaseStudyFact[]): CaseStudyFact[] {
  const standard: CaseStudyFact[] = [
    { term: CASE_SUMMARY_TERMS.role, value: summary.role },
    { term: CASE_SUMMARY_TERMS.scope, value: summary.scope },
    { term: CASE_SUMMARY_TERMS.time, value: summary.time },
  ];
  if (summary.client) standard.push({ term: CASE_SUMMARY_TERMS.client, value: summary.client });
  if (summary.result) standard.push({ term: CASE_SUMMARY_TERMS.result, ...summary.result });
  const taken = new Set(standard.map((f) => f.term.toLowerCase()));
  return [...standard, ...facts.filter((f) => !taken.has(f.term.toLowerCase()))];
}

/** Pierwsza data w kickerze: „MM.RRRR” albo „RRRR” (po ostatnim „·”). */
const KICKER_DATE = /\b(?:\d{2}\.)?\d{4}\b/;

function Kicker({ text, datePublished }: { text: string; datePublished?: string }) {
  const match = datePublished ? KICKER_DATE.exec(text) : null;
  if (!match || !datePublished) return <>{text}</>;
  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {text.slice(0, start)}
      <time dateTime={datePublished}>{match[0]}</time>
      {text.slice(end)}
    </>
  );
}

function FactValue({ fact }: { fact: CaseStudyFact }) {
  if (!fact.href) return <>{fact.value}</>;
  return (
    <a href={fact.href} target="_blank" rel="noopener">
      {fact.value}
    </a>
  );
}

/**
 * Szablon case study: ciemne hero na pełną wysokość (chip, tytuł mega, lead,
 * fakty: standardowe z `summary` + `facts`), sekcje z `children`, blok CTA kontaktu
 * („Chcesz podobny projekt?” + `ContactCta`), blok „Następny projekt”. Hero odsłania się po
 * preloaderze (`Reveal trigger="intro"`). Stopka jest w layoucie.
 * Server Component. Strona dokłada `buildMetadata` i `<JsonLd>` (patrz docs/COMPONENTS.md).
 */
export function CaseStudyLayout({ hero, children, cta, next }: CaseStudyLayoutProps) {
  const facts = caseHeroFacts(hero.summary, hero.facts);
  /* `<article>`: case study to samodzielna treść (h1, sekcje, następny projekt). */
  return (
    <article>
      <Reveal as="section" trigger="intro" id="hero" className={cx("above-grid", styles.hero)} data-stickers="">
        <GlowBackdrop />
        <StickerLayer />
        <Fade as="p" className="mono">
          <Tag>Case study</Tag>{" \u00a0"}
          <Kicker text={hero.kicker} datePublished={hero.datePublished} />
        </Fade>
        <Heading as="h1" variant="mega" lines={[hero.title]} startIndex={1} />
        {hero.lead ? (
          <Fade as="p" index={3} className={styles.lead}>
            {hero.lead}
          </Fade>
        ) : null}
        <Fade as="dl" index={4} className={cx("mono-sm", styles.facts)}>
          {facts.map((fact) => (
            <FactRow key={fact.term} term={fact.term}>
              <FactValue fact={fact} />
            </FactRow>
          ))}
        </Fade>
      </Reveal>

      {children}

      <Reveal
        as="section"
        aria-labelledby={CTA_HEADING_ID}
        className={cx("section", styles.cta, (cta?.tone ?? "dark") === "dark" && "tone-dark")}
      >
        <Heading as="h2" variant="h2" id={CTA_HEADING_ID} lines={[cta?.title ?? CASE_CTA_COPY.title]} />
        <p className={cx("fade", styles.ctaText)} style={{ "--i": 1 }}>
          {cta?.text ?? CASE_CTA_COPY.text}
        </p>
        <ContactCta index={2} note />
      </Reveal>

      {next ? (
        <Reveal className={styles.nextWrap}>
          <Link className={styles.next} href={next.href}>
            <span className="mono fade">Następny projekt</span>
            <span className={styles.nextTitle}>
              <Line>
                {next.title}{" "}
                <span className={styles.arrow} aria-hidden="true">
                  {next.arrow ?? "→"}
                </span>
              </Line>
            </span>
          </Link>
        </Reveal>
      ) : null}
    </article>
  );
}
