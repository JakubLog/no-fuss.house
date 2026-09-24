import { Fade } from "@/components/atoms/Fade";
import { Heading } from "@/components/atoms/Heading";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { CaseStory } from "@/components/organisms/CaseStory";
import { LiveFrame } from "@/components/organisms/LiveFrame";
import { SpecList } from "@/components/organisms/SpecList";
import { ToySwitcher } from "@/components/organisms/ToySwitcher";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import {
  SASSY_URL,
  sassy,
  sassyLive,
  sassyMobile,
  sassyNext,
  sassySpec,
  sassyToys,
  sassyToysTitle,
} from "@/content/cases/sassy";
import { people } from "@/content/site";
import { JsonLd, breadcrumb, creativeWork, graph, ids } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { caseDescription } from "@/content/cases";
import styles from "./page.module.css";

const PATH = sassy.path;
const cover = sassy.cover;
const magda = people.find((p) => p.id === "magda");

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(sassy),
  images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
});

export default function SassyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: sassy.title, path: PATH }]),
          creativeWork({
            path: PATH,
            name: sassy.title,
            description: caseDescription(sassy),
            about: sassy.about,
            datePublished: sassy.datePublished,
            image: cover.src,
            url: SASSY_URL,
            keywords: [sassy.kind, "HTML", "CSS", "JS"],
            contributors: ["magda"],
          }),
          /* Projekt własny Magdy: autorka zamiast klienta. */
          {
            "@type": "WebSite",
            "@id": `${SASSY_URL}/#website`,
            url: SASSY_URL,
            name: sassy.title,
            ...(magda ? { author: { "@id": ids.person(magda.id) } } : {}),
            subjectOf: { "@id": ids.creativeWork(PATH) },
          },
        )}
      />
      <CaseStudyLayout
        hero={{ kicker: sassy.kicker, title: sassy.title, summary: sassy.summary, facts: sassy.facts, datePublished: sassy.datePublished }}
        cta={{ tone: "light" }}
        next={sassyNext}
      >
        <LiveFrame {...sassyLive} load="click" />

        <CaseStudySection layout="lite" className={styles.csLite} label="01 / W skrócie" hint="Eksperyment">
          <CaseStory story={sassy.story} />
        </CaseStudySection>

        <CaseStudySection layout="lite" tone="dark" className={styles.csLite} label="02 / Zabawki" hint="Klikaj listę · ↑ ↓">
          <Heading as="h3" variant="h2" lines={[sassyToysTitle]} />
          <Fade index={2}>
            <ToySwitcher toys={sassyToys} ariaLabel={sassyToysTitle} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" className={styles.csLite} label="03 / Mobile" hint="390 px">
          <Fade index={2} className={styles.duo}>
            {sassyMobile.map((image) => (
              <figure key={image.src} className={styles.phone}>
                <PhoneFrame image={image} sizes="(max-width: 652px) 46vw, 300px" />
              </figure>
            ))}
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" tone="dark" className={styles.csLite} label="04 / Fakty">
          <SpecList variant="tiles" items={sassySpec} />
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
