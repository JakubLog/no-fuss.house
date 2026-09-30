import { Tally } from "@/components/molecules/Tally";
import { LegalDocument } from "@/components/organisms/LegalDocument";
import { PageHero } from "@/components/organisms/PageHero";
import { privacySummary } from "@/content/legal";
import { privacyPolicy } from "@/content/privacy-policy";
import { JsonLd, breadcrumb, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/polityka-prywatnosci";

export const metadata = buildMetadata({ path: PATH, description: privacyPolicy.description });

/** `/polityka-prywatnosci`: hero, „W skrócie” (paragon) i dokument ze spisem treści. Server Component. */
export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumb(PATH, [{ name: "Polityka prywatności", path: PATH }]))} />
      <PageHero lines={privacyPolicy.hero.lines} lead={privacyPolicy.hero.lead} />
      <LegalDocument
        document={privacyPolicy}
        numbering="index"
        summary={<Tally rows={privacySummary.rows} ariaLabel={privacySummary.label} />}
      />
    </>
  );
}
