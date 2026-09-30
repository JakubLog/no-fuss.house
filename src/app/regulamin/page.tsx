import { LegalDocument } from "@/components/organisms/LegalDocument";
import { PageHero } from "@/components/organisms/PageHero";
import { terms } from "@/content/terms";
import { JsonLd, breadcrumb, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/regulamin";

export const metadata = buildMetadata({ path: PATH, description: terms.description });

/** `/regulamin`: hero i regulamin w paragrafach (§) ze spisem treści. Server Component. */
export default function TermsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumb(PATH, [{ name: "Regulamin", path: PATH }]))} />
      <PageHero lines={terms.hero.lines} lead={terms.hero.lead} />
      <LegalDocument document={terms} numbering="paragraph" />
    </>
  );
}
