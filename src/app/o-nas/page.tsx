import { CopyEmail } from "@/components/molecules/CopyEmail";
import { FindSection, findCopyClassName } from "@/components/organisms/FindSection";
import { Marquee } from "@/components/organisms/Marquee";
import { PageHero } from "@/components/organisms/PageHero";
import { RolesSplit } from "@/components/organisms/RolesSplit";
import { StickerBoard } from "@/components/organisms/StickerBoard";
import { TeamSheets } from "@/components/organisms/TeamSheets";
import { aboutHero, findUs, marqueeItems, publishedEventsTeaser, publishedLinkedinPosts } from "@/content/about";
import { todayIso } from "@/content/events";
import { people, site } from "@/content/site";
import { JsonLd, breadcrumb, graph, ids, type JsonLdNode } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

const PATH = "/o-nas";

/* Tytuł z routes.ts, opis = site.shortDescription (1:1 z meta o-nas-v5). */
export const metadata = buildMetadata({ path: PATH });

/** Zajawka `#wydarzenia` pokazuje nadchodzące wydarzenia wg dzisiejszej daty: odświeżanie co godzinę (ISR). */
export const revalidate = 3600;

/** Węzeł `AboutPage`; Organization i Person są w layoucie, tu tylko odwołania `@id`. */
function aboutPage(): JsonLdNode {
  return {
    "@type": "AboutPage",
    "@id": `${absoluteUrl(PATH)}#webpage`,
    url: absoluteUrl(PATH),
    name: "O nas",
    description: site.shortDescription,
    inLanguage: "pl-PL",
    isPartOf: { "@id": ids.website },
    breadcrumb: { "@id": ids.breadcrumb(PATH) },
    mainEntity: { "@id": ids.organization },
    about: { "@id": ids.organization },
    mentions: people.map((p) => ({ "@id": ids.person(p.id) })),
  };
}

/**
 * `/o-nas` 1:1 z legacy/o-nas-v5.html + CTA kontaktu (pod leadem hero i pod „Kto co robi”) + zajawka
 * `#wydarzenia` (link do `/wiedza`, jedno z wejść na telefonie).
 * Zajawka ma tonację przeciwną do sekcji nad nią (`#posty` ciemne albo `#social` jasne). Server Component.
 */
export default function AboutPage() {
  const posts = publishedLinkedinPosts();
  return (
    <>
      <JsonLd data={graph(breadcrumb(PATH, [{ name: "O nas", path: PATH }]), aboutPage())} />
      <PageHero lines={aboutHero.lines} lead={aboutHero.lead} cta />
      <TeamSheets />
      <Marquee items={marqueeItems} />
      <RolesSplit />
      <FindSection
        {...findUs}
        extra={<CopyEmail email={site.contact.email} className={findCopyClassName} />}
      />
      {posts ? <FindSection {...posts} tone="dark" /> : null}
      <FindSection {...publishedEventsTeaser(todayIso())} tone={posts ? "light" : "dark"} />
      <StickerBoard />
    </>
  );
}
