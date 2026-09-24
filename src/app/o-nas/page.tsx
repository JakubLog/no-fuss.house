import { CopyEmail } from "@/components/molecules/CopyEmail";
import { FindSection, findCopyClassName } from "@/components/organisms/FindSection";
import { Marquee } from "@/components/organisms/Marquee";
import { RolesSplit } from "@/components/organisms/RolesSplit";
import { StickerBoard } from "@/components/organisms/StickerBoard";
import { TeamHero } from "@/components/organisms/TeamHero";
import { TeamSheets } from "@/components/organisms/TeamSheets";
import { findUs, marqueeItems, publishedLinkedinPosts } from "@/content/about";
import { getRoute } from "@/content/routes";
import { people, site } from "@/content/site";
import { JsonLd, breadcrumb, graph, ids, type JsonLdNode } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

const PATH = "/o-nas";

/* Tytuł z routes.ts („O NAS”), opis = site.shortDescription (1:1 z meta o-nas-v5). */
export const metadata = buildMetadata({ path: PATH });

/** Węzeł `AboutPage`; Organization i Person są w layoucie, tu tylko odwołania `@id`. */
function aboutPage(): JsonLdNode {
  return {
    "@type": "AboutPage",
    "@id": `${absoluteUrl(PATH)}#webpage`,
    url: absoluteUrl(PATH),
    name: getRoute(PATH)?.title ?? "O nas",
    description: site.shortDescription,
    inLanguage: "pl-PL",
    isPartOf: { "@id": ids.website },
    breadcrumb: { "@id": ids.breadcrumb(PATH) },
    mainEntity: { "@id": ids.organization },
    about: { "@id": ids.organization },
    mentions: people.map((p) => ({ "@id": ids.person(p.id) })),
  };
}

/** `/o-nas` 1:1 z legacy/o-nas-v5.html. Server Component. */
export default function AboutPage() {
  const posts = publishedLinkedinPosts();
  return (
    <>
      <JsonLd data={graph(breadcrumb(PATH, [{ name: "O nas", path: PATH }]), aboutPage())} />
      <TeamHero />
      <TeamSheets />
      <Marquee items={marqueeItems} />
      <RolesSplit />
      <FindSection
        {...findUs}
        extra={<CopyEmail email={site.contact.email} className={findCopyClassName} />}
      />
      {posts ? <FindSection {...posts} tone="dark" /> : null}
      <StickerBoard />
    </>
  );
}
