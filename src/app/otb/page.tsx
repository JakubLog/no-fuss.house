import { Fade } from "@/components/atoms/Fade";
import { CaseStory } from "@/components/organisms/CaseStory";
import { DragBall } from "@/components/organisms/DragBall";
import { LiveFrame } from "@/components/organisms/LiveFrame";
import { PhoneScroller } from "@/components/organisms/PhoneScroller";
import { SpecList } from "@/components/organisms/SpecList";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import { OTB_URL, otb, otbBall, otbLive, otbNext, otbPhone, otbSpec } from "@/content/cases/otb";
import { JsonLd, breadcrumb, creativeWork, graph, ids } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { caseDescription, publishedSpec } from "@/content/cases";
import styles from "./page.module.css";

const PATH = otb.path;
const cover = otb.cover;

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(otb),
  images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
});

export default function OtbPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: otb.title, path: PATH }]),
          creativeWork({
            path: PATH,
            name: otb.title,
            description: caseDescription(otb),
            about: otb.about,
            datePublished: otb.datePublished,
            image: cover.src,
            url: OTB_URL,
            keywords: ["Strona funduszu VC", "WordPress"],
            contributors: ["magda"],
          }),
          {
            "@type": "WebSite",
            "@id": `${OTB_URL}/#website`,
            url: OTB_URL,
            name: "OTB Ventures",
            publisher: { "@type": "Organization", name: "OTB Ventures", address: "Amsterdam / Warszawa" },
            subjectOf: { "@id": ids.creativeWork(PATH) },
          },
        )}
      />
      <CaseStudyLayout
        hero={{ kicker: otb.kicker, title: otb.title, summary: otb.summary, ownership: otb.ownership, facts: otb.facts, datePublished: otb.datePublished }}
        cta={{ tone: "dark" }}
        next={otbNext}
      >
        <LiveFrame {...otbLive} />

        <CaseStudySection layout="lite" tone="dark" className={styles.csLite} label="01 / W skrócie">
          <CaseStory story={otb.story} />
        </CaseStudySection>

        <CaseStudySection layout="lite" className={styles.csLite} label="02 / Hero" hint="Przeciągnij kulę">
          <Fade index={2}>
            <DragBall {...otbBall} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection
          layout="lite"
          tone="dark"
          className={styles.csLite}
          label="03 / Mobile"
          hint="Przewiń ekran telefonu"
        >
          <Fade index={2}>
            <PhoneScroller {...otbPhone} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" className={styles.csLite} label="04 / Fakty">
          <SpecList items={publishedSpec(otbSpec)} />
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
