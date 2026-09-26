import { personCards } from "@/content/about";
import { people, site, isPlaceholder } from "@/content/site";
import type { FaqItem, Person, SocialLink } from "@/content/types";
import { absoluteUrl } from "./site-url";

/**
 * JSON-LD (schema.org) dla SEO i AEO.
 *
 * Encje łączą się przez `@id` w jednym `@graph`:
 *   Organization ← founder/member → Person
 *   WebSite.publisher → Organization
 *   CreativeWork.creator → Organization, CreativeWork.isPartOf → WebSite
 *
 * Layout renderuje Organization + WebSite + Person. Strony dokładają swoje węzły
 * (BreadcrumbList, CreativeWork, FAQPage) i odwołują się do `ids.*`.
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface JsonLdNode {
  "@type": string | string[];
  "@id"?: string;
  [key: string]: JsonValue | undefined;
}

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

/** Stabilne identyfikatory encji (absolutne URL-e z fragmentem). */
export const ids = {
  organization: absoluteUrl("/#organization"),
  website: absoluteUrl("/#website"),
  logo: absoluteUrl("/#logo"),
  person: (id: Person["id"]) => absoluteUrl(`/o-nas#${id}`),
  breadcrumb: (path: string) => `${absoluteUrl(path)}#breadcrumb`,
  creativeWork: (path: string) => `${absoluteUrl(path)}#work`,
  faq: (path: string) => `${absoluteUrl(path)}#faq`,
  /** Organizacja spoza no-fuss (pracodawca z `CaseStudy.employer`, strona case'u), np. `https://aionmind.com/#organization`. */
  externalOrganization: (url: string) => `${url.replace(/\/$/, "")}/#organization`,
} as const;

const ref = (id: string): { "@id": string } => ({ "@id": id });

/** Tylko prawdziwe linki (bez placeholderów `#` / `[…]`). */
function realLinks(links: readonly SocialLink[]): string[] {
  return links.flatMap((l) => (l.href && !isPlaceholder(l.href) ? [l.href] : []));
}

/** Usuwa klucze z `undefined`, żeby JSON był czysty. */
function clean(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
  ) as JsonLdNode;
}

export function organization(): JsonLdNode {
  const sameAs = realLinks(site.social);
  return clean({
    "@type": "Organization",
    "@id": ids.organization,
    name: site.name,
    alternateName: site.wordmark,
    url: absoluteUrl("/"),
    description: site.description,
    slogan: site.slogan,
    logo: {
      "@type": "ImageObject",
      "@id": ids.logo,
      url: absoluteUrl("/icon/512"),
      width: 512,
      height: 512,
      caption: site.name,
    },
    image: ref(ids.logo),
    email: isPlaceholder(site.contact.email) ? undefined : site.contact.email,
    founder: people.map((p) => ref(ids.person(p.id))),
    member: people.map((p) => ref(ids.person(p.id))),
    sameAs,
  });
}

export function website(): JsonLdNode {
  return clean({
    "@type": "WebSite",
    "@id": ids.website,
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    inLanguage: "pl-PL",
    publisher: ref(ids.organization),
  });
}

export function person(p: Person): JsonLdNode {
  const photo = personCards[p.id].photo;
  return clean({
    "@type": "Person",
    "@id": ids.person(p.id),
    name: p.name,
    givenName: p.givenName,
    familyName: p.familyName,
    jobTitle: p.jobTitle,
    description: p.role,
    knowsAbout: [...p.knowsAbout],
    url: absoluteUrl("/o-nas"),
    image: photo ? absoluteUrl(photo.src) : undefined,
    worksFor: ref(ids.organization),
    memberOf: ref(ids.organization),
    sameAs: realLinks(p.social),
  });
}

export interface BreadcrumbItem {
  name: string;
  /** Ścieżka wewnętrzna, np. `/o-nas`. */
  path: string;
}

/**
 * Okruszki. Pierwszy element (strona główna) dodawany automatycznie.
 * `breadcrumb("/otb", [{ name: "OTB Ventures", path: "/otb" }])`
 */
export function breadcrumb(path: string, items: readonly BreadcrumbItem[]): JsonLdNode {
  const all: BreadcrumbItem[] = [{ name: site.name, path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    "@id": ids.breadcrumb(path),
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface CreativeWorkInput {
  /** Ścieżka case study, np. `/otb`. */
  path: string;
  name: string;
  description?: string;
  /** Temat / dziedzina projektu. */
  about?: string;
  /** ISO 8601, np. `2025-06`. */
  datePublished?: string;
  /** Ścieżka obrazu w `public/` albo absolutny URL. */
  image?: string;
  /** Link do działającego produktu / strony klienta (trafia do `about.url`, nie do `sameAs`). */
  url?: string;
  keywords?: readonly string[];
  /** Osoby z wkładem (`id` z `people`). Domyślnie obie; podawaj zgodnie z faktami case'u. */
  contributors?: readonly Person["id"][];
}

export function creativeWork({
  path,
  name,
  description,
  about,
  datePublished,
  image,
  url,
  keywords,
  contributors = people.map((p) => p.id),
}: CreativeWorkInput): JsonLdNode {
  return clean({
    "@type": "CreativeWork",
    "@id": ids.creativeWork(path),
    name,
    description,
    /* `sameAs` oznacza „ta sama encja”: case study nie jest stroną klienta, więc jej adres idzie do `about`. */
    about: about ? { "@type": "Thing", name: about, ...(url ? { url } : {}) } : undefined,
    url: absoluteUrl(path),
    image: image ? absoluteUrl(image) : undefined,
    datePublished,
    inLanguage: "pl-PL",
    keywords: keywords ? [...keywords] : undefined,
    creator: ref(ids.organization),
    contributor: contributors.map((id) => ref(ids.person(id))),
    isPartOf: ref(ids.website),
    mainEntityOfPage: absoluteUrl(path),
  });
}

export function faq(path: string, items: readonly FaqItem[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": ids.faq(path),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Składa węzły w jeden dokument `@graph`. */
export function graph(...nodes: JsonLdNode[]): JsonLdGraph {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Węzły globalne renderowane w `app/layout.tsx`. */
export function siteGraph(): JsonLdGraph {
  return graph(organization(), website(), ...people.map(person));
}

/** Serializacja bezpieczna dla `<script>` (escapuje `<`, żeby nie zamknąć tagu). */
export function serializeJsonLd(data: JsonLdGraph | JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export interface JsonLdProps {
  data: JsonLdGraph | JsonLdNode;
  /** Opcjonalny `id` elementu script (np. do testów). */
  id?: string;
}

/**
 * `<JsonLd data={graph(breadcrumb(...), creativeWork(...))} />`
 * Server Component. Można użyć wielokrotnie na stronie.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Treść pochodzi z naszych danych i jest escapowana w serializeJsonLd.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
