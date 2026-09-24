import Image from "next/image";
import { PhotoPlaceholder } from "@/components/atoms/PhotoPlaceholder";
import { PersonCard } from "@/components/molecules/PersonCard";
import { Reveal } from "@/components/organisms/Reveal";
import { aiCard, personCards, publishedFacts } from "@/content/about";
import { people } from "@/content/site";
import styles from "./TeamSheets.module.css";

/**
 * Szerokość zdjęcia w karcie: <900 px pełna szerokość, 900–1199 px dwie kolumny
 * i zdjęcie na 2/6 karty, od 1200 px trzy kolumny i zdjęcie na całą kartę.
 */
const PHOTO_SIZES = "(min-width: 1200px) 33vw, (min-width: 900px) 17vw, 100vw";

/** Ilustracja robota z karty agentów AI, 1:1 z legacy. */
function AgentIllustration() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="#101318"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="18" y="34" width="84" height="62" rx="14" />
      <path d="M60 34V18M48 18h24" />
      <circle cx="44" cy="62" r="5" fill="#101318" stroke="none" />
      <circle cx="76" cy="62" r="5" fill="#101318" stroke="none" />
      <path d="M44 80h32M8 56v18M112 56v18" />
    </svg>
  );
}

/**
 * Karty postaci (legacy `.sheets`): Magda, Kuba (dane z `site.ts` + `about.ts`)
 * i agenci AI. Kuba ma zdjęcie (`card.photo`), reszta placeholder. Ciemne tło, karty `--shade-900`. Każda karta odsłania się osobno.
 * Server Component.
 */
export function TeamSheets() {
  return (
    <div className={`tone-dark ${styles.sheets}`}>
      {people.map((person) => {
        const card = personCards[person.id];
        return (
          <Reveal key={person.id} className={styles.cell}>
            <PersonCard
              id={person.id}
              name={person.name}
              code={card.code}
              photo={
                card.photo ? (
                  <Image
                    src={card.photo.src}
                    width={card.photo.width}
                    height={card.photo.height}
                    alt={card.photo.alt}
                    sizes={PHOTO_SIZES}
                    className={styles.photo}
                  />
                ) : (
                  <PhotoPlaceholder label={card.photoLabel} />
                )
              }
              roles={card.roles}
              bio={card.bio}
              facts={publishedFacts(card.facts)}
              social={person.social}
              linksLabel={`Social media: ${person.name}`}
            />
          </Reveal>
        );
      })}
      <Reveal className={styles.cell}>
        <PersonCard
          id={aiCard.id}
          name={aiCard.name}
          code={aiCard.code}
          variant="ai"
          photo={
            <PhotoPlaceholder tone="lime" ariaLabel={aiCard.photoLabel}>
              <AgentIllustration />
            </PhotoPlaceholder>
          }
          roles={aiCard.roles}
          bio={aiCard.bio}
          facts={publishedFacts(aiCard.facts)}
          internalLinks={aiCard.links}
          linksLabel={aiCard.linksLabel}
        />
      </Reveal>
    </div>
  );
}
