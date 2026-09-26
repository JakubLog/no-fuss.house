import Image from "next/image";
import { Fade } from "@/components/atoms/Fade";
import { Mark } from "@/components/atoms/Mark";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { CaseBigLine, CaseProse } from "@/components/molecules/CaseProse";
import { TileCaption } from "@/components/molecules/TileCaption";
import { CaseNumbers } from "@/components/organisms/CaseNumbers";
import { CaseStage } from "@/components/organisms/CaseStage";
import { CaseStrip } from "@/components/organisms/CaseStrip";
import { GuideCards } from "@/components/organisms/GuideCards";
import { JournalScreen } from "@/components/organisms/JournalScreen";
import { RolePath } from "@/components/organisms/RolePath";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import {
  AION_MIND_URL,
  aionMind,
  aionMindAppDescription,
  aionMindGuides,
  aionMindImages,
  aionMindNumbers,
  aionMindPath,
  aionMindStores,
} from "@/content/cases/aion-mind";
import { softwareApplication, softwareAppId } from "@/content/cases/software-app";
import { JsonLd, breadcrumb, creativeWork, graph, ids } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { MIN_CASE_NUMBERS, caseDescription, publishedNumbers } from "@/content/cases";
import styles from "./page.module.css";

const PATH = aionMind.path;
/** AION MIND jako organizacja (pracodawca Magdy z `aionMind.employer`), nie produkt no-fuss. */
const AION_ORG_ID = ids.externalOrganization(aionMind.employer.url);
/** „W liczbach” bez placeholderów `[…]`; poniżej `MIN_CASE_NUMBERS` sekcji nie ma. */
const numbers = publishedNumbers(aionMindNumbers);

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(aionMind),
  images: [
    {
      url: aionMind.cover.src,
      width: aionMind.cover.width,
      height: aionMind.cover.height,
      alt: aionMind.cover.alt,
    },
  ],
});

export default function AionMindPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: aionMind.title, path: PATH }]),
          {
            ...creativeWork({
              path: PATH,
              name: aionMind.title,
              description: caseDescription(aionMind),
              datePublished: aionMind.datePublished,
              image: aionMind.cover.src,
              url: AION_MIND_URL,
              keywords: ["aplikacja mobilna", "journaling", "AI", "product design"],
              contributors: ["magda"],
            }),
            about: { "@id": softwareAppId(PATH) },
          },
          {
            ...softwareApplication({
              path: PATH,
              name: aionMind.title,
              url: AION_MIND_URL,
              description: aionMindAppDescription,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "iOS, Android, Web",
              image: aionMind.cover.src,
              installUrl: [aionMindStores.appStore, aionMindStores.googlePlay],
              contributors: ["magda"],
            }),
            publisher: { "@id": AION_ORG_ID },
          },
          /* Etat Magdy: AION MIND zatrudnia Magdę (Head of Operations), no-fuss nie jest twórcą aplikacji. */
          {
            "@type": "Organization",
            "@id": AION_ORG_ID,
            name: aionMind.employer.name,
            url: aionMind.employer.url,
            employee: { "@id": ids.person(aionMind.employer.employee) },
          },
        )}
      />

      <CaseStudyLayout
        hero={{
          kicker: aionMind.kicker,
          title: aionMind.title,
          lead: aionMind.lead,
          summary: aionMind.summary,
          facts: aionMind.facts,
          datePublished: aionMind.datePublished,
        }}
        cta={{
          tone: "light",
          text: "Jako no-fuss projektujemy i kodujemy takie produkty dla klientów, od pierwszego ekranu do wydania.",
        }}
        next={{ href: aionMind.next, title: "Busy Bee", arrow: "→" }}
      >
        <CaseStage variant="image" image={aionMindImages.og} />

        <CaseStudySection label="01 / Problem">
          <CaseProse
            variant="quote"
            lines={[
              "„Mam mętlik i nie wiem,",
              <>
                od czego <Mark>zacząć</Mark>.”
              </>,
            ]}
            paragraphIndex={3}
            paragraphs={[
              "Czat z AI zaczyna każdą rozmowę od zera i wymaga, żebyś sam wiedział, jak go poprowadzić. W pracy nad sobą to nie działa: liczy się historia, wzorce i ciągłość.",
            ]}
          />
        </CaseStudySection>

        <CaseStudySection label="02 / Kierunek" tone="dark">
          <CaseProse
            lines={["Kontekst,", "nie czat"]}
            paragraphIndex={3}
            paragraphs={[
              "Każdy wpis i każda rozmowa budują kontekst, do którego aplikacja wraca w kolejnych sesjach. Wartość rośnie z czasem, zamiast znikać po pierwszym entuzjazmie. Użytkownik nic nie podpina ręcznie.",
            ]}
          />
        </CaseStudySection>

        <CaseStudySection
          layout="split"
          label="03.1 / Dziennik"
          text={
            <CaseProse
              lines={["Dziennik,", "który podsumowuje"]}
              paragraphs={[
                "Kalendarz pokazuje ciągłość wpisów. Tydzień i miesiąc zamykają się podsumowaniem: co było ważne, co wracało, co warto zmienić.",
              ]}
            />
          }
          visual={
            <figure>
              <Fade index={1}>
                <JournalScreen />
              </Fade>
              <TileCaption>
                Ekran Dziennika odtworzony w&nbsp;HTML na podstawie ekranu z&nbsp;aionmind.com. Klikaj dni i&nbsp;karty.
              </TileCaption>
            </figure>
          }
        />

        <CaseStudySection
          layout="split"
          flip
          tone="dark"
          label="03.2 / Amfiteatr Wiedzy"
          text={
            <CaseProse
              lines={["Kontekst", "ma miejsce"]}
              paragraphs={[
                "Zebrana wiedza o użytkowniku nie jest ukryta w modelu. Ma swoje miejsce, postęp i podział: tożsamość, wizja i cel, wewnętrzne zasoby i blokady. Do każdej części można wrócić i ją poprawić.",
              ]}
            />
          }
          visual={
            <figure>
              <Fade index={1} className={styles.one}>
                <Image
                  className={styles.img}
                  src={aionMindImages.context.src}
                  alt={aionMindImages.context.alt}
                  width={aionMindImages.context.width}
                  height={aionMindImages.context.height}
                  sizes="320px"
                />
              </Fade>
              <TileCaption>Ekran Amfiteatru Wiedzy z&nbsp;zebranym kontekstem.</TileCaption>
            </figure>
          }
        />

        <CaseStrip label="03.3 / Przewodnicy" aside="5 ról zamiast jednego bota">
          <GuideCards guides={aionMindGuides} />
        </CaseStrip>

        <CaseStudySection label="04 / Rola" tone="dark">
          <CaseProse
            lines={["Od ekranu do całości"]}
            spaced
            paragraphs={[
              "Magda zaprojektowała AION MIND od pierwszego ekranu. Potem przejęła operacje: dziś odpowiada za produkt i zespół, nie tylko za to, jak wygląda.",
            ]}
          >
            <RolePath stages={aionMindPath} index={3} />
          </CaseProse>
        </CaseStudySection>

        {numbers.length >= MIN_CASE_NUMBERS ? (
          <CaseStrip label="05 / W liczbach" aside="Stan: wrzesień 2026">
            <CaseNumbers items={numbers} />
          </CaseStrip>
        ) : null}

        <CaseStudySection label="06 / Głos użytkownika" tone="dark">
          <VisuallyHidden as="h2">Głos użytkownika</VisuallyHidden>
          <figure>
            <blockquote>
              <CaseBigLine reveal="line">„Apka robi to sama.”</CaseBigLine>
            </blockquote>
            <Fade as="figcaption" index={2} className={styles.cite}>
              Marcin Świder, użytkownik · opinia z&nbsp;aionmind.com
            </Fade>
          </figure>
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
