import { automationHouseLive } from "./cases/automation-house";
import { busybeeLive } from "./cases/busybee";
import { otbLive } from "./cases/otb";
import { sassyLive } from "./cases/sassy";
import { LEGAL_DOMAIN, LEGAL_EFFECTIVE_FROM, contactLink, controllers, cookieNotice } from "./legal";
import type { LegalDocument } from "./types";

/** Hosty żywych stron klientów (`LiveFrame`): ładują się dopiero po kliknięciu „Otwórz na żywo ↗”. */
const liveFrameHosts = [busybeeLive, automationHouseLive, otbLive, sassyLive].map((live) =>
  new URL(live.src).host.replace(/^www\./, ""),
);

/**
 * Polityka prywatności i ciasteczek (`/polityka-prywatnosci`). Opisuje stan z kodu: formularz → Server Action →
 * Resend (bez bazy danych), hosting Vercel, zero ciasteczek, jeden wpis w `localStorage` (`CookieNotice`),
 * żywe strony klientów w `LiveFrame` dopiero po kliknięciu. Nowe narzędzie (analityka, osadzenia) → zaktualizuj
 * sekcje i `LEGAL_EFFECTIVE_FROM`. Placeholdery `[…]` do podmiany przed publikacją.
 */
export const privacyPolicy = {
  hero: {
    lines: ["Polityka", "prywatności"],
    lead: "Krótko: nie śledzimy Cię. Dłużej: poniżej, bez prawniczej waty.",
  },
  description:
    "Polityka prywatności no-fuss: kto przetwarza Twoje dane, po co i jak długo. Zero ciasteczek i analityki, dane z formularza tylko do odpowiedzi.",
  effectiveFrom: LEGAL_EFFECTIVE_FROM,
  sections: [
    {
      id: "administratorzy",
      title: "Kto odpowiada za Twoje dane",
      blocks: [
        `Administratorami danych osobowych zbieranych przez stronę ${LEGAL_DOMAIN} są wspólnie (współadministratorzy w rozumieniu art. 26 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679, „RODO”):`,
        { list: controllers.map((c) => (c.address ? `${c.name}, ${c.address};` : `${c.name};`)) },
        ["Najszybciej złapiesz nas pod adresem ", contactLink, ". Tą samą drogą skorzystasz z każdego prawa opisanego niżej."],
        "Nie wyznaczyliśmy inspektora ochrony danych, bo przy naszej skali działania RODO tego nie wymaga (art. 37 RODO).",
      ],
    },
    {
      id: "wspoladministrowanie",
      title: "Jak dzielimy się odpowiedzialnością",
      blocks: [
        "Działamy we dwoje, więc o celach i sposobach przetwarzania danych decydujemy razem. Zasadnicza treść naszych uzgodnień (art. 26 ust. 2 RODO):",
        {
          list: [
            "oboje odpowiadamy za zgodność przetwarzania z prawem i za bezpieczeństwo danych;",
            ["informacje z tej polityki przekazujemy Ci wspólnie, a Twoje żądania przyjmujemy pod jednym adresem: ", contactLink, ";"],
            "na Twoje żądanie odpowiada to z nas, kto prowadzi Twoją sprawę, w porozumieniu z drugą osobą.",
          ],
        },
        "Niezależnie od tych ustaleń możesz wykonywać swoje prawa wobec każdego z nas (art. 26 ust. 3 RODO).",
      ],
    },
    {
      id: "formularz",
      title: "Formularz kontaktowy i e-mail",
      blocks: [
        ["Gdy piszesz przez formularz w stopce albo na ", contactLink, ", przetwarzamy dane, które nam podajesz: imię, adres e-mail, treść wiadomości i to, co w niej zawrzesz (np. nazwę firmy albo numer telefonu)."],
        "Cel: odpowiedź na wiadomość i rozmowa o ewentualnej współpracy. Podstawa prawna: nasz prawnie uzasadniony interes, czyli odpowiadanie na korespondencję (art. 6 ust. 1 lit. f RODO), a gdy pytasz o wycenę lub współpracę, także działania podejmowane na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).",
        "Formularz przekazuje wiadomość przez usługę Resend na nasze skrzynki pocztowe. Strona nie zapisuje jej w żadnej bazie danych.",
        "Podanie danych jest dobrowolne, ale bez adresu e-mail nie będziemy mogli odpisać. Formularz ma ukryte pole-pułapkę na boty: nie zbiera ono żadnych informacji o Tobie.",
      ],
    },
    {
      id: "logi",
      title: "Dane techniczne",
      blocks: [
        "Stronę hostuje Vercel. Jak każdy serwer WWW, przy każdym wejściu zapisuje dane techniczne żądania: adres IP, datę i godzinę, adres podstrony, typ przeglądarki i systemu oraz kod odpowiedzi.",
        "Cel: utrzymanie strony, diagnozowanie błędów i ochrona przed nadużyciami, m.in. ograniczanie liczby wysyłek formularza z jednego adresu IP. Podstawa prawna: nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).",
        "Z tych danych nie budujemy profili i nie łączymy ich z wiadomościami z formularza.",
      ],
    },
    {
      id: "ciasteczka",
      title: "Ciasteczka i pamięć przeglądarki",
      blocks: [
        "Nie używamy ciasteczek (cookies): ani własnych, ani narzędzi analitycznych, reklamowych czy pikseli śledzących. Fonty i filmy ładujemy z naszego serwera, nie z Google Fonts ani YouTube.",
        `W pamięci przeglądarki (localStorage) zapisujemy jeden wpis: „${cookieNotice.storageKey}” z datą wersji komunikatu o ciasteczkach, żeby komunikat nie wracał przy każdej wizycie. Wpis zostaje na Twoim urządzeniu i nie jest wysyłany do nas ani do nikogo innego. Usuniesz go, czyszcząc dane witryny w przeglądarce. To informacja niezbędna do działania strony, więc nie wymaga zgody.`,
        `Jedyny wyjątek zależy od Ciebie. W części case studies możesz kliknąć „Otwórz na żywo ↗”, żeby zobaczyć stronę klienta w ramce. Dopiero wtedy przeglądarka łączy się z serwerem tej strony (${liveFrameHosts.join(", ")}), a ona może ustawić własne ciasteczka i zbierać dane według swojej polityki prywatności. Nie mamy na to wpływu i nie dostajemy tych danych.`,
      ],
    },
    {
      id: "odbiorcy",
      title: "Komu przekazujemy dane",
      blocks: [
        "Nie sprzedajemy danych i nie udostępniamy ich do celów marketingowych. Dane trafiają do dostawców usług, z których korzystamy. Resend i Cloudflare przetwarzają je w naszym imieniu (podmioty przetwarzające, na podstawie umów powierzenia w warunkach ich usług):",
        {
          list: [
            ["Plus Five Five, Inc. (USA), operator usługi Resend: przekazanie wiadomości z formularza na nasze skrzynki, ", { label: "polityka prywatności Resend", href: "https://resend.com/legal/privacy-policy" }, ";"],
            ["Cloudflare, Inc. (USA): obsługa domeny i przekierowanie poczty z adresu ", contactLink, " na nasze skrzynki, ", { label: "polityka prywatności Cloudflare", href: "https://www.cloudflare.com/privacypolicy/" }, "."],
          ],
        },
        ["Stronę hostuje Vercel Inc. (USA), który przetwarza dane techniczne opisane wyżej według własnej ", { label: "polityki prywatności Vercel", href: "https://vercel.com/legal/privacy-notice" }, "."],
        ["Wiadomości odbieramy na skrzynkach Gmail. Ich dostawca, Google Ireland Limited (Irlandia), przetwarza dane według własnej ", { label: "polityki prywatności Google", href: "https://policies.google.com/privacy" }, "."],
        "Dane możemy też przekazać organom państwowym, jeśli wymaga tego prawo.",
      ],
    },
    {
      id: "poza-eog",
      title: "Przekazywanie danych poza EOG",
      blocks: [
        "Vercel, Resend i Cloudflare mają siedziby w USA, więc dane mogą trafiać poza Europejski Obszar Gospodarczy. Podstawą jest decyzja Komisji Europejskiej stwierdzająca odpowiedni stopień ochrony w ramach EU-US Data Privacy Framework (dla firm objętych certyfikacją, m.in. Vercel) albo standardowe klauzule umowne zatwierdzone przez Komisję (art. 45 i 46 RODO).",
        "Google może przekazywać dane z Gmaila poza EOG na zasadach opisanych w swojej polityce prywatności.",
      ],
    },
    {
      id: "jak-dlugo",
      title: "Jak długo przechowujemy dane",
      blocks: [
        {
          list: [
            "korespondencję: przez czas potrzebny do odpowiedzi i rozmowy; jeśli nie zaczniemy współpracy, nie dłużej niż 12 miesięcy od ostatniej wiadomości;",
            "korespondencję związaną z umową: przez czas jej wykonywania i do upływu terminów przedawnienia roszczeń;",
            "dane techniczne: przez czas ustalony w usłudze hostingu, potrzebny do diagnostyki i bezpieczeństwa;",
            "wpis w localStorage: do czasu, aż go usuniesz.",
          ],
        },
        "Dłużej tylko wtedy, gdy wymaga tego prawo albo dane są potrzebne do ustalenia, dochodzenia lub obrony roszczeń.",
      ],
    },
    {
      id: "prawa",
      title: "Twoje prawa",
      blocks: [
        "Masz prawo:",
        {
          list: [
            "dostępu do swoich danych i otrzymania ich kopii (art. 15 RODO);",
            "sprostowania danych (art. 16 RODO);",
            "usunięcia danych (art. 17 RODO);",
            "ograniczenia przetwarzania (art. 18 RODO);",
            "przenoszenia danych przetwarzanych w związku z umową lub działaniami przed jej zawarciem (art. 20 RODO);",
            "sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie (art. 21 RODO);",
            ["wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, ", { label: "uodo.gov.pl", href: "https://uodo.gov.pl" }, "), jeśli uważasz, że przetwarzamy dane niezgodnie z prawem (art. 77 RODO)."],
          ],
        },
        ["Żeby skorzystać z praw, napisz na ", contactLink, ". Odpowiemy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca."],
        "Nie profilujemy Cię i nie podejmujemy wobec Ciebie decyzji w sposób zautomatyzowany (art. 22 RODO).",
      ],
    },
    {
      id: "bezpieczenstwo",
      title: "Bezpieczeństwo",
      blocks: [
        "Strona działa tylko przez szyfrowane połączenie HTTPS. Klucze do usług i adresy naszych skrzynek są wyłącznie po stronie serwera, a dostęp do skrzynek i kont dostawców mamy tylko my dwoje.",
      ],
    },
    {
      id: "linki",
      title: "Linki do innych stron",
      blocks: [
        "Na stronie są linki do serwisów zewnętrznych, np. GitHub, App Store, Google Play i stron klientów. Po przejściu do nich obowiązuje polityka prywatności danego serwisu.",
      ],
    },
    {
      id: "zmiany",
      title: "Zmiany polityki",
      blocks: [
        "Politykę aktualizujemy, gdy zmienia się sposób przetwarzania danych, np. gdy dodajemy nowe narzędzie. Aktualna wersja jest zawsze pod tym adresem, a data nad treścią mówi, od kiedy obowiązuje. Jeśli kiedyś zechcemy użyć ciasteczek, które wymagają zgody, najpierw o nią zapytamy.",
      ],
    },
  ],
} as const satisfies LegalDocument;
