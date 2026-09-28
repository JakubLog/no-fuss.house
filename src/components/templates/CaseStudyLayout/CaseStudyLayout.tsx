import Link from "next/link";
import type { ReactNode } from "react";
import { LinkText } from "@/components/atoms/ArrowLink";
import { Fade } from "@/components/atoms/Fade";
import { GlowBackdrop } from "@/components/atoms/GlowBackdrop";
import { Heading } from "@/components/atoms/Heading";
import { ContactCta } from "@/components/molecules/ContactCta";
import { Line } from "@/components/atoms/Line";
import { StickerLayer } from "@/components/atoms/StickerLayer";
import { Tag } from "@/components/atoms/Tag";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { FactRow } from "@/components/molecules/FactRow";
import { Reveal } from "@/components/organisms/Reveal";
import type { CaseOwnership, CaseStudyFact, CaseStudySummary } from "@/content/types";
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
   * „Rola no-fuss” (przy etacie „Rola”), „Zakres”, „Czas”, „Klient” (opcjonalnie), „Wynik” (opcjonalnie).
   */
  summary: CaseStudySummary;
  /** `CaseStudy.ownership`: przy `employment` (etat, nie projekt no-fuss) termin roli to „Rola”. */
  ownership: CaseOwnership;
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

/**
 * Terminy standardowych faktów hero (kolejność renderu: role, scope, time, client, result).
 * `roleEmployment` zastępuje `role` przy `ownership: "employment"`: etat to nie rola studia.
 */
export const CASE_SUMMARY_TERMS = {
  role: "Rola no-fuss",
  roleEmployment: "Rola",
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
 * które powtarzają termin standardowy. `ownership` wybiera termin roli.
 */
export function caseHeroFacts(
  summary: CaseStudySummary,
  facts: readonly CaseStudyFact[],
  ownership: CaseOwnership,
): CaseStudyFact[] {
  const roleTerm = ownership === "employment" ? CASE_SUMMARY_TERMS.roleEmployment : CASE_SUMMARY_TERMS.role;
  const standard: CaseStudyFact[] = [
    { term: roleTerm, value: summary.role },
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

/**
 * Wartość faktu; link z `term`, gdy ta sama treść linku się powtarza („Pobierz ↗” dla App Store
 * i Google Play): termin w sr-only na początku, więc nazwa to „App Store: Pobierz ↗” (WCAG 2.4.4).
 * Tekst linku przez `LinkText`: domena ze strzałką nie łamie się na dywizie i „↗” nie zostaje sama.
 */
function FactValue({ fact, withTerm }: { fact: CaseStudyFact; withTerm: boolean }) {
  if (!fact.href) return <>{fact.value}</>;
  return (
    <a href={fact.href} target="_blank" rel="noopener">
      {withTerm ? <VisuallyHidden>{`${fact.term}: `}</VisuallyHidden> : null}
      <LinkText text={fact.value} />
    </a>
  );
}

/**
 * Tytuł bloku „Następny projekt”: ostatnie słowo i strzałka w jednym `nowrap`. Strzałka jest
 * `inline-block` (animacja `transform`), a przy elemencie atomowym twarda spacja nie blokuje
 * złamania linii, więc bez tego „→” zostawała sama w ostatniej linii.
 */
function NextTitle({ title, arrow }: { title: string; arrow: "→" | "↗" }) {
  const cut = title.lastIndexOf(" ") + 1;
  return (
    <>
      {title.slice(0, cut)}
      <span className={styles.nextLast}>
        {title.slice(cut)}
        {"\u00A0"}
        <span className={styles.arrow} aria-hidden="true">
          {arrow}
        </span>
      </span>
    </>
  );
}

/**
 * Szablon case study: ciemne hero na pełną wysokość (chip, tytuł mega, lead,
 * fakty: standardowe z `summary` + `facts`), sekcje z `children`, blok CTA kontaktu
 * („Chcesz podobny projekt?” + `ContactCta`), blok „Następny projekt”. Hero odsłania się na
 * starcie wejścia (`Reveal trigger="intro"`). Stopka jest w layoucie.
 * Server Component. Strona dokłada `buildMetadata` i `<JsonLd>` (patrz docs/COMPONENTS.md).
 */
export function CaseStudyLayout({ hero, children, cta, next }: CaseStudyLayoutProps) {
  const facts = caseHeroFacts(hero.summary, hero.facts, hero.ownership);
  const linkValues = facts.flatMap((fact) => (fact.href ? [fact.value] : []));
  const repeated = new Set(linkValues.filter((value, i) => linkValues.indexOf(value) !== i));
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
              <FactValue fact={fact} withTerm={repeated.has(fact.value)} />
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
                <NextTitle title={next.title} arrow={next.arrow ?? "→"} />
              </Line>
            </span>
          </Link>
        </Reveal>
      ) : null}
    </article>
  );
}
