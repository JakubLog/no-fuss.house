import Image from "next/image";
import { ArrowLink } from "@/components/atoms/ArrowLink";
import { Fade } from "@/components/atoms/Fade";
import { Mark } from "@/components/atoms/Mark";
import { Tag } from "@/components/atoms/Tag";
import { CaseBigLine, CaseProse } from "@/components/molecules/CaseProse";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { TileCaption } from "@/components/molecules/TileCaption";
import { CaseNumbers } from "@/components/organisms/CaseNumbers";
import { CaseScreens } from "@/components/organisms/CaseScreens";
import { CaseStage } from "@/components/organisms/CaseStage";
import { CaseStrip } from "@/components/organisms/CaseStrip";
import { PairSubscription } from "@/components/organisms/PairSubscription";
import { SplitCalculator } from "@/components/organisms/SplitCalculator";
import { TechStack } from "@/components/organisms/TechStack";
import { CaseStudyLayout, CaseStudySection } from "@/components/templates/CaseStudyLayout";
import { aionMind } from "@/content/cases/aion-mind";
import {
  ourmoney,
  ourmoneyImages,
  ourmoneyNumbers,
  ourmoneyScreens,
  ourmoneyStack,
} from "@/content/cases/ourmoney";
import { softwareApplication, softwareAppId } from "@/content/cases/software-app";
import { products } from "@/content/site";
import { JsonLd, breadcrumb, creativeWork, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { caseDescription } from "@/content/cases";
import styles from "./page.module.css";

const PATH = ourmoney.path;
const product = products[0];

export const metadata = buildMetadata({
  path: PATH,
  type: "article",
  description: caseDescription(ourmoney),
  images: [
    {
      url: ourmoney.cover.src,
      width: ourmoney.cover.width,
      height: ourmoney.cover.height,
      alt: ourmoney.cover.alt,
    },
  ],
});

/* Szerokość wizualizacji w układzie split: 5/12 kolumn od 1024 px. */
const SPLIT_SIZES = "(max-width: 1023px) 100vw, 40vw";

export default function OurMoneyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb(PATH, [{ name: ourmoney.title, path: PATH }]),
          {
            ...creativeWork({
              path: PATH,
              name: ourmoney.title,
              description: ourmoney.lead,
              datePublished: ourmoney.datePublished,
              image: ourmoney.cover.src,
              url: product.url,
              keywords: ["aplikacja mobilna", "wspólny budżet", "finanse par", "product design"],
            }),
            about: { "@id": softwareAppId(PATH) },
          },
          softwareApplication({
            path: PATH,
            name: product.name,
            url: product.url,
            description: ourmoney.lead,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web (PWA)",
            image: ourmoney.cover.src,
            offers: [
              { name: "Subskrypcja miesięczna za parę", price: "24.99", priceCurrency: "PLN" },
              { name: "Subskrypcja roczna za parę", price: "249.99", priceCurrency: "PLN" },
            ],
            ownProduct: true,
            contributors: ["magda", "kuba"],
          }),
        )}
      />

      <CaseStudyLayout
        hero={{
          kicker: ourmoney.kicker,
          title: ourmoney.title,
          lead: ourmoney.lead,
          summary: ourmoney.summary,
          facts: ourmoney.facts,
          datePublished: ourmoney.datePublished,
        }}
        cta={{ tone: "light", text: "OurMoney to nasz własny produkt, a Twój zaprojektujemy i zakodujemy tak samo." }}
        next={{ href: ourmoney.next, title: aionMind.title, arrow: "↗" }}
      >
        <CaseStage variant="phones" images={ourmoneyImages.stage} />

        <CaseStudySection label="01 / Problem">
          <CaseProse
            variant="quote"
            lines={[
              "„Czy ja nie",
              <>
                płacę <Mark>więcej</Mark>?”
              </>,
            ]}
            paragraphIndex={3}
            paragraphs={[
              "Pary z różnymi dochodami liczą wspólne wydatki w Excelu i w głowie. Splitwise jest dla grup znajomych, banki pokazują saldo. Nikt nie pokazuje, czy podział jest sprawiedliwy.",
            ]}
          />
        </CaseStudySection>

        <CaseStudySection label="02 / Kierunek" tone="dark">
          <CaseProse
            lines={["Skalpel,", "nie scyzoryk"]}
            paragraphIndex={3}
            paragraphs={[
              "Nie budujemy kolejnej aplikacji do finansów. Budujemy bezstronnego mediatora: jeden problem, poczucie niesprawiedliwości w codziennych wydatkach, rozwiązany precyzyjnie. Każda funkcja, która temu nie służy, wypada.",
            ]}
          />
        </CaseStudySection>

        <CaseStudySection
          layout="split"
          label="03.1 / Ekran główny"
          text={
            <CaseProse
              lines={["Bez salda"]}
              paragraphs={[
                "Pierwszy ekran nie zaczyna się od stanu konta. Zaczyna się od równowagi: czyja kolej na płacenie i o jaką kwotę, według zasad, które para sama ustaliła.",
              ]}
            />
          }
          visual={
            <figure>
              <Fade index={1} className={styles.one}>
                <PhoneFrame image={ourmoneyImages.home} sizes="320px" />
              </Fade>
              <TileCaption>Ekran główny aplikacji. Na górze nie saldo, tylko czyja kolej i ile.</TileCaption>
            </figure>
          }
        />

        <CaseStudySection
          layout="split"
          flip
          tone="dark"
          label="03.2 / Onboarding"
          text={
            <CaseProse
              lines={["Zasady", "na starcie"]}
              paragraphs={[
                "Model podziału para wybiera w onboardingu, nie w ustawieniach. To serce produktu, nie opcja. Trzy modele: proporcjonalnie do dochodów, po równo albo tylko śledzenie.",
                "Przesuń suwaki. Liczymy tak samo jak aplikacja: najpierw zaokrąglony procent, potem kwota.",
              ]}
            />
          }
          visual={
            <figure>
              <Fade index={1}>
                <SplitCalculator />
              </Fade>
              <Fade index={2} className={styles.raw}>
                <Image
                  className={styles.rawImg}
                  src={ourmoneyImages.rules.src}
                  alt={ourmoneyImages.rules.alt}
                  width={ourmoneyImages.rules.width}
                  height={ourmoneyImages.rules.height}
                  sizes={SPLIT_SIZES}
                />
              </Fade>
              <TileCaption>
                U góry działający kalkulator, niżej „Nasze zasady” w aplikacji. Przy 6 500 i 4 500 zł dochodu oraz
                4 000 zł wydatków: 59% i 2 360 zł.
              </TileCaption>
            </figure>
          }
        />

        <CaseStudySection
          layout="split"
          label="03.3 / Koniec miesiąca"
          text={
            <CaseProse
              lines={["Rytuał", "rozliczenia"]}
              paragraphs={[
                "Jeden przycisk, jedno zdanie, potwierdzenie zeruje saldo. Chodzi o zamknięcie miesiąca z czystą kartą, nie o księgowość.",
              ]}
            />
          }
          visual={
            <>
              <CaseBigLine index={1}>„Anna przelewa Michałowi 340&nbsp;zł.”</CaseBigLine>
              {/* Placeholder z legacy (nie renderuje się): „[Miejsce na zrzut ekranu rozliczenia, gdy będzie gotowy.]”.
                  Gdy będzie zrzut, wraca tu jako <figure> z obrazem, a ten podpis zostaje jego opisem. */}
              <TileCaption as="p">Jedno zdanie zamiast tabeli.</TileCaption>
            </>
          }
        />

        <CaseStudySection
          layout="split"
          flip
          tone="dark"
          label="03.4 / Cennik"
          text={
            <CaseProse
              lines={["Jedna opłata", "na parę"]}
              paragraphs={[
                "Większość aplikacji liczy za użytkownika. Tu jedna osoba podpina kartę, druga dostaje dostęp automatycznie. Aplikacja nie dokłada pytania „kto płaci za aplikację”.",
                "Trial trwa 30 dni, bo cykl finansowy pary jest miesięczny: trzeba dojść do rozliczenia, żeby poczuć efekt.",
              ]}
            />
          }
          visual={
            <figure>
              <Fade index={1}>
                <PairSubscription />
              </Fade>
              <TileCaption>24,99 zł miesięcznie albo 249,99 zł rocznie. Jedna subskrypcja obejmuje oboje.</TileCaption>
            </figure>
          }
        />

        <CaseStrip label="03.5 / Codzienność" aside="Zrzuty z aplikacji" tone="dark">
          <CaseScreens screens={ourmoneyScreens} />
        </CaseStrip>

        <CaseStudySection label="04 / System wizualny">
          <CaseProse
            lines={["Jeden akcent"]}
            spaced
            paragraphs={[
              <>
                Aplikacja jest jasna i spokojna, bo rozmawia o czułym temacie. Landing jest głośniejszy, bo ma sprzedać.
                Łączy je limonka <Tag>#BBFF00</Tag>.
              </>,
            ]}
          >
            <figure>
              <CaseStage
                variant="image"
                placement="inline"
                index={3}
                image={ourmoneyImages.og}
                sizes="(max-width: 1023px) 100vw, 80vw"
              />
              <TileCaption>Grafika z ourmoney.pl.</TileCaption>
            </figure>
          </CaseProse>
        </CaseStudySection>

        <CaseStrip label="05 / W liczbach" aside="Stan: wrzesień 2026" tone="dark">
          <CaseNumbers items={ourmoneyNumbers} />
        </CaseStrip>

        <CaseStudySection
          layout="split"
          label="06 / Pod maską"
          text={
            <CaseProse
              lines={["Kod Kuby"]}
              paragraphs={[
                "Dane pary są szyfrowane, odizolowane na poziomie bazy i widoczne tylko dla nich dwojga. Operacje finansowe są atomowe, więc salda nie mogą się rozjechać. Bez reklam i bez sprzedaży danych.",
              ]}
            />
          }
          visual={
            <Fade index={3}>
              <TechStack groups={ourmoneyStack} />
            </Fade>
          }
        />

        <CaseStudySection label="07 / Gdzie jesteśmy" tone="dark">
          <CaseProse
            lines={["Przed premierą"]}
            paragraphs={[
              "Aplikacja działa jako PWA i przeszła testy z pierwszymi parami. Testy pokazały dwie rzeczy do poprawy: zaproszenie partnera nie może być wymuszone na starcie, a druga osoba musi mieć głos przy ustalaniu zasad. Teraz domykamy wydanie do App Store i Google Play.",
              <ArrowLink key="link" href={product.url} variant="underline" arrow="↗">
                Zobacz ourmoney.pl
              </ArrowLink>,
            ]}
          />
        </CaseStudySection>
      </CaseStudyLayout>
    </>
  );
}
