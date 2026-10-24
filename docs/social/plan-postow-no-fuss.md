# no-fuss: plan postów z case studies (LinkedIn + Instagram)

Siedem postów w cztery tygodnie, od wtorku 2026-10-27 do wtorku 2026-11-17. Do każdego jest animacja w dwóch formatach i gotowy tekst.

## Zanim to wystartuje

1. **Profile studia istnieją, ale strona do nich nie linkuje.** Instagram: [@nofuss.house](https://www.instagram.com/nofuss.house); LinkedIn: [no-fuss](https://www.linkedin.com/company/no-fuss). Linki do obu są podpięte w stopce i na `/o-nas` na gałęzi `feat/social-instagram` w repo no-fuss. Zmerguj ją przed pierwszym postem.
2. **Na LinkedInie publikuj z profilu Magdy (i Kuby), a strona studia niech to udostępnia.** [Likely] Świeża strona firmowa bez obserwujących ma znikomy zasięg organiczny, a klienci usługowi kupują od ludzi. Teksty niżej są pisane w pierwszej osobie, z profilu Magdy.
3. **AION MIND celowo pominięty.** To etat Magdy, nie projekt no-fuss, i strona studia sama to zaznacza. Post o nim jako „showcase no-fuss” przeczyłby tej zasadzie. Do tego potrzebna byłaby zgoda AION.
4. **Uczciwe role zostają w każdym poście:** OTB to projekt Magdy razem z Piotrem Chuchłą (oznacz go), w Busy Bee kodował Michał Gabryelewicz (oznacz go), a marki na stronie Busy Bee to klienci Busy Bee Film. Animacje mają to wpisane w fakty i podpisy.
5. **Liczby:** w animacjach i tekstach nie ma liczb ani wyników, których nie ma na stronie no-fuss. Pominąłem „152 polityki bezpieczeństwa” z case'u OurMoney: wiki nie ma tej liczby sprawdzonej w kodzie.
6. **Brak kalendarza w CTA.** W kodzie strony nadal nie ma linku do umawiania rozmowy (`calendarUrl: null`), więc CTA w animacjach to „Porozmawiajmy →” i mail `general@no-fuss.house`.

## Formaty

| Plik | Wymiar | Gdzie |
|---|---|---|
| `<scena>-feed.mp4` | 1080×1350 (4:5), 20–25 s | post wideo na LinkedInie, post w feedzie na Instagramie |
| `<scena>-story.mp4` | 1080×1920 (9:16), 20–25 s | Instagram Reels i Stories (górne ~250 px i dolne ~420 px trzymam puste pod interfejs aplikacji) |
| `<scena>-feed-cover.png`, `<scena>-story-cover.png` | jak wyżej | miniatura na LinkedInie, okładka Reelsa (inaczej pierwszą klatką byłby ekran ładowania) |

**Stille** (`stille/<projekt>-1..3.png`, 1080×1350): po trzy kadry na projekt. Pierwszy to przeglądarka na limonce, drugi telefony na ciemnym tle, trzeci drugi widok na jasnym. Tekstu jest minimum: nazwa, rola i rok. Każda trójka to gotowa karuzela: post z wieloma zdjęciami na LinkedInie, karuzela na Instagramie. Proponuję wrzucać je jako drugi post tego samego projektu, tydzień po filmie (np. w poniedziałek), albo pierwszy kadr jako post, a resztę w Stories. Na stillach Busy Bee stoi podpis „Reklamy: prace Busy Bee Film”, bo zrzuty pokazują reklamy marek, dla których pracował Busy Bee Film.

**Okładki** (`okladki/<projekt>-feed.png` 1080×1350 i `okladki/<projekt>-story.png` 1080×1920): jeden iPhone z realizacją leżący na limonce albo jasnym papierze, cień kontaktowy i słoneczny, ziarno, bez cieni żaluzji. Podpis jest mały: logo i adres u góry, nazwa i typ projektu na dole. To pierwszy kadr karuzeli i okładka Reelsa / miniatura filmu na LinkedInie. Telefon jest narysowany w HTML, nie pochodzi z plików Bendito.

Wszystkie animacje mają ten sam układ jak strona: pasek ładowania i kurtyna, potem ciemne hero z faktami, limonkowa scena z realizacją, sekcja „W skrócie” i CTA. Kroje, kolory, siatka z krzyżykami, scramble w mono i krzywa ruchu są wzięte z `DESIGN.md` no-fuss. Filmy są bez dźwięku. Na Instagramie dodaj muzykę z biblioteki przy publikacji.

## Harmonogram

| # | Data | Temat | Plik |
|---|---|---|---|
| 1 | wt 2026-10-27 | Kim jesteśmy | `intro` |
| 2 | czw 2026-10-29 | Automation House | `ah` |
| 3 | wt 2026-11-03 | OurMoney | `ourmoney` |
| 4 | czw 2026-11-05 | Jak pracujemy | `process` |
| 5 | wt 2026-11-10 | OTB Ventures | `otb` |
| 6 | czw 2026-11-12 | Busy Bee | `busybee` |
| 7 | wt 2026-11-17 | Sassy | `sassy` |

Rytm: wtorek i czwartek, rano. [Guessing] Godzinę dopasuj po dwóch tygodniach do statystyk profilu. Kolejność: najpierw case, w którym no-fuss zrobiło wszystko (design i kod), na końcu eksperyment, który pokazuje warsztat, ale nie jest zleceniem.

---

## 1. Kim jesteśmy (`intro`)

**LinkedIn**

> Razem z Kubą Fedoszczakiem prowadzimy no-fuss: studio produktowe dla firm.
>
> Ja projektuję i prowadzę produkt, Kuba koduje. Do tego agenci AI, którzy robią za nas to, co powtarzalne. Bez działu sprzedaży, bez account managera pomiędzy.
>
> Robimy aplikacje mobilne, produkty z AI, strony i landingi, design produktu i audyty istniejących produktów.
>
> Przez najbliższe tygodnie pokażę tu nasze realizacje: co było zadaniem, co zrobiliśmy i co z tego wyszło.
>
> Jeśli macie produkt do zbudowania: general@no-fuss.house
> no-fuss.house

**Instagram**

> Dwie osoby, agenci AI, zero zamieszania. Projektujemy i kodujemy aplikacje, strony i produkty z AI dla firm.
> Design: Magda · Kod: Kuba
> Link w bio → no-fuss.house
> #productdesign #uxdesign #nextjs #studioprojektowe

## 2. Automation House (`ah`)

**LinkedIn**

> Automation House by Tigers potrzebował nowej strony. Najpierw trzeba było ustalić, co firma robi naprawdę i komu to sprzedaje.
>
> Zaczęliśmy od warsztatów z zespołem. Potem architektura treści, system wizualny i ekrany (ja), kod w Next.js (Kuba). Struktura i treść są czytelne także dla AI, nie tylko dla Google.
>
> Discovery, projekt i kod zrobił jeden zespół. Strona działa: automation.house
>
> Cały case: no-fuss.house/automation-house

**Instagram**

> Automation House: rebranding strony od discovery do wdrożenia. Design Magda, kod Kuba (Next.js). Strona działa pod automation.house.
> #webdesign #nextjs #rebranding #uxdesign

## 3. OurMoney (`ourmoney`)

**LinkedIn**

> Nasz własny produkt: OurMoney, aplikacja do wspólnego budżetu dla par.
>
> Zaczęliśmy od jednego pytania, które pary zadają sobie przy pieniądzach: czy to jest fair? Dlatego zamiast jednego „po połowie” są trzy modele podziału: po równo, proporcjonalnie albo tylko śledzenie wydatków.
>
> Ja projektuję i prowadzę produkt, Kuba koduje i odpowiada za infrastrukturę i bezpieczeństwo. Aplikacja jest przed premierą w sklepach.
>
> Budowanie własnego produktu uczy rzeczy, których nie da się nauczyć na zleceniu, i to przenosimy do projektów klientów.
>
> no-fuss.house/ourmoney · ourmoney.pl

**Instagram**

> OurMoney, nasz własny produkt. Wspólny budżet dla par i trzy modele podziału zamiast jednego „po połowie”. Przed premierą w sklepach.
> #appdesign #fintech #productdesign #mobileapp

## 4. Jak pracujemy (`process`)

**LinkedIn**

> Jak wygląda praca z no-fuss, w czterech krokach:
>
> 01 Rozmowa i brief. Co chcecie zbudować, dla kogo i po co. Z tego powstaje brief i indywidualna wycena.
> 02 Discovery i prototyp. Zanim powstanie kod, klikacie działający prototyp.
> 03 Budowa w iteracjach. Design i kod w jednym zespole, małymi krokami, z działającą wersją po drodze.
> 04 Wdrożenie i wsparcie. Publikujemy stronę albo wydajemy aplikację i zostajemy: poprawki, metryki, kolejne wersje.
>
> Zaczynamy zawsze od rozmowy: general@no-fuss.house

**Instagram**

> Od rozmowy do wdrożenia w 4 krokach. Design i kod w jednym zespole, bez pośrednika.
> #processdesign #productdesign #webdevelopment

## 5. OTB Ventures (`otb`)

**LinkedIn** (oznacz Piotra Chuchłę)

> OTB Ventures inwestuje w europejskie startupy z AI, SpaceTech i Physical AI. Strona miała być poważna jak fundusz i odważna jak jego portfolio.
>
> Razem z Piotrem Chuchłą zaprojektowaliśmy ją wokół jednego elementu: gradientu czerwień–błękit i kuli, która przecina nagłówek „Open to beyond”. Do tego wertykale, portfolio, opinie founderów i widok mobilny.
>
> Strona działa pod otb.vc. Na naszej stronie można przeciągnąć tę kulę samemu: no-fuss.house/otb

**Instagram**

> OTB Ventures: strona funduszu VC. Design Magda razem z @[Piotr Chuchła]. Kula, gradient i „Open to beyond”.
> #webdesign #vc #uidesign #interactiondesign

## 6. Busy Bee (`busybee`)

**LinkedIn** (oznacz Michała Gabryelewicza)

> Busy Bee Film produkuje reklamy dla dużych marek. Strona miała robić jedno: pokazać prace i doprowadzić do kontaktu, bez zakładek, których nikt nie czyta.
>
> Zaprojektowałam ją tak: kadr z produkcji na pierwszym ekranie, realizacje w rytmie zamiast siatki kafelków, na końcu konkretne osoby z kontaktem. Kod i wdrożenie na Webflow zrobił Michał Gabryelewicz.
>
> Reklamy na stronie to prace Busy Bee Film dla ich klientów.
>
> busybeefilm.pl · no-fuss.house/busy-bee

**Instagram**

> Busy Bee Film: strona domu produkcyjnego. Design Magda, kod @[Michał Gabryelewicz] (Webflow). Reklamy na stronie to prace Busy Bee Film.
> #webdesign #webflow #filmproduction #uidesign

## 7. Sassy (`sassy`)

**LinkedIn**

> Nie każdy projekt musi mieć cel. Sassy to mój warsztat, nie zlecenie: „a page with no objectives”.
>
> Sprawdzam na niej, ile zabawy i interakcji udźwignie jedna strona w jednym pliku HTML, bez frameworków. Wszystko da się złapać i przesunąć: retro pulpit z aparatem, biurko z zadaniami, suwak godzin, waga SERIOUS, tablica z kredą i gra Snack Run.
>
> To, czego się tu nauczę, trafia potem do projektów klientów.
>
> sassy-tan.vercel.app

**Instagram**

> Sassy: strona bez celu w jednym pliku HTML. Wszystko da się złapać i przesunąć. Mój plac zabaw z interakcjami.
> #creativecoding #interactiondesign #html #webexperiment

---

## Jak to zostało zrobione

Animacje są w HTML i CSS: jedna strona z funkcją `render(t)`, nagrana klatka po klatce (30 kl./s) Playwrightem i złożona w H.264 przez ffmpeg. Treści, zrzuty ekranów i tokeny pochodzą z repo `magdanestor-2/no-fuss` (commit `9984417`). Poprawki tekstu wymagają edycji `anim/anim.html` i ponownego renderu jednej sceny, około 2 minut na plik.
