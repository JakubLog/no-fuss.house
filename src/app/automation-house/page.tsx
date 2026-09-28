import { Fade } from "@/components/atoms/Fade";
import { CaseStory } from "@/components/organisms/CaseStory";
import { LiveFrame } from "@/components/organisms/LiveFrame";
import { PhoneScroller } from "@/components/organisms/PhoneScroller";
import { ProcessSteps } from "@/components/organisms/ProcessSteps";
import { SpecList } from "@/components/organisms/SpecList";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import {
  AUTOMATION_HOUSE_URL,
  automationHouse,
  automationHouseLive,
  automationHouseNext,
  automationHousePhone,
  automationHouseSpec,
  automationHouseSteps,
} from "@/content/cases/automation-house";
import { JsonLd, breadcrumb, creativeWork, graph, ids } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { caseDescription } from "@/content/cases";

const PATH = automationHouse.path;
const cover = automationHouse.cover;
/** Automation House by Tigers jako organizacja (pracodawca Kuby z `automationHouse.employer`), nie klient no-fuss. */
const AH_ORG_ID = ids.externalOrganization(automationHouse.employer.url);

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(automationHouse),
  images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
});

export default function AutomationHousePage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: automationHouse.title, path: PATH }]),
          creativeWork({
            path: PATH,
            name: automationHouse.title,
            description: caseDescription(automationHouse),
            about: automationHouse.about,
            datePublished: automationHouse.datePublished,
            image: cover.src,
            url: AUTOMATION_HOUSE_URL,
            keywords: ["Rebranding strony", "Next.js"],
            /* Kod: Kuba (etat), design: Magda. */
            contributors: ["kuba", "magda"],
          }),
          {
            "@type": "WebSite",
            "@id": `${AUTOMATION_HOUSE_URL}/#website`,
            url: AUTOMATION_HOUSE_URL,
            name: "Automation House",
            publisher: { "@id": AH_ORG_ID },
            subjectOf: { "@id": ids.creativeWork(PATH) },
          },
          /* Etat Kuby: Automation House by Tigers zatrudnia Kubę; to pracodawca, nie klient no-fuss. */
          {
            "@type": "Organization",
            "@id": AH_ORG_ID,
            name: automationHouse.employer.name,
            url: automationHouse.employer.url,
            address: "Warszawa",
            employee: { "@id": ids.person(automationHouse.employer.employee) },
          },
        )}
      />
      <CaseStudyLayout
        hero={{
          kicker: automationHouse.kicker,
          title: automationHouse.title,
          summary: automationHouse.summary,
          ownership: automationHouse.ownership,
          facts: automationHouse.facts,
          datePublished: automationHouse.datePublished,
        }}
        cta={{ tone: "dark" }}
        next={automationHouseNext}
      >
        <LiveFrame {...automationHouseLive} />

        <CaseStudySection layout="lite" tone="dark" label="01 / W skrócie">
          <CaseStory story={automationHouse.story} />
        </CaseStudySection>

        <CaseStudySection layout="lite" label="02 / Proces" hint="Rebranding · najedź na krok" hintTouch="Rebranding">
          <ProcessSteps steps={automationHouseSteps} ariaLabel="Rebranding" />
        </CaseStudySection>

        <CaseStudySection layout="lite" tone="dark" label="03 / Mobile" hint="Przewiń ekran telefonu">
          <Fade index={2}>
            <PhoneScroller {...automationHousePhone} />
          </Fade>
        </CaseStudySection>

        <CaseStudySection layout="lite" label="04 / Fakty">
          <SpecList items={automationHouseSpec} />
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
