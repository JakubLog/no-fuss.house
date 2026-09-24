import { absoluteUrl, ids, type JsonLdNode, type JsonValue } from "@/lib/seo";

/**
 * Węzeł `SoftwareApplication` dla case study produktu własnego, powiązany przez `@id`
 * z `CreativeWork` strony (`subjectOf`) i z Organization (`creator`).
 * Leży w `content/`, bo `src/lib/seo` jest kontraktem współdzielonym (tylko do odczytu).
 */

export interface SoftwareAppInput {
  /** Ścieżka case study, np. `/ourmoney`. */
  path: string;
  name: string;
  /** Adres produktu (z `products` w `site.ts`). */
  url: string;
  /** Kategoria schema.org, np. `FinanceApplication`. */
  applicationCategory: string;
  /** Tylko to, co wynika z copy (np. „iOS, Android, Web”). */
  operatingSystem: string;
  description?: string;
  /** Ścieżka obrazu w `public/`. */
  image?: string;
  /** Linki do sklepów. */
  installUrl?: readonly string[];
  offers?: readonly { price: string; priceCurrency: string; name: string }[];
  /** `true`: twórcą jest no-fuss (Organization). `false`: tylko wkład osób. */
  ownProduct?: boolean;
  /** Osoby z wkładem (`id` z `people`). */
  contributors?: readonly ("magda" | "kuba")[];
}

/** `@id` aplikacji: `https://…/ourmoney#app`. */
export const softwareAppId = (path: string) => `${absoluteUrl(path)}#app`;

const ref = (id: string) => ({ "@id": id });

export function softwareApplication(input: SoftwareAppInput): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "SoftwareApplication",
    "@id": softwareAppId(input.path),
    name: input.name,
    url: input.url,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem,
    inLanguage: "pl-PL",
    subjectOf: ref(ids.creativeWork(input.path)),
  };
  if (input.description) node.description = input.description;
  if (input.image) node.image = absoluteUrl(input.image);
  if (input.installUrl?.length) node.installUrl = [...input.installUrl];
  if (input.ownProduct) node.creator = ref(ids.organization);
  if (input.contributors?.length) {
    node.contributor = input.contributors.map((id): JsonValue => ref(ids.person(id)));
  }
  if (input.offers?.length) {
    node.offers = input.offers.map(
      (o): JsonValue => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: o.priceCurrency }),
    );
  }
  return node;
}
