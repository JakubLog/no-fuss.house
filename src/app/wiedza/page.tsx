import { ArrowLink } from "@/components/atoms/ArrowLink";
import { EventsSection } from "@/components/organisms/EventsSection";
import { PageHero } from "@/components/organisms/PageHero";
import {
  events,
  eventsDescription,
  eventsHero,
  pastSection,
  splitEvents,
  todayIso,
  upcomingSection,
} from "@/content/events";
import { eventsGraphNodes } from "@/content/events-jsonld";
import { JsonLd, breadcrumb, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/wiedza";

export const metadata = buildMetadata({ path: PATH, description: eventsDescription });

/** Podział na nadchodzące i minione zależy od dzisiejszej daty: strona odświeża się co godzinę (ISR). */
export const revalidate = 3600;

/**
 * `/wiedza` (zakładka „Wiedza”): hero, nadchodzące wydarzenia (ciemna, z zaproszeniem do `#kontakt`), minione ze zdjęciami
 * (jasna), stopka z layoutu. Server Component.
 */
export default function EventsPage() {
  const { upcoming, past } = splitEvents(events, todayIso());
  return (
    <>
      <JsonLd data={graph(breadcrumb(PATH, [{ name: "Wiedza", path: PATH }]), ...eventsGraphNodes())} />
      <PageHero lines={eventsHero.lines} lead={eventsHero.lead} />
      <EventsSection
        id={upcomingSection.id}
        label={upcomingSection.label}
        events={upcoming}
        variant="upcoming"
        tone="dark"
        empty={upcomingSection.empty}
        footer={
          <p>
            {upcomingSection.invite.text}{" "}
            <ArrowLink href="#kontakt" variant="underline">
              {upcomingSection.invite.link}
            </ArrowLink>
          </p>
        }
      />
      <EventsSection id={pastSection.id} label={pastSection.label} events={past} variant="past" />
    </>
  );
}
