import { ids, type JsonLdNode, type JsonValue } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/site-url";
import { eventDate, events, eventsDescription, isPublishedEvent, type KnowledgeEvent } from "./events";

/**
 * Węzły JSON-LD `/wiedza`: `CollectionPage` + `Event` dla każdego wydarzenia bez placeholderów
 * (`isPublishedEvent`) z miejscem albo online. Wydarzenie stacjonarne bez `place` zostaje tylko
 * w UI: Google wymaga `location`, a pusty węzeł to błąd w Search Console.
 * Dopóki w danych są same placeholdery, jest tylko `CollectionPage`.
 * Osoby (`performer`) i organizacja łączą się z węzłami z layoutu przez `@id`.
 */

const PATH = "/wiedza";

/** Twarde spacje z copy UI zamieniamy na zwykłe, word joinery usuwamy (czystszy tekst dla crawlerów). */
const plain = (text: string): string => text.replace(/\u00A0/g, " ").replace(/\u2060/g, "");

/** `Event` wymaga `location`: stacjonarne bez `place` pomijamy (zostają w UI). */
const hasLocation = (e: KnowledgeEvent): boolean => Boolean(e.online || e.place);

function eventNode(e: KnowledgeEvent): JsonLdNode {
  const url = absoluteUrl(`${PATH}#${e.id}`);
  const date = eventDate(e);
  const location: JsonValue | null = e.online
    ? { "@type": "VirtualLocation", url: e.link?.href ?? url }
    : e.place
      ? { "@type": "Place", name: e.venue ?? e.place, address: { "@type": "PostalAddress", addressLocality: e.place } }
      : null;
  return {
    "@type": "Event",
    "@id": url,
    name: plain(e.title),
    ...(e.text ? { description: plain(e.text) } : {}),
    startDate: date.iso,
    ...(date.endIso ? { endDate: date.endIso } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: e.online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    ...(location ? { location } : {}),
    ...(e.host ? { organizer: { "@type": "Organization", name: e.host } } : {}),
    performer: e.people.map((id) => ({ "@id": ids.person(id) })),
    inLanguage: "pl-PL",
    url,
    ...(e.photo ? { image: absoluteUrl(e.photo.src) } : {}),
  };
}

/** Wszystkie węzły strony `/wiedza` (bez okruszków, te składa strona). */
export function eventsGraphNodes(): JsonLdNode[] {
  const published = events.filter((e) => isPublishedEvent(e) && hasLocation(e));
  const page: JsonLdNode = {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(PATH)}#webpage`,
    url: absoluteUrl(PATH),
    name: "Wiedza",
    description: eventsDescription,
    inLanguage: "pl-PL",
    isPartOf: { "@id": ids.website },
    breadcrumb: { "@id": ids.breadcrumb(PATH) },
    about: { "@id": ids.organization },
    ...(published.length ? { hasPart: published.map((e) => ({ "@id": absoluteUrl(`${PATH}#${e.id}`) })) } : {}),
  };
  return [page, ...published.map(eventNode)];
}
