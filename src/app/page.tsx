import HomeHero from "@/components/organisms/HomeHero";
import { AboutSection } from "@/components/organisms/AboutSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { ProcessSection } from "@/components/organisms/ProcessSection";
import { ServicesList } from "@/components/organisms/ServicesList";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { WorkGrid } from "@/components/organisms/WorkGrid";
import { faqSection, publishedFaq } from "@/content/faq";
import { homeGraphNodes } from "@/content/home-jsonld";
import { processSection } from "@/content/process";
import { JsonLd, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ path: "/" });

/**
 * Strona główna (źródło: `legacy/no-fuss-v5.html`) w kolejności pod klientów usługowych:
 * hero (h1 + CTA), usługi (+ CTA), jak pracujemy, realizacje, o nas, opinie (renderują się
 * dopiero z prawdziwymi opiniami), FAQ (+ CTA). Stopka `#kontakt` jest w layoucie.
 * Tonacje: ciemna, jasna, jasna, ciemna, jasna, (ciemna), jasna, stopka ciemna. Server Component.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ServicesList />
      <ProcessSection
        id="proces"
        label={processSection.label}
        counter={processSection.counter}
        steps={processSection.steps}
      />
      <WorkGrid />
      <AboutSection />
      <TestimonialsSection />
      <FaqSection id="faq" label={faqSection.label} items={publishedFaq()} more={faqSection.more} />
      <JsonLd data={graph(...homeGraphNodes())} />
    </>
  );
}
