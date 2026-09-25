---
name: no-fuss
version: 0.1.0
source: układ, typografia i motion z haoqi.design (computed styles, 2026-09-21); paleta z Figmy no-fuss
colors:
  # Źródło: Figma OoTIQaKer6V1uxTwwGvXK4, node 351:24343 + decyzja Magdy o jasnych sekcjach (2026-09-21)
  base:
    light: "#FCFCFB"       # jasne sekcje
    dark: "#101318"        # Dark - Light/900: hero, stopka, preloader
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

Akcent występuje jako **tło** (tagi, zaznaczenie, `mark` w nagłówku, pasek preloadera) z tekstem
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
72 / 96 px. Hero i stopka mają pełną wysokość ekranu. Hero strony głównej od 768 px stoi po przekątnej:
h1 w lewym górnym rogu, lead i CTA w prawym dolnym, napis 3D w pasie między nimi (dopasowany do wysokości
pasa); na telefonie napis nad tekstem, tekst na dole ekranu. Kafle realizacji układają się
asymetrycznie (od 1024 px): duży kafel na 8 kolumn dosunięty do prawej, potem pary 5+5, potem trójki
o różnych offsetach; 768–1023 px duży kafel zostaje, reszta w dwóch równych kolumnach. Pod każdym
kaflem wiersz mono: nazwa po lewej, rok po prawej (rok ze strzałką zawsze w jednej linii).

Stała warstwa `position: fixed` (siatka ma najniższy z-index: nad tłami sekcji, pod całą treścią; HUD leży na wierzchu):
- **siatka**: 3 piony (lewy gutter, środek, prawy gutter) i 2 poziomy (⅓ i ⅔ wysokości),
  z przerwą 12 px wokół przecięć i krzyżykiem 12 px w każdym przecięciu; rysowana na biało
  w `mix-blend-mode: difference`, więc sama odwraca się na każdym tle,
- **HUD**: logo i nawigacja u góry, pasek postępu scrolla przy prawej krawędzi
  (nav w mono 12 px poniżej 480 px; link „Wiedza” dopiero od 640 px, niżej nie mieści się obok logo).
  Fokus w HUD: biały obrys 2 px, odwracany razem z HUD.

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
- **CTA kontaktu** (`ContactCta`): przycisk accent „Porozmawiajmy →” (do stopki `#kontakt`) + ghost
  „Umów rozmowę ↗” (kalendarz); przyciski prostokątne, min. 48 px, odstęp 8 px, zawijają się na wąskich
  ekranach. Bez adresu kalendarza ghosta nie ma (także w stopce), zamiast wyszarzonego przycisku. Pod h1 w hero
  i pod listą usług; pod FAQ na stronie głównej tylko zdanie, bo zaraz niżej jest stopka. Na `/o-nas` pod leadem hero
  (od 1024 px w kolumnie leadu 9–12, 32 px pod nim) i na końcu „Kto co robi” (48 px pod ostatnim wierszem, od lewej
  krawędzi treści), przed `#social`.
- **Lista usług** (`ServicesList`, strona główna `#uslugi`): wiersze z obrysem 1 px (`--ink` 18%), nazwa w roli title, opis
  `--muted`, bez numerów. Wiersze nie są linkami, ale hover (tylko `hover: hover`) daje im to co w FAQ: limonkowe tło,
  tekst `#101318`, opis `#3F4A12` (7,92:1) i wcięcie 12 px transformem nazwy i opisu (0,4 s `--ease`; wiersz i sąsiedzi
  się nie ruszają). Bez strzałki i bez zmiany kursora; przy reduced motion wcięcie 12 px bez animacji.
- **Jak pracujemy** (`ProcessSection`, strona główna po usługach): nagłówek mono, cztery lekkie kolumny na jasnym tle
  (1 → 2 → 4) z kreską 1 px nad krokiem jak `FactRow`: numer mono `--muted` (jedyna numeracja na stronie głównej, bo to
  faktyczna kolejność), tytuł w roli title, opis `--muted`. Bez kafli. Kroki dzielą wiersze przez subgrid, więc numery,
  tytuły i opisy stoją w rzędzie w jednej linii także przy dwuliniowych tytułach. Hover (tylko `hover: hover`, jak w FAQ):
  limonkowe tło kolumny pod kreską (kreska zostaje), tekst `#101318`, numer i opis `#3F4A12`, treść wcięta o 12 px
  (`translateX`, 0,4 s `--ease`). Kroki są nieklikalne: bez strzałek i bez fokusu. Przy reduced motion wcięcie 12 px bez animacji.
- **FAQ** (`FaqSection`, strona główna przed stopką, bez własnego CTA): wiersze z obrysem 1 px jak lista usług, natywne `details` / `summary` bez JS. Pytanie w roli title (bez numeru), „+” w mono obracany o 45° po otwarciu. Hover (tylko `hover: hover`): limonkowe tło, tekst `#101318`, pytanie wcięte `translateX` (12 px, od 1024 px 6 px, tyle co dawny `padding-inline`), „+” cofnięty o 12 px od prawej krawędzi, 0,4 s `--ease`; wiersz i sąsiedzi się nie ruszają. Fokus z klawiatury: obrys 2 px, bez limonki. Przy reduced motion wcięcie bez animacji. Odpowiedź w kolumnie pytania, maks. 60 znaków w wierszu.
- **Preloader**: pasek 110×4 px na środku, limonkowy na 25% bieli, tło `#101318`, po wypełnieniu kurtyna
  odjeżdża w górę (1 s). Pasek czeka na fonty (`document.fonts.ready`) i trwa od 600 ms do 1200 ms.
  Tylko przy pierwszym wejściu, nie przy nawigacji między stronami. Na czas paska treść pod kurtyną jest `inert`
  (Tab nie chodzi pod zasłoną). Przy reduced motion preloadera nie ma.
- **Naklejka**: SVG 72–120 px z białym obrysem 4 px, pojawia się pod kursorem w stopce (i na 404), nie w hero
  strony głównej (tam jest już obiekt 3D). Pop scale 0→1, losowa rotacja ±25°, znika po 2.4 s.
- **Kursor**: limonkowa strzałka z gradientem, podąża z opóźnieniem (lerp 0.18); tylko
  na urządzeniach ze wskaźnikiem `fine`. Nad elementem interaktywnym (link, przycisk, pole, `summary`,
  element z `tabindex`) strzałka płynnie (0.28 s, `--ease`) zmienia się w limonkowy pierścień ~40 px
  (półprzezroczyste wypełnienie, obrys z gradientu, ta sama poświata); nad elementem przeciąganym
  (`data-cursor="grab"`) w małą pełną kropkę, która przy wciśnięciu się ściska. Element fokusowalny, ale nieklikalny (kafle kroków procesu),
  dostaje `data-cursor="arrow"` i zostaje strzałką. Dwa stany dedykowane, ten sam krążek ~40 px z obrysem
  z gradientu, ale pełny limonkowy: nad pytaniem FAQ (`data-cursor="help"`) z „?” (`#101318`, sans 600),
  a przy otwartym pytaniu z „−”; nad „Umów rozmowę ↗” (`data-cursor="calendar"`) z ikoną kalendarza
  (obrys `#101318` 2 px, dwa uszka, kropka). Systemowy kursor jest
  ukryty wszędzie (także I-beam przy tekście). Nad żywą ramką strony klienta i przewijanym telefonem zostaje kursor systemowy.
  Na limonkowym tle (podświetlone wiersze, przyciski accent, sceny, marquee, „Następny projekt”) kursor się odwraca: strzałka i kropka `#101318` z jasnym obrysem, pierścień z ciemnym obrysem i ciemnym półprzezroczystym wypełnieniem, krążki ciemne z limonkowym znakiem, ciemny cień zamiast poświaty; przejście 0.28 s `--ease`. Tło wykrywa się samo z tego, co widać pod wskaźnikiem (stos `elementsFromPoint`, także warstwy stałe bez tła jak HUD): decyduje pierwsze nieprzezroczyste `background-color` (plus `::before` wierzchniego elementu; przy trwającym przejściu wartość końcowa), bez oznaczania komponentów; liczone przy zmianie elementu, przy przejściu tła i raz po kliknięciu, nigdy co klatkę. Zdjęcie, wideo lub canvas nad tłem zostawia kursor limonkowy.

## Motion

Jedna orkiestracja wejścia (preloader → kurtyna → reveal linii nagłówka ze staggerem; w hero strony głównej razem z nim
litery 3D „no–fuss” układają się z rozrzutu w napis, 1,6 s ease-in-out),
potem reveal przy wejściu w viewport, ale tylko tam, gdzie niesie rytm: nagłówki sekcji (etykieta mono,
linie statementu, nagłówek stopki) i kafle (realizacje, wydarzenia). Wiersze list, akapity, kroki procesu,
logotypy i CTA pod listami są widoczne od razu (`Reveal` + `.fade`/`Fade`, opacity + translateY(16px),
900 ms, stagger 80 ms na `--i`). Na samym końcu nagłówka stopki limonka „zamieszania” wjeżdża od prawej do lewej
(900 ms `--ease`, 900 ms po tym, jak słowo wejdzie w kadr, więc już po wjeździe linii). Elementy z własną animacją (marquee, taśma filmowa, scena 3D) i warstwy
stałe (Hud, kursor, siatka, preloader) poza revealem. Smooth scroll przez Lenis. Przy
`prefers-reduced-motion: reduce` wyłączone: Lenis, scramble, naklejki, obrót obiektu 3D, animacja smug, układanie liter
(napis od razu ułożony); reveal zamienia się w natychmiastowe pokazanie. Przy reduced motion nie ma też preloadera (ani klatki kurtyny),
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
  nigdy „produkt własny”. Rola no-fuss w faktach: „—”.
- **Busy Bee**: design Magdy, kod Michał Gabryelewicz (Webflow, spoza no-fuss). Marki na taśmie
  to klienci Busy Bee Film, nie no-fuss, i podpis to mówi.
- **OTB Ventures**: design Magdy razem z Piotrem Chuchłą; kto kodował, brak danych (wiersz pominięty).
- **Automation House**: design (Magda) i kod (Kuba), od discovery do wdrożenia.
- **Sassy**: eksperyment i warsztat Magdy, nie zlecenie.

Nie wymyślamy liczb, wyników ani cytatów: efekt to fakt (np. działająca strona, zakres).

## Podstrona „O nas" (v5)

- **Hero**: jasne tło, nagłówek display w trzech liniach („Dwie osoby, / agenci AI, / zero zamieszania”)
  i lead w kroju statement; pod leadem `ContactCta`. Bez sceny 3D i bez duetu paneli (odznaka „×” z v4 usunięta).
- **Trzy karty**: ciemny pas `#101318`, karty `#15181D` z obrysem 1 px: Magda (P1), Kuba (P2), agenci AI (P3,
  ciemny kadr `#101318` bez kresek z robotem liniami w limonce, żeby nie krzyczał obok portretów). Nagłówek h2, chip „P1”…
  przyklejony do prawego górnego rogu karty (jak tag kafla realizacji),
  zdjęcie (Magda i Kuba: prawdziwe portrety 1:1 przycięte do kadru), role jako tagi, bio,
  lista `dl` w mono (termin | wartość w jednym wierszu) ze wskaźnikiem „Zamieszanie 0%”, linki social pod spodem.
  Poniżej 900 px jedna kolumna, od 900 px dwie kolumny (w karcie zdjęcie z lewej), od 1200 px trzy karty
  pionowe obok siebie ze zdjęciem 4:3. Karty w rzędzie trzymają wspólne wiersze (subgrid): zdjęcia, role, bio,
  fakty i linki zaczynają się na tej samej wysokości, także przy jednoliniowej nazwie („Agenci AI”).
- **Marquee**: limonkowy pasek, rola `h2` wersalikami, separator „✦”, pętla 22 s; stoi przy reduced motion.
  Cały pasek ma fade-in on-scroll (`Reveal`); pętla jedzie na `translate`, więc nie koliduje z reveal `transform`.
- **Kto co robi**: nagłówek mono, wiersze z torem 2 px i rombem 18 px w akcencie; pozycja rombu (`--v`, 0% = Magda,
  100% = Kuba) jedzie od środka po wejściu w viewport. Legenda nad torami: Magda z lewej, Kuba z prawej; pod wierszami
  `ContactCta`.
- **Social i posty** (`#social`, `#posty`): nagłówek przyklejony po lewej (od 1024 px), lista wierszy po prawej
  z obrysem 1 px między wierszami; hover i fokus dają wierszowi limonkowe tło. Posty w ciemnej tonacji,
  metadane w mono 12 px. Linki-placeholdery wyglądają jak linki, ale są oznaczone jako niedostępne.
- **Na żywo** (`#wydarzenia`): ten sam układ co social i posty, w tonacji przeciwnej do sekcji nad nią. Najbliższe
  wydarzenia i wiersz „Wszystkie wydarzenia →” do zakładki „Wiedza” (`/wiedza`).
- **Oklej nas** (`#play`): plansza z sześcioma naklejkami przeciąganymi wskaźnikiem, dotykiem i strzałkami z klawiatury.
  Zdjęcia i naklejki mają fade-in on-scroll ze staggerem przyciętym do 5 kroków (naklejki pozycjonowane `left`/`top`, bez konfliktu z `transform` reveal).
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
sekcje naprzemiennie jasne i ciemne, blok CTA kontaktu, limonkowy blok „Następny projekt” na końcu.
Fakty w hero zaczynają się zawsze od standardowych, w tej kolejności: „Rola no-fuss”, „Zakres”, „Czas”,
„Klient” (jeśli jest), „Wynik” (tylko fakt, np. działająca strona z linkiem „↗”); potem fakty specyficzne
(platformy, sklepy, stack). Ten sam `dl` mono-sm z `FactRow`, bez nowych rozmiarów. Produkty (OurMoney, AION MIND)
mają sekcje z etykietą mono po lewej i tekstem lub układem tekst + wizualizacja; strony WWW mają sekcje „lite”
(wiersz mono: etykieta po lewej, podpowiedź po prawej, pod spodem treść na pełną szerokość).

- **CaseStage**: limonkowa scena zaraz pod hero, na pełną szerokość. Wariant z telefonami: trzy makiety obok siebie,
  wystające poza dolną krawędź (środkowa wyżej). Wariant z obrazem: jedna grafika bez marginesów.
- **LiveFrame**: limonkowa scena z ramką przeglądarki `#101318` (trzy kwadratowe kropki, pasek adresu mono 12 px
  w pasku 48 px, bez zaokrągleń i cieni), 48 px oddechu dookoła. Najpierw zawsze poster z przyciskiem „Otwórz na żywo ↗”
  (wszystkie case'y WWW), żywa strona w skali 1440×900 dopiero po kliknięciu; na telefonie przycisk otwiera nową kartę.
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
- **ToySwitcher**: lista zabawek po lewej (rola title, wiersze z obrysem 1 px, aktywna w kolorze tekstu ze strzałką
  „→” i wcięciem 12 px, nieaktywne `--muted`, tag w mono), obraz 16:10 po prawej z przenikaniem 0,5 s i podpisem mono.
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
- **Fakty (strony WWW)**: wielkie wiersze `dl` (termin mono, wartość w roli h2, limonkowy chip technologii, link ze
  strzałką „↗”) albo kafle 2 / 4 kolumny (Sassy).

## Komponenty dodane 2026-09-21

- **Testimonial**: kafel `tile` lub limonkowy, cytat w kroju statement, cudzysłów 96 px w akcencie,
  podpis mono z kwadratowym awatarem 44 px. Układ 7 + 5, trzeci kafel z offsetem.
- **E-mail**: przy myszy (`pointer: fine`) klik kopiuje adres do schowka i na 1,8 s zamienia etykietę
  na „Skopiowano ✓"; na dotyku i bez Clipboard API to zwykły `mailto:`.
