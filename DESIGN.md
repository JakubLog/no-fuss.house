---
name: no-fuss
version: 0.1.0
source: układ, typografia i motion z haoqi.design (computed styles, 2026-09-21); paleta z Figmy no-fuss
colors:
  # Źródło: Figma OoTIQaKer6V1uxTwwGvXK4, node 351:24343 + decyzja Magdy o jasnych sekcjach (2026-09-21)
  base:
    light: "#FCFCFB"       # jasne sekcje
    dark: "#101318"        # Dark - Light/900: hero, stopka
    shade-900: "#15181D"   # ciemna sekcja w motywie ciemnym, kafle
    shade-700: "#272A2F"   # kafle na ciemnym
    accent: "#BBFF00"      # limonka z renderu Figmy; UWAGA: zmienna Accent/Primary/900 ma wartość #FCE803 (żółty) — do rozstrzygnięcia
    on-accent: "#101318"
  tone-light:              # sekcja jasna
    bg: "#FCFCFB"
    ink: "#101318"
    muted: "#5F6369"
    tile: "#15181D"
  tone-dark:               # sekcja ciemna
    bg: "#101318"
    ink: "#FFFFFF"
    muted: "#A9ABAD"
    tile: "#272A2F"
  alpha-on-dark:           # skala Light - Dark z Figmy
    "25": "#FFFFFF05"
    "100": "#FFFFFF0A"
    "200": "#FFFFFF14"
    "400": "#FFFFFF52"
    "600": "#FFFFFFA3"
    "700": "#FFFFFFCC"
  grid:
    line: "rgba(255,255,255,0.05)"   # rysowane w mix-blend-mode: difference
    cross: "rgba(255,255,255,0.18)"
typography:
  # 7 ról sans + 2 mono. W kodzie jako tokeny --t-*. Żadnych rozmiarów spoza tej listy.
  mega:      { family: "TikTok Sans", weight: 700, size: "clamp(3.5rem, 11.5vw, 11rem)", lineHeight: 0.9 }   # imiona, tytuł case study
  display:   { family: "TikTok Sans", weight: 700, size: "clamp(2.5rem, 6svw, 5.5rem)", lineHeight: 1.0 }    # nagłówki hero i stopki, liczby
  h2:        { family: "TikTok Sans", weight: 700, size: "clamp(2rem, 3.3svw, 3rem)", lineHeight: 1.0 }      # nagłówki sekcji, marquee
  statement: { family: "TikTok Sans", weight: 400, size: "clamp(1.75rem, 3svw, 2.75rem)", lineHeight: 1.1 }  # manifesty, lead w hero case
  title:     { family: "TikTok Sans", weight: 500, size: "clamp(1.5rem, 2.2svw, 2rem)", lineHeight: 1.15 }   # nazwy usług, cytaty, wiersze list
  lead:      { family: "TikTok Sans", weight: 400, size: "clamp(1.125rem, 1.4svw, 1.375rem)", lineHeight: 1.35 } # akapity case study
  body:      { family: "TikTok Sans", weight: 400, size: "16px", lineHeight: "24px" }                         # logo = body 700
  mono:      { family: "Geist Mono", weight: 400, size: "14px", lineHeight: "20px", transform: uppercase }
  mono-sm:   { family: "Geist Mono", weight: 400, size: "12px", lineHeight: "16px", transform: uppercase }
  # Wagi: 400, 500, 700. Waga 800 usunięta 2026-09-21.
rounded:
  none: "0px"            # cały system jest ostry; zero zaokrągleń w UI
spacing:
  unit: "8px"          # 4 px dozwolone tylko wewnątrz komponentów (tag, chip)
  gutter-mobile: "16px"
  gutter-desktop: "56px"
  section-y-mobile: "72px"
  section-y-desktop: "96px"
  grid-columns: 12
  column-gap: "8px"   # jedna siatka wszędzie, także hero i stopka
  tile-gap: "8px"
motion:
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  reveal: "900ms, stagger 80ms na linię"
  theme: "300ms ease-out"
  scroll: "Lenis, lerp 0.1"
  scramble: "420ms, znaki !<>-_\\/[]{}=+*^?#%"
---

# no-fuss — DESIGN.md

## Overview

Techniczny, redakcyjny minimalizm z jednym głośnym momentem. Strona wygląda jak arkusz
roboczy: grafit i jasny papier na zmianę, stała siatka z krzyżykami pasowania, mono-etykiety
jak z rysunku technicznego. Na tym tle działa jeden element zabawy: szklany obiekt 3D w hero
i naklejki pod kursorem w stopce. Reszta jest cicha i precyzyjna. Nazwa zobowiązuje: bez ozdobników,
które nic nie niosą.

## Colors

Paleta no-fuss: głęboki grafit `#101318`, jasne `#FCFCFB`, jeden neonowy akcent `#BBFF00`.
Strona jest **mieszana tonalnie**: hero i stopka są zawsze ciemne, sekcje treści naprzemiennie
jasne (`tone-light`) i ciemne (`tone-dark`). Przełącznika motywu nie ma (usunięty 2026-09-21): tonacja wynika wyłącznie z rytmu sekcji.

Akcent występuje jako **tło** (tagi, zaznaczenie, `mark` w nagłówku) z tekstem
`#101318`, a na ciemnym także jako kolor obiektu 3D, kursora i poświaty w hero. Nigdy jako tekst
na jasnym tle. HUD i siatka są białe w `mix-blend-mode: difference`, więc same odwracają się
nad każdą sekcją.

Kontrast policzony skryptem `kontrast.py`:

| Para | Wynik | AA |
|---|---|---|
| ink `#101318` na `#FCFCFB` | 18.13:1 | zdaje |
| ink `#FFFFFF` na `#101318` | 18.61:1 | zdaje |
| `#FFFFFF` na `#15181D` | 17.79:1 | zdaje |
| `#101318` na accent `#BBFF00` | 15.44:1 | zdaje |
| accent `#BBFF00` na `#101318` | 15.44:1 | zdaje |
| muted `#5F6369` na `#FCFCFB` | 5.89:1 | zdaje |
| muted `#A9ABAD` na `#101318` | 8.08:1 | zdaje |
| accent `#FCE803` na `#FCFCFB` | 1.23:1 | **nie zdaje** (limonka podobnie), stąd zakaz akcentu jako tekstu na jasnym |

Do rozstrzygnięcia: w Figmie zmienna `Accent/Primary/900` ma wartość `#FCE803` (żółty),
a render ramki pokazuje limonkę `#BBFF00`. Makieta v2 używa limonki z renderu.

## Typography

Dwa kroje, twardy podział ról. **TikTok Sans** niesie treść: nagłówki display (700, wersaliki,
interlinia 1.0, rozmiar w `svw`), duże zdania-manifesty (400) i body. **Geist Mono** niesie
metadane: nawigację, etykiety, daty, HUD, tagi; zawsze wersalikami, 14 px lub 12 px.
Letter-spacing wszędzie `normal`. Brak kursywy, brak trzeciego kroju.

Do rozstrzygnięcia: plik Figmy no-fuss używa **Plus Jakarta Sans** (Display XL 56/800,
Text MD 16/500). Makiety v1 i v2 trzymają typografię haoqi (TikTok Sans + mono), bo z Figmy
miały przyjść tylko kolory. Jeśli Plus Jakarta Sans jest krojem marki, podmieniamy `display`
i `body`, a mono zostaje dla metadanych.

## Layout

Siatka 12 kolumn, gutter 16 px (mobile) / 56 px (desktop), sekcje z paddingiem pionowym
72 / 96 px. Hero ma pełną wysokość ekranu, stopka co najmniej pełną (z formularzem bywa wyższa). Hero strony głównej od 768 px stoi po przekątnej:
h1 w lewym górnym rogu, lead i CTA w prawym dolnym, napis 3D w pasie między nimi (dopasowany do wysokości
pasa); na telefonie napis nad tekstem, tekst na dole ekranu. Kafle realizacji układają się
asymetrycznie (od 1024 px): duży kafel na 8 kolumn dosunięty do prawej, potem pary 5+5, potem trójki
o różnych offsetach; 768–1023 px duży kafel zostaje, reszta w dwóch równych kolumnach. Gdy pierwszy kafel jest
duży, a ostatni wypada na parzystej pozycji, ostatni zajmuje pełny rząd; CSS i `sizes` obrazu muszą używać tego
samego warunku. Pod każdym kaflem wiersz mono: nazwa po lewej, rok po prawej (rok ze strzałką zawsze w jednej linii).

Stała warstwa `position: fixed` (siatka ma najniższy z-index: nad tłami sekcji, pod całą treścią, także pod napisem 3D i naklejkami; HUD leży na wierzchu):
- **siatka**: 3 piony (lewy gutter, środek, prawy gutter) i 2 poziomy (⅓ i ⅔ wysokości),
  z przerwą 12 px wokół przecięć i krzyżykiem 12 px w każdym przecięciu; rysowana na biało
  w `mix-blend-mode: difference`, więc sama odwraca się na każdym tle,
- **HUD**: logo i nawigacja u góry, pasek postępu scrolla przy prawej krawędzi.
  Fokus w HUD: biały obrys 2 px, odwracany razem z HUD. Linki w wierszu od 768 px; niżej zamiast nich
  przycisk „MENU” (mono 14 px) z dwiema kreskami 22×2 px (jak kreska w logo), które składają się w krzyżyk (0,4 s `--ease`).
- **Menu na telefonie** (< 768 px): pełny ekran pod HUD (logo i krzyżyk zostają na wierzchu), ciemna kurtyna `#101318`
  zjeżdża z góry (0,7 s `--ease`, zamknięcie 0,5 s w górę), linki w roli display wersalikami wjeżdżają od dołu ze
  staggerem jak nagłówki (`.line`). Wiersze z obrysem 1 px jak FAQ, przy dolnej krawędzi (w zasięgu kciuka); bieżąca
  strona lub sekcja (case study → Realizacje) ma tag „Tu jesteś” po prawej. Pod listą e-mail w mono. Hover (tylko mysz)
  jak FAQ: limonkowe tło, nazwa wcięta o 12 px, tag odwrócony. Strona pod menu się nie przewija. Zamykają je krzyżyk,
  Escape, link, zmiana ścieżki i wyjście fokusem poza menu. Przy reduced motion bez kurtyny i wjazdu linii. Bez JS
  przycisku nie ma, a linki zawijają się w wierszu HUD obok logo.

## Elevation & Depth

Brak cieni i warstw w UI (efekty blur/glow z Figmy świadomie pominięte). Głębia pochodzi
z trzech źródeł: obiektu 3D w hero (WebGL, limonkowy materiał z clearcoatem i iryzacją), rozmytych smug gradientu za nim
(tylko w hero; stopka ma płaskie tło `#101318`) i trybu mieszania siatki.

## Shapes

Promień zaokrągleń: 0. Kafle, tagi i przyciski są prostokątne. Jedyne krągłości to obiekt 3D,
naklejki i kursor, czyli warstwa zabawy, nie warstwa interfejsu.

## Components

- **Tag**: mono 12 px, czarny tekst na limonce, padding 2×6 px, przyklejony do prawego górnego
  rogu kafla.
- **Kafel realizacji**: obraz w proporcji 16:10 lub 1:1, bez ramki; hover skaluje obraz
  do 1.03 w masce (tylko myszą; przy reduced motion bez skali); podpis mono pod spodem.
- **Link nawigacji**: mono 14 px; hover uruchamia scramble znaków; przełączniki mają
  skrót w nawiasie kwadratowym, np. `MOTYW[A]`.
- **Link w tekście**: podkreślenie 1 px, na hover tło limonkowe.
- **CTA kontaktu** (`ContactCta`): przycisk accent „Porozmawiajmy →” (do stopki `#kontakt` z formularzem) + ghost
  „Umów rozmowę ↗” (kalendarz); przyciski prostokątne, min. 48 px, odstęp 8 px, zawijają się na wąskich
  ekranach. Bez adresu kalendarza ghosta nie ma (także w stopce obok wysyłki formularza), zamiast wyszarzonego przycisku. Pod h1 w hero
  i pod listą usług; pod FAQ na stronie głównej tylko zdanie, bo zaraz niżej jest stopka. Na `/o-nas` pod leadem hero
  (od 1024 px w kolumnach 8–12, 32 px pod nim) i na końcu „Kto co robi” (48 px pod ostatnim wierszem, od lewej
  krawędzi treści), przed `#social`.
- **Formularz kontaktu** (`ContactForm`, stopka `#kontakt` pod nagłówkiem, od 768 px od kolumny 3, od 1024 px kolumny 3–10):
  imię i e-mail obok siebie (od 768 px), wiadomość na całą szerokość. Etykiety mono 12 px `--muted` nad polami. Pola ostre,
  min. 48 px, tekst body 16 px, obrys 1 px `--ink` 18% (hover tylko myszą: 40%), fokus: obrys 2 px `--ink`,
  karetka w akcencie, wypełnienie tłem stopki. Błąd: obrys 2 px w akcencie i tag pod polem jak `Tag`; przy fokusie
  obrys wraca do białego. Pod polami accent „Wyślij wiadomość →” i ghost „Umów rozmowę ↗”. W trakcie wysyłki
  przycisk ma opacity .6, nie unosi się i pokazuje `cursor: progress`. Po zwykłym błędzie wartości zostają, a wynik
  w `role="status"` podaje adres e-mail. Odrzucone wywołanie akcji (firewall, sieć, limit body) montuje formularz od
  nowa z tymi samymi wartościami, komunikatem w `role="alert"` i fokusem na przycisku wysyłki. Sukces:
  „Dzięki, wiadomość doszła. Odpiszemy na …”.
- **Lista usług** (`ServicesList`, strona główna `#uslugi`): wiersze z obrysem 1 px (`--ink` 18%), nazwa w roli title, opis
  `--muted`, bez numerów. Wiersze nie są linkami, ale hover (tylko `hover: hover`) daje im to co w FAQ: limonkowe tło,
  tekst `#101318`, opis `#3F4A12` (7,92:1) i wcięcie 12 px transformem nazwy i opisu (0,4 s `--ease`; wiersz i sąsiedzi
  się nie ruszają). Bez strzałki i bez zmiany kursora; przy reduced motion wcięcie 12 px bez animacji.
- **Jak pracujemy** (`ProcessSection`, strona główna po usługach): nagłówek mono, cztery lekkie kolumny na jasnym tle
  (1 → 2 → 4) z kreską 1 px nad krokiem jak `FactRow`: numer mono `--muted` (jedyna numeracja na stronie głównej, bo to
  faktyczna kolejność), tytuł w roli title, opis `--muted`. Bez kafli. Kroki dzielą wiersze przez subgrid, więc numery,
  tytuły i opisy stoją w rzędzie w jednej linii także przy dwuliniowych tytułach. Hover (tylko `hover: hover`, jak w FAQ):
  limonkowe tło kolumny pod kreską (kreska zostaje), tekst `#101318`, numer i opis `#3F4A12`, treść wcięta o 12 px
  (`translateX`, 0,4 s `--ease`), a w prawym dolnym rogu wyłania się duży numer kroku (8% `#101318` na limonce, ucięty krawędzią).
  Kroki są nieklikalne: bez strzałek i bez fokusu. Gdy sekcja jest w widoku, kroki podświetlają się po kolei w pętli (01 → 04 → 01,
  1,4 s na krok), tak samo jak na hover, także na dotyku; hover ma pierwszeństwo. Bez przycisku pauzy. Przy reduced motion
  bez przebiegu, wcięcie 12 px bez animacji.
- **FAQ** (`FaqSection`, strona główna przed stopką, bez własnego CTA): wiersze z obrysem 1 px jak lista usług, natywne `details` / `summary` bez JS. Pytanie w roli title (bez numeru), „+” w mono obracany o 45° po otwarciu. Hover (tylko `hover: hover`): limonkowe tło, tekst `#101318`, pytanie wcięte `translateX` (12 px, od 1024 px 6 px, tyle co dawny `padding-inline`), „+” cofnięty o 12 px od prawej krawędzi, 0,4 s `--ease`; wiersz i sąsiedzi się nie ruszają. Fokus z klawiatury: obrys 2 px, bez limonki. Przy reduced motion wcięcie bez animacji. Odpowiedź w kolumnie pytania, maks. 60 znaków w wierszu.
- **Naklejka**: SVG 72–120 px z białym obrysem 4 px, pojawia się pod kursorem w stopce (i na 404), nie w hero
  strony głównej (tam jest już obiekt 3D). Pop scale 0→1, losowa rotacja ±25°, znika po 2.4 s.
- **Kursor**: limonkowa strzałka z gradientem, podąża z opóźnieniem (lerp 0.18); tylko
  na urządzeniach ze wskaźnikiem `fine`. Nad elementem interaktywnym (link, przycisk, pole, `summary`,
  element z `tabindex`) strzałka płynnie (0.28 s, `--ease`) zmienia się w limonkowy pierścień ~40 px
  (półprzezroczyste wypełnienie, obrys z gradientu, ta sama poświata); nad elementem przeciąganym
  (`data-cursor="grab"`) w małą pełną kropkę, która przy wciśnięciu się ściska. Dwa stany dedykowane, ten sam krążek ~40 px z obrysem
  z gradientu, ale pełny limonkowy: nad pytaniem FAQ (`data-cursor="help"`) z „?” (`#101318`, sans 600),
  a przy otwartym pytaniu z „−”; nad „Umów rozmowę ↗” (`data-cursor="calendar"`) z ikoną kalendarza
  (obrys `#101318` 2 px, dwa uszka, kropka). Systemowy kursor jest
  ukryty wszędzie (także I-beam przy tekście). Nad żywą ramką strony klienta i przewijanym telefonem zostaje kursor systemowy.
  Na limonkowym tle (podświetlone wiersze, przyciski accent, sceny, marquee, „Następny projekt”) kursor się odwraca: strzałka i kropka `#101318` z jasnym obrysem, pierścień z ciemnym obrysem i ciemnym półprzezroczystym wypełnieniem, krążki ciemne z limonkowym znakiem, ciemny cień zamiast poświaty; przejście 0.28 s `--ease`. Tło wykrywa się samo z tego, co widać pod wskaźnikiem (stos `elementsFromPoint`, także warstwy stałe bez tła jak HUD): decyduje pierwsze nieprzezroczyste `background-color` (plus `::before` wierzchniego elementu; przy trwającym przejściu wartość końcowa), bez oznaczania komponentów; liczone przy zmianie elementu, przy przejściu tła i raz po kliknięciu, nigdy co klatkę. Zdjęcie, wideo lub canvas nad tłem zostawia kursor limonkowy.

## Motion

Jedna orkiestracja wejścia, bez preloadera: gdy fonty są gotowe (najpóźniej 300 ms po załadowaniu JS), po 250 ms rusza reveal
linii nagłówka hero ze staggerem; w hero strony głównej razem z nim litery 3D „no–fuss” układają się z rozrzutu w napis, 1,6 s ease-in-out;
potem reveal przy wejściu w viewport, ale tylko tam, gdzie niesie rytm: nagłówki sekcji (etykieta mono,
linie statementu, nagłówek stopki) i kafle (realizacje, wydarzenia). Wiersze list, akapity, kroki procesu,
logotypy i CTA pod listami są widoczne od razu (`Reveal` + `.fade`/`Fade`, opacity + translateY(16px),
900 ms, stagger 80 ms na `--i`). Na samym końcu nagłówka stopki limonka „zamieszania” wjeżdża od prawej do lewej
(900 ms `--ease`, 900 ms po tym, jak słowo wejdzie w kadr, więc już po wjeździe linii). Elementy z własną animacją (marquee, taśma filmowa, scena 3D) i warstwy
stałe (Hud, kursor, siatka) poza revealem. Smooth scroll przez Lenis. Przy
`prefers-reduced-motion: reduce` wyłączone: Lenis, scramble, naklejki, obrót obiektu 3D, animacja smug, układanie liter
(napis od razu ułożony); reveal zamienia się w natychmiastowe pokazanie (hero bez czekania na fonty),
a kotwice skaczą natychmiast.

Hover w sekcjach treści mówi jednym językiem (wzór: FAQ): limonkowe tło i wcięcie 12 px transformem, 0,4 s `--ease`
(„Co robimy”, „Jak pracujemy”, dzień w kaflu nadchodzącego wydarzenia), albo obraz 1.03 w masce (kafel realizacji, 0,9 s `--ease`;
kafel minionego wydarzenia: powolne powiększenie do 1.2, 2 s `ease-out`). Działa tylko przy `(hover: hover)`, więc tap na dotyku go nie przykleja;
przy reduced motion bez przejść i bez ruchu (limonka od razu). FAQ wcina tak samo: `translateX` pytania i `translate` „+”, 0,4 s `--ease`.

## Do's and Don'ts

- Rób: jeden kolor akcentu; na jasnym zawsze jako tło. Nie rób: limonkowego tekstu ani ikon na `#FCFCFB`.
- Rób: metadane w mono, wersalikami. Nie rób: mono w akapitach.
- Rób: ostre rogi. Nie rób: `border-radius` na kaflach i przyciskach.
- Rób: jedna scena 3D na stronę. Nie rób: dodatkowych canvasów w sekcjach treści.
- Rób (strona główna): numery tylko tam, gdzie oznaczają kolejność (kroki procesu). Nie rób: liczników „01–05”
  przy nagłówkach sekcji ani numerów wierszy list usług i pytań (poza licznikiem realizacji „01–06” — liczba kafli).
- Rób: jeden głośny element na ekran. Nie rób: naklejek, smug i obiektu 3D w jednej sekcji.
- Nie odtwarzamy: tunelu scrollowanego i dźwięku (decyzja z 2026-09-21).

## Kontekst marki

no-fuss to duet: Magda Nestorowicz (design i produkt) i Kuba Fedoszczak (kod). Strona mówi
w liczbie mnogiej i ma pozyskiwać klientów usługowych: case'y klientów to narzędzie sprzedaży
(zadanie → co zrobiliśmy → efekt) z uczciwie oznaczoną rolą no-fuss.

- **OurMoney**: jedyny produkt własny duetu (wspólny budżet dla par, budowany razem).
- **AION MIND**: etat Magdy (Product Designer od 01.2025, od czerwca 2026 Head of Operations),
  **nie** produkt no-fuss. Komunikujemy „produkt, w którym Magda pracuje / który współtworzy”,
  nigdy „produkt własny”. Pierwszy termin faktów to „Rola” (nie „Rola no-fuss”), wartość: „— (etat Magdy, nie projekt no-fuss)”.
- **Busy Bee**: design Magdy, kod Michał Gabryelewicz (Webflow, spoza no-fuss). Marki na taśmie
  to klienci Busy Bee Film, nie no-fuss, i podpis to mówi.
- **OTB Ventures**: design Magdy razem z Piotrem Chuchłą; kto kodował, brak danych (wiersz pominięty).
- **Automation House**: etat Kuby (pracodawca: Automation House by Tigers), **nie** klient no-fuss.
  Kod Kuby na etacie, design Magdy. Etykiety jak przy AION MIND: „Etat Kuby” w kickerze i na kaflu,
  „Firma” zamiast „Klient” w faktach, bez wiersza „Klient” w hero.
- **Sassy**: eksperyment i warsztat Magdy, nie zlecenie.

Nie wymyślamy liczb, wyników ani cytatów: efekt to fakt (np. działająca strona, zakres).

## Podstrona „O nas" (v5)

- **Hero**: jasne tło, nagłówek display w trzech liniach („Dwie osoby, / agenci AI, / zero zamieszania”)
  i lead w kroju statement; pod leadem `ContactCta`. H1 ma `max-width: 12ch` i `min-width: min-content`, lead
  `max-width: 30ch`; od 1024 px zajmują odpowiednio kolumny 1–7 i 8–12. Bez sceny 3D i bez duetu paneli.
- **Trzy karty**: ciemny pas `#101318`, karty `#15181D` z obrysem 1 px: Magda (P1), Kuba (P2), agenci AI (P3,
  ciemny kadr `#101318` bez kresek z robotem liniami w limonce). Nagłówek h2, chip „P1”… przyklejony do prawego
  górnego rogu karty, zdjęcie (Magda i Kuba: portrety przycięte przez `object-fit: cover` i `photo.focus`), role jako
  tagi (`align-content: flex-start`), bio, lista `dl` w mono i linki social pod spodem. Poniżej 900 px jedna kolumna,
  kadr portretu ma maks. `60svh`; kadr agentów AI jest 16:9 na każdej szerokości. Od 900 px dwie kolumny z poziomą
  kartą (zdjęcie z lewej), a trzecia karta zajmuje cały rząd; od 1200 px trzy pionowe karty obok siebie ze zdjęciem
  4:3. Karty w rzędzie trzymają wspólne wiersze (subgrid): zdjęcia, role, bio, fakty i linki zaczynają się na tej
  samej wysokości. Hover linków tylko przy `(hover: hover)`.
- **Marquee**: limonkowy pasek, rola `h2` wersalikami, separator „✦”, pętla 22 s; stoi przy reduced motion.
  Cały pasek ma fade-in on-scroll (`Reveal`); pętla jedzie na `translate`, więc nie koliduje z reveal `transform`.
- **Kto co robi**: nagłówek mono, wiersze z torem 2 px i rombem 18 px w akcencie; pozycja rombu (`--v`, 0% = Magda,
  100% = Kuba) jedzie od środka po wejściu w viewport. Legenda nad torami: Magda z lewej, Kuba z prawej; pod wierszami
  `ContactCta`.
- **Social i posty** (`#social`, `#posty`): nagłówek przyklejony po lewej (od 1024 px), lista wierszy po prawej
  z obrysem 1 px między wierszami. Hover (tylko myszą) i fokus dają limonkowe tło, przesuwają tytuł o 12 px
  transformem, a strzałki cofają do środka wiersza o 8 px; e-mail używa `text-indent: 12px`. `#posty` jest ciemne,
  `#social` ciemne bez postów, jasne z postami. Metadane w mono 12 px; placeholdery są niedostępne.
- **Na żywo** (`#wydarzenia`): ten sam układ, zawsze w jasnej tonacji. Najbliższe wydarzenia i wiersz
  „Wszystkie wydarzenia →” do zakładki „Wiedza” (`/wiedza`).
- **Oklej nas** (`#play`): plansza z sześcioma naklejkami przeciąganymi wskaźnikiem i dotykiem. Naklejki to dekoracja poza kolejnością Tab.
  Zdjęcia i naklejki mają fade-in on-scroll ze staggerem przyciętym do 5 kroków (naklejki pozycjonowane `left`/`top`, bez konfliktu z `transform` reveal).
  Dwa układy: poziomy od 768 px 1:1 z legacy (86svh, zdjęcia 300 px, naklejki po bokach zdjęć) i pionowy (telefon, tablet w pionie):
  plansza na wysokość treści, podpowiedź pod tytułem, zdjęcia 44vw (do 450 px), naklejki skalowane z szerokością ekranu (65% przy 390 px)
  na rogach i szwie zdjęć, nie na twarzach. Pozycje startowe są przycięte do planszy (nic nie wystaje za krawędź).
- Okrągłe kształty dozwolone tylko w warstwie zabawy (naklejki), nie w UI.

## Zakładka „Wiedza” (`/wiedza`)

„Przekazujemy wiedzę dalej”: warsztaty, prelekcje i meetupy, na których Magda i Kuba dzielą się doświadczeniem.

- **Hero**: jak na „O nas” (jasne tło, nagłówek display w dwóch liniach, lead w kroju statement).
- **Nadchodzące** (ciemna sekcja): nagłówek mono z licznikiem, kafle `#272A2F` w dwóch kolumnach od 768 px, odstęp 16 px (`--event-gap`). W kaflu
  limonkowy tag formatu, w prawym górnym rogu opcjonalne logo wydarzenia (przezroczyste tło, 40 px wysokości, od 1024 px 48 px),
  data w roli display („14.11”, wielodniowe „17–18.11”) z mono „2026 · SOB · 10:00”,
  tytuł w roli title 700, opis `--muted`, fakty „Gdzie” / „Kto” w mono 12 px z kreską 1 px i przycisk zapisów (accent)
  na dole kafla. Hover kafla (tylko przy myszy,
  a z klawiatury przy fokusie na przycisku w kaflu): dzień daty dostaje limonkowe tło i wcięcie 12 px jak wiersze FAQ (0,4 s);
  kafel nie jest linkiem, więc bez strzałki i bez zmiany kursora. Bez wydarzeń jedno zdanie
  w roli title. Pod listą zaproszenie w roli lead z linkiem do kontaktu (podkreślenie, hover limonkowy).
- **Minione** (jasna sekcja): kafle jak realizacje: zdjęcie 16:10 bez ramki z tagiem formatu w prawym górnym rogu i opcjonalnym
  logo wydarzenia w lewym (jasne logo bez tła, wprost na zdjęciu, 7 px od góry i 10 px od lewej, 16 px wysokości), wiersz mono
  data | gdzie (bez znanego dnia sam miesiąc „06.2026”), tytuł w roli title 700, opis, osoby w mono 12 px, opcjonalny link do nagrania „↗”. Kolumny 1 → 2 (640 px) → 3 (1024 px),
  odstęp 56 px pion / 16 px poziom (`--event-gap`, kafle wydarzeń luźniej niż `--gap` 8 px). Bez zdjęcia placeholder w ukośne kreski („Zdjęcie z wydarzenia 16:10”).
  Z logo: wewnętrzny cień od górnej krawędzi zdjęcia (logo czytelne także na jasnym zdjęciu). Hover: zdjęcie (albo placeholder)
  powoli powiększa się do 1.2 w masce 16:10 (2 s `ease-out`); kafel nie jest linkiem, strzałka tylko w linku do nagrania.
- Wydarzenie przechodzi z nadchodzących do minionych samo, następnego dnia po dacie (wielodniowe: po ostatnim dniu; czas warszawski).
- **Zajawka na stronie głównej** (`#wiedza`, po „O nas”, ciemna): etykieta mono „Wiedza”, nagłówek h2 „Przekazujemy wiedzę dalej”,
  „Zobacz wszystko →” po prawej (od 768 px) i trzy kafle spośród wyróżnionych (`featured`): najbliższe nadchodzące i najnowsze minione.
  Kafle z tym samym hoverem co na `/wiedza`.

## Komponenty case study

Wspólny szkielet: ciemne hero (chip „Case study” + kicker mono, tytuł mega, lead statement, fakty w `dl` mono),
sekcje naprzemiennie jasne i ciemne, blok CTA kontaktu, limonkowy blok „Następny projekt” na końcu. `/ourmoney`
od `03.5` ma rytm: jasne `03.5`, ciemne `04`, jasne `05`, ciemne `06`, jasne `07`, ciemne CTA. `/otb`,
`/busy-bee` i `/automation-house`: `01` ciemne, `02` jasne, `03` ciemne, `04` jasne, CTA ciemne.
Fakty w hero zaczynają się od „Rola no-fuss”, a przy `ownership: "employment"` (AION MIND, Automation House)
od „Rola”; dalej „Zakres”, „Czas”, „Klient” (jeśli jest), „Wynik” (tylko fakt, np. działająca strona z linkiem
„↗”), potem fakty specyficzne. Ten sam `dl` mono-sm z `FactRow`, bez nowych rozmiarów. Produkty mają sekcje z
etykietą mono po lewej i tekstem lub wizualizacją; strony WWW sekcje „lite”.

- **CaseStage**: limonkowa scena zaraz pod hero, na pełną szerokość. Wariant z telefonami: trzy makiety obok siebie,
  wystające poza dolną krawędź (środkowa wyżej). Wariant z obrazem: jedna grafika bez marginesów.
- **LiveFrame**: limonkowa scena z ramką przeglądarki `#101318` (trzy kwadratowe kropki, pasek adresu mono 12 px
  w pasku 48 px, bez zaokrągleń i cieni), 48 px oddechu dookoła. Nieprzyciemniony poster nie ma nakładki na całość:
  przycisk „Otwórz na żywo ↗” jest w prawym dolnym rogu, ma min. 48 px, hover −2 px tylko myszą i obrys accent
  z ciemną obwódką przy fokusie. Żywa strona w skali 1440×900 ładuje się tylko po kliknięciu; fokus trafia na
  okno `role="group"` z obrysem accent. Na telefonie przycisk ma inset 8 px, padding 12/16 i otwiera nową kartę.
- **FilmStrip**: taśma filmowa na `#101318` z perforacją u góry i u dołu (paski 12 px w `#FCFCFB` na 60%),
  klatki z podpisem mono pojawiającym się na hover, fokus i przy aktywnej klatce. Przeciąganie myszą,
  natywny scroll ze snapem, autoprzewijanie co 3,2 s z przyciskiem „Pauza” / „Wznów” (mono) w prawym górnym rogu.
- **PhoneScroller**: makieta telefonu (szerokość do 340 px) z ekranem 640 px i własnym scrollem; w środku cała strona
  mobilna klienta. Fokus: obrys 2 px w akcencie z odstępem 4 px. Na dotyku ekran ma max ~56svh i przewija się
  dopiero po tapnięciu (komunikat mono „Dotknij, aby przewijać”).
- **DragBall**: rekonstrukcja hero otb.vc w polu 16:9 z paletą klienta (czerwień, granat, jasny błękit jako stałe
  z legacy), dwa napisy w roli display 400, podpis mono pod polem (`--muted` sekcji), kula 22% szerokości z gradientem,
  za którą idą smugi tła.
  Kula to jedyna krągłość w sekcji (warstwa zabawy), pole jest ostre.
- **ToySwitcher**: lista zabawek i obraz 16:10 z podpisem mono. Poniżej 1024 px podgląd stoi wizualnie nad listą,
  choć w DOM `tablist` zostaje przed `tabpanel`. Aktywny wiersz ma strzałkę i nazwę od lewej, tag dosunięty w prawo
  przez `margin-left: auto`; nieaktywne są `--muted`, obraz przenika 0,5 s.
- **SplitCalculator**: kafel `--tile`, trzy przyciski modeli z obrysem 1 px (aktywny na limonce), trzy suwaki
  z torem 2 px i uchwytem-rombem w akcencie, pasek wyniku 72 px dzielony limonka / jasny z kwotami w roli title.
- **JournalScreen**: ekran Dziennika AION MIND w makiecie telefonu. To rekonstrukcja cudzej aplikacji, więc ma
  własną jasną paletę (`--jr-*`), zaokrąglenia i drobne rozmiary pikselowe ekranu; krój `var(--sans)`.
- **Makiety telefonów**: ciemny korpus z obrysem `#3a3f47`, dynamic island i przyciskiem bocznym. Zaokrąglenia
  korpusu i ekranu to ilustracja sprzętu, nie UI.
- **W skrócie** (`CaseStory`, strony WWW): pierwsza sekcja „lite” po `LiveFrame`, `dl` z trzema wierszami
  „Zadanie” (albo „Problem”, gdy wynika z danych) / „Co zrobiliśmy” / „Efekt”: termin mono, wartość w roli lead,
  kreska 1 px nad wierszem (`FactRow`), od 1024 px trzy kolumny z odstępem kolumn `var(--gutter)` (56 px; wyjątek od
  `column-gap: 8px`, bo 8 px zlewało sąsiednie kolumny tekstu lead; kolumny są symetryczne wobec środkowej linii siatki).
- **Blok CTA** (każdy case, przed „Następny projekt”): sekcja w tonacji przeciwnej do ostatniej sekcji,
  nagłówek w roli h2 („Chcesz podobny projekt?”), jedno zdanie w roli lead (`--muted`, do 40 znaków szerokości)
  i `ContactCta` („Porozmawiajmy →” do `#kontakt`, „Umów rozmowę ↗”). Odsłania się jak sekcja (stagger 0–2).
- **Następny projekt**: ostatnie słowo + twarda spacja + strzałka są jednym `nowrap`; do 479 px tytuł używa
  `--t-display` (40 px) zamiast `--t-mega`, żeby najdłuższe nazwy nie wychodziły poza `.line`.
- **Fakty (strony WWW)**: wielkie wiersze `dl` (termin mono, wartość w roli h2, limonkowy chip technologii, link ze
  strzałką „↗”) albo kafle 2 / 4 kolumny (Sassy).

## Komponenty dodane 2026-09-21

- **Testimonial**: kafel `tile` lub limonkowy, cytat w kroju statement, cudzysłów 96 px w akcencie,
  podpis mono z kwadratowym awatarem 44 px. Układ 7 + 5, trzeci kafel z offsetem.
- **E-mail**: przy myszy (`pointer: fine`) klik kopiuje adres do schowka i na 1,8 s zamienia etykietę
  na „Skopiowano ✓"; na dotyku i bez Clipboard API to zwykły `mailto:`.
