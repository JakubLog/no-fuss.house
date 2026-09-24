import { faq, ids, type JsonLdNode, type JsonValue } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/site-url";
import { getCase } from "./cases";
import { publishedFaq } from "./faq";
import { publishedTestimonials, servicesSection, work } from "./home";

/**
 * Węzły JSON-LD strony głównej (dokładane do `@graph` obok globalnych z layoutu).
 * Łączą się z Organization / WebSite przez `@id` z `@/lib/seo/jsonld`.
 */

/** Twarde spacje z copy UI zamieniamy na zwykłe (czystszy tekst dla crawlerów). */
const plain = (text: string): string => text.replace(/ /g, " ");

const orgRef = { "@id": ids.organization };

/**
 * Autorstwo pozycji wg `CaseStudy.ownership`: projekty własne i klientów → `creator` = no-fuss;
 * etat (`employment`, AION MIND) → `creator` = pracodawca, `contributor` = zatrudniona osoba.
 */
function authorship(href: string): { [key: string]: JsonValue } {
  const c = getCase(href);
  if (c?.ownership === "employment" && c.employer) {
    const { name, url, employee } = c.employer;
    return {
      creator: { "@type": "Organization", "@id": ids.externalOrganization(url), name, url },
      contributor: { "@id": ids.person(employee) },
    };
  }
  return { creator: orgRef };
}

/** `ItemList` realizacji; pozycje to `CreativeWork` z `@id` jak na stronach case study. */
export function workItemList(): JsonLdNode {
  return {
    "@type": "ItemList",
    "@id": absoluteUrl("/#realizacje"),
    name: work.label,
    numberOfItems: work.tiles.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: work.tiles.map((tile, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        "@id": ids.creativeWork(tile.href),
        name: tile.name,
        alternativeHeadline: plain(tile.title),
        genre: tile.kind,
        url: absoluteUrl(tile.href),
        image: absoluteUrl(tile.cover.src),
        temporalCoverage: tile.years.replace("–", "/"),
        ...authorship(tile.href),
      },
    })),
  };
}

/** Katalog usług: `OfferCatalog` z ofertami `Service` (nazwa i opis 1:1 z sekcji). */
export function servicesCatalog(): JsonLdNode {
  return {
    "@type": "OfferCatalog",
    "@id": absoluteUrl("/#uslugi"),
    name: servicesSection.label,
    itemListElement: servicesSection.items.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": absoluteUrl(`/#usluga-${service.no}`),
        name: plain(service.name),
        description: plain(service.description),
        provider: orgRef,
      },
    })),
  };
}

/**
 * Opinie jako `Review` tylko wtedy, gdy autor, rola i treść są prawdziwe.
 * Dopóki w danych są placeholdery `[…]`, zwraca pustą tablicę.
 */
export function reviews(): JsonLdNode[] {
  return publishedTestimonials().map((t) => ({
    "@type": "Review",
    reviewBody: plain(t.quote),
    author: { "@type": "Person", name: plain(t.author), description: plain(t.role) },
    itemReviewed: orgRef,
  }));
}

/**
 * `FAQPage` (`@id` = `/#faq`, jak kotwica sekcji) z pytań bez placeholderów `[…]`
 * (`publishedFaq()`, te same co na stronie). Bez pytań: pusta tablica.
 */
export function faqPage(): JsonLdNode[] {
  const items = publishedFaq().map((item) => ({ question: plain(item.question), answer: plain(item.answer) }));
  return items.length > 0 ? [faq("/", items)] : [];
}

/** Wszystkie węzły strony głównej. */
export function homeGraphNodes(): JsonLdNode[] {
  return [workItemList(), servicesCatalog(), ...reviews(), ...faqPage()];
}
