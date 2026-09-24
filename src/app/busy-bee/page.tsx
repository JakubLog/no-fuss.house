import { Fade } from "@/components/atoms/Fade";
import { CaseStory } from "@/components/organisms/CaseStory";
import { FilmStrip } from "@/components/organisms/FilmStrip";
import { LiveFrame } from "@/components/organisms/LiveFrame";
import { PhoneScroller } from "@/components/organisms/PhoneScroller";
import { SpecList } from "@/components/organisms/SpecList";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import {
  BUSYBEE_URL,
  busybee,
  busybeeLive,
  busybeeNext,
  busybeePhone,
  busybeeSpec,
  busybeeStories,
  busybeeStoriesCaption,
} from "@/content/cases/busybee";
import { JsonLd, breadcrumb, creativeWork, graph, ids } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { caseDescription } from "@/content/cases";

const PATH = busybee.path;

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(busybee),
  images: [{ url: busybee.cover.src, width: busybee.cover.width, height: busybee.cover.height, alt: busybee.cover.alt }],
});

export default function BusyBeePage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: busybee.title, path: PATH }]),
          creativeWork({
            path: PATH,
            name: busybee.title,
            description: caseDescription(busybee),
            about: busybee.about,
            datePublished: busybee.datePublished,
            image: busybee.cover.src,
            url: BUSYBEE_URL,
            keywords: [busybee.kind, "Webflow"],
            contributors: ["magda"],
          }),
          /* Strona klienta jako osobny węzeł (creativeWork ma tylko `about` jako Thing). */
          {
            "@type": "WebSite",
            "@id": `${BUSYBEE_URL}/#website`,
            url: BUSYBEE_URL,
            name: "Busy Bee Film",
            publisher: { "@type": "Organization", name: "Busy Bee Film", address: "Warszawa" },
            subjectOf: { "@id": ids.creativeWork(PATH) },
          },
        )}
      />
      <CaseStudyLayout
        hero={{
          kicker: busybee.kicker,
          title: busybee.title,
          summary: busybee.summary,
          facts: busybee.facts,
          datePublished: busybee.datePublished,
        }}
        cta={{ tone: "dark" }}
        next={busybeeNext}
      >
        <LiveFrame {...busybeeLive} />

        <CaseStudySection layout="lite" tone="dark" label="01 / W skrócie">
          <CaseStory story={busybee.story} />
        </CaseStudySection>

        <CaseStudySection layout="lite" bleed label={busybeeStoriesCaption.label} hint={busybeeStoriesCaption.hint}>
          <Fade index={2}>
            <FilmStrip frames={busybeeStories} ariaLabel={busybeeStoriesCaption.ariaLabel} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" tone="dark" label="03 / Mobile" hint="Przewiń ekran telefonu">
          <Fade index={2}>
            <PhoneScroller {...busybeePhone} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" label="04 / Fakty">
          <SpecList items={busybeeSpec} />
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
