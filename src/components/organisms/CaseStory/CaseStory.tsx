import { Fade } from "@/components/atoms/Fade";
import { FactRow } from "@/components/molecules/FactRow";
import type { CaseStudyStory } from "@/content/types";
import { cx } from "@/lib/cx";
import styles from "./CaseStory.module.css";

export interface CaseStoryProps {
  story: CaseStudyStory;
  /** Indeks staggeru reveal całej listy (jak treść sekcji `lite`). Domyślnie 2. */
  index?: number;
  className?: string;
}

/** Terminy wierszy 2 i 3 (pierwszy to `story.problemTerm`). */
export const CASE_STORY_TERMS = { done: "Co zrobiliśmy", effect: "Efekt" } as const;

/**
 * Narracja case study strony WWW: `<dl>` z trzema `FactRow` („Problem” albo „Zadanie”,
 * „Co zrobiliśmy”, „Efekt”). Termin mono, wartość w roli `lead`; od 1024 px trzy kolumny.
 * Musi być w `Reveal` (np. `CaseStudySection layout="lite"`). Server Component.
 */
export function CaseStory({ story, index = 2, className }: CaseStoryProps) {
  return (
    <Fade as="dl" index={index} className={cx("mono", styles.story, className)}>
      <FactRow term={story.problemTerm}>{story.problem}</FactRow>
      <FactRow term={CASE_STORY_TERMS.done}>{story.done}</FactRow>
      <FactRow term={CASE_STORY_TERMS.effect}>{story.effect}</FactRow>
    </Fade>
  );
}
