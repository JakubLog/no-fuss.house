import HomeHero from "@/components/organisms/HomeHero";
import { AboutSection } from "@/components/organisms/AboutSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { KnowledgeTeaser } from "@/components/organisms/KnowledgeTeaser";
import { ProcessSection } from "@/components/organisms/ProcessSection";
import { ServicesList } from "@/components/organisms/ServicesList";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { WorkGrid } from "@/components/organisms/WorkGrid";
import { events, knowledgeTeaser, teaserEvents, todayIso } from "@/content/events";
import { faqSection, publishedFaq } from "@/content/faq";
import { homeGraphNodes } from "@/content/home-jsonld";
import { processSection } from "@/content/process";
import { JsonLd, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ path: "/" });

/** Zajawka `#wiedza` dzieli wydarzenia wg dzisiejszej daty: odświeżanie co godzinę (ISR). */
export const revalidate = 3600;

/**
 * Strona główna (źródło: `legacy/no-fuss-v5.html`) w kolejności pod klientów usługowych:
 * hero (h1 + CTA), usługi (+ CTA), jak pracujemy, realizacje, o nas, zajawka „Wiedza” (`/wiedza`),
 * opinie (renderują się dopiero z prawdziwymi opiniami), FAQ, stopka `#kontakt` z layoutu.
 * Tonacje: ciemna, jasna, jasna, ciemna, jasna, ciemna, (ciemna), jasna, stopka ciemna. Server Component.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ServicesList />
      <ProcessSection id="proces" label={processSection.label} steps={processSection.steps} />
      <WorkGrid />
      <AboutSection />
      <KnowledgeTeaser
        id={knowledgeTeaser.id}
        label={knowledgeTeaser.label}
        title={knowledgeTeaser.title}
        more={knowledgeTeaser.more}
        items={teaserEvents(events, todayIso(), knowledgeTeaser.limit)}
      />
      <TestimonialsSection />
      <FaqSection id="faq" label={faqSection.label} items={publishedFaq()} more={faqSection.more} />
      <JsonLd data={graph(...homeGraphNodes())} />
    </>
  );
}
