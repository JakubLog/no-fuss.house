import { LEGAL_DOMAIN, LEGAL_EFFECTIVE_FROM, contactLink, controllersSentence, formatLegalDate, privacyLink } from "./legal";
import type { LegalDocument } from "./types";

/**
 * Regulamin świadczenia usług drogą elektroniczną (`/regulamin`, art. 8 UŚUDE): przeglądanie strony i formularz
 * kontaktu. Nie reguluje zleceń (te mają osobne umowy). Placeholdery `[…]` (adresy) są w `legal.ts`.
 */
export const terms = {
  hero: {
    lines: ["Regulamin"],
    lead: "Zasady korzystania ze strony i formularza kontaktu. Krótko i bez drobnego druku.",
  },
  description:
    "Regulamin strony no-fuss: zasady korzystania ze strony i formularza kontaktu, wymagania techniczne i reklamacje. Krótko i bez drobnego druku.",
  effectiveFrom: LEGAL_EFFECTIVE_FROM,
  sections: [
    {
      id: "postanowienia-ogolne",
      title: "Postanowienia ogólne",
      blocks: [
        {
          ordered: true,
          list: [
            `Regulamin określa zasady korzystania ze strony internetowej ${LEGAL_DOMAIN} („Strona”) i usług świadczonych na niej drogą elektroniczną. Wydajemy go na podstawie art. 8 ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną.`,
            `Usługodawcami są wspólnie ${controllersSentence}, działający pod marką no-fuss („Usługodawca”, „my”).`,
            ["Kontakt z nami: ", contactLink, " albo formularz w stopce Strony."],
            "Regulamin jest dostępny na Stronie bezpłatnie, w formie, która pozwala go zapisać i wydrukować.",
          ],
        },
      ],
    },
    {
      id: "definicje",
      title: "Definicje",
      blocks: [
        {
          list: [
            "Użytkownik: każda osoba, która korzysta ze Strony.",
            "Konsument: Użytkownik będący osobą fizyczną, który korzysta ze Strony w celu niezwiązanym bezpośrednio z jego działalnością gospodarczą lub zawodową. Przepisy o Konsumentach stosujemy też do osoby fizycznej prowadzącej działalność gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego, w zakresie przewidzianym przez prawo.",
            "Usługi: usługi świadczone drogą elektroniczną opisane w § 3.",
            "Formularz: formularz kontaktowy w stopce Strony.",
          ],
        },
      ],
    },
    {
      id: "uslugi",
      title: "Usługi",
      blocks: [
        {
          ordered: true,
          list: [
            "Na Stronie świadczymy bezpłatnie dwie Usługi: udostępnianie treści Strony (informacji o nas, naszych usługach, realizacjach i wydarzeniach) oraz przesyłanie nam wiadomości przez Formularz.",
            "Umowa o udostępnianie treści zostaje zawarta z chwilą otwarcia Strony i rozwiązana z chwilą jej zamknięcia. Usługa Formularza jest jednorazowa i kończy się z chwilą wysłania wiadomości.",
            "Z Usług możesz zrezygnować w każdej chwili: wystarczy zamknąć Stronę albo nie wysyłać Formularza.",
            "Strona nie jest sklepem internetowym, a jej treści, w tym opisy naszych usług, nie są ofertą w rozumieniu art. 66 Kodeksu cywilnego. Umowę na projekt (np. design, aplikację, stronę) zawieramy osobno, po rozmowie i wycenie, i to ona, a nie ten regulamin, określa warunki współpracy.",
          ],
        },
      ],
    },
    {
      id: "wymagania",
      title: "Wymagania techniczne",
      blocks: [
        "Do korzystania ze Strony potrzebujesz:",
        {
          list: [
            "urządzenia z dostępem do internetu;",
            "aktualnej przeglądarki (np. Chrome, Firefox, Safari, Edge); część elementów, m.in. scena 3D i animacje, wymaga włączonego JavaScriptu i WebGL, a bez nich treść nadal jest dostępna;",
            "do wysłania Formularza: aktywnego adresu e-mail.",
          ],
        },
      ],
    },
    {
      id: "zasady",
      title: "Zasady korzystania",
      blocks: [
        "Korzystając ze Strony, nie możesz:",
        {
          list: [
            "dostarczać treści bezprawnych, obraźliwych ani naruszających prawa innych osób;",
            "wysyłać przez Formularz spamu ani niezamówionych ofert handlowych;",
            "podawać cudzych danych bez uprawnienia;",
            "zakłócać działania Strony, w tym przeprowadzać ataków, skanować jej bez naszej zgody ani obchodzić zabezpieczeń.",
          ],
        },
        ["Jeśli znajdziesz lukę bezpieczeństwa, napisz na ", contactLink, ". Dziękujemy, naprawimy ją szybko."],
      ],
    },
    {
      id: "zagrozenia",
      title: "Zagrożenia w sieci",
      blocks: [
        "Korzystanie z internetu wiąże się z typowymi zagrożeniami, takimi jak złośliwe oprogramowanie, phishing (podszywanie się pod znane serwisy), przechwycenie niezabezpieczonej transmisji czy spam. Żeby je ograniczyć, aktualizuj przeglądarkę i system. Strona działa tylko przez szyfrowane połączenie HTTPS. Nigdy nie prosimy o hasła ani dane płatnicze przez Formularz ani e-mail.",
      ],
    },
    {
      id: "prawa-autorskie",
      title: "Prawa autorskie",
      blocks: [
        {
          ordered: true,
          list: [
            "Treści Strony (teksty, grafiki, zdjęcia, animacje, logo no-fuss) są chronione prawem autorskim. Możesz je przeglądać i udostępniać linki do nich; inne wykorzystanie wymaga naszej zgody, chyba że pozwala na nie prawo, np. w ramach dozwolonego użytku.",
            "Materiały z realizacji dla klientów (zrzuty ekranu, nazwy, logotypy) należą do ich właścicieli. Pokazujemy je jako przykłady naszej pracy.",
          ],
        },
      ],
    },
    {
      id: "odpowiedzialnosc",
      title: "Odpowiedzialność",
      blocks: [
        {
          ordered: true,
          list: [
            "Dbamy o to, żeby Strona działała i była aktualna, ale mogą zdarzyć się przerwy techniczne, np. przy aktualizacjach.",
            "Nie odpowiadamy za treść stron zewnętrznych, do których prowadzą linki, ani za strony klientów wyświetlane w ramce po kliknięciu „Otwórz na żywo ↗”.",
            "Postanowienia regulaminu nie wyłączają ani nie ograniczają odpowiedzialności wobec Konsumentów w zakresie, w jakim nie pozwala na to prawo.",
          ],
        },
      ],
    },
    {
      id: "reklamacje",
      title: "Reklamacje",
      blocks: [
        {
          ordered: true,
          list: [
            ["Reklamację dotyczącą działania Strony lub Usług wyślij na ", contactLink, "."],
            "Opisz, czego dotyczy problem i kiedy wystąpił. Odpowiedź wyślemy na adres e-mail, z którego przyszła reklamacja.",
            "Rozpatrzymy ją w ciągu 14 dni od otrzymania.",
          ],
        },
      ],
    },
    {
      id: "spory",
      title: "Pozasądowe rozwiązywanie sporów",
      blocks: [
        ["Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in. z pomocy miejskiego lub powiatowego rzecznika konsumentów albo stałego polubownego sądu konsumenckiego przy wojewódzkim inspektoracie Inspekcji Handlowej. Więcej informacji: ", { label: "prawakonsumenta.uokik.gov.pl", href: "https://prawakonsumenta.uokik.gov.pl" }, "."],
      ],
    },
    {
      id: "dane-osobowe",
      title: "Dane osobowe",
      blocks: [
        ["Zasady przetwarzania danych osobowych i informacje o ciasteczkach opisuje ", privacyLink, "."],
      ],
    },
    {
      id: "zmiany",
      title: "Zmiany regulaminu",
      blocks: [
        "Regulamin możemy zmienić z ważnych powodów, np. zmiany przepisów, zakresu Usług albo zabezpieczeń. Nowa wersja obowiązuje od dnia publikacji na Stronie. Usługi trwają tylko w czasie wizyty albo są jednorazowe, więc zmiana nie dotyczy Usług już wykonanych.",
      ],
    },
    {
      id: "postanowienia-koncowe",
      title: "Postanowienia końcowe",
      blocks: [
        {
          ordered: true,
          list: [
            "W sprawach nieuregulowanych w regulaminie stosuje się prawo polskie, w szczególności Kodeks cywilny i ustawę o świadczeniu usług drogą elektroniczną.",
            "Wybór prawa polskiego nie pozbawia Konsumenta ochrony, którą dają mu bezwzględnie obowiązujące przepisy państwa jego zwykłego pobytu.",
            "Spory rozstrzyga sąd właściwy według przepisów ogólnych.",
            `Regulamin obowiązuje od ${formatLegalDate(LEGAL_EFFECTIVE_FROM)}.`,
          ],
        },
      ],
    },
  ],
} as const satisfies LegalDocument;
