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
  column-gap: "8px"   # jedna siatka wszędzie, także hero, stopka i suwak
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
i naklejki pod kursorem. Reszta jest cicha i precyzyjna. Nazwa zobowiązuje: bez ozdobników,
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
72 / 96 px. Hero i stopka mają pełną wysokość ekranu. Kafle realizacji układają się
asymetrycznie: duży kafel na 8 kolumn dosunięty do prawej, potem pary 5+5, potem trójki
o różnych offsetach. Pod każdym kaflem wiersz mono: nazwa po lewej, rok po prawej.

Stała warstwa `position: fixed` (siatka ma najniższy z-index: nad tłami sekcji, pod całą treścią; HUD leży na wierzchu):
- **siatka**: 3 piony (lewy gutter, środek, prawy gutter) i 2 poziomy (⅓ i ⅔ wysokości),
  z przerwą 12 px wokół przecięć i krzyżykiem 12 px w każdym przecięciu; rysowana na biało
  w `mix-blend-mode: difference`, więc sama odwraca się na każdym tle,
- **HUD**: logo i nawigacja u góry, pasek postępu scrolla przy prawej krawędzi
  (nav w mono 12 px poniżej 480 px). Fokus w HUD: biały obrys 2 px, odwracany razem z HUD.

## Elevation & Depth

Brak cieni i warstw w UI (efekty blur/glow z Figmy świadomie pominięte). Głębia pochodzi
z trzech źródeł: obiektu 3D w hero (WebGL, limonkowy materiał z clearcoatem i iryzacją), rozmytych smug gradientu za nim i trybu mieszania siatki.

## Shapes

Promień zaokrągleń: 0. Kafle, tagi i przyciski są prostokątne. Jedyne krągłości to obiekt 3D,
naklejki i kursor, czyli warstwa zabawy, nie warstwa interfejsu.

## Components

- **Tag**: mono 12 px, czarny tekst na limonce, padding 2×6 px, przyklejony do prawego górnego
  rogu kafla.
- **Kafel realizacji**: obraz w proporcji 16:10 lub 1:1, bez ramki; hover skaluje obraz
  do 1.03 w masce; podpis mono pod spodem.
- **Link nawigacji**: mono 14 px; hover uruchamia scramble znaków; przełączniki mają
  skrót w nawiasie kwadratowym, np. `MOTYW[A]`.
- **Link w tekście**: podkreślenie 1 px, na hover tło limonkowe.
- **CTA kontaktu** (`ContactCta`): przycisk accent „Porozmawiajmy →” (do stopki `#kontakt`) + ghost
  „Umów rozmowę ↗” (kalendarz); przyciski prostokątne, min. 48 px, odstęp 8 px, zawijają się na wąskich
  ekranach. Link bez adresu = nieklikalny, opacity .5. Pod h1 w hero, pod listą usług i pod FAQ.
- **Jak pracujemy** (`ProcessSection`, strona główna po usługach): nagłówek mono z licznikiem, cztery ciemne kafle
  `#101318` na jasnym tle (1 → 2 → 4 kolumny): numer w roli display, tytuł w roli title, opis `--muted` zawsze widoczny.
  Statyczne, bez hovera.
- **FAQ** (`FaqSection`, strona główna przed stopką): wiersze z obrysem 1 px jak lista usług, natywne `details` /
  `summary` bez JS. Numer mono, pytanie w roli title, „+” w mono obracany o 45° po otwarciu; hover daje wierszowi
  limonkowe tło i wcięcie 12 px, fokus obrys 2 px. Odpowiedź w kolumnie pytania, maks. 60 znaków w wierszu.
- **Preloader**: pasek 110×4 px na środku, limonkowy na 25% bieli, tło `#101318`, po wypełnieniu kurtyna
  odjeżdża w górę (1 s). Pasek czeka na fonty (`document.fonts.ready`) i trwa od 600 ms do 1200 ms.
  Tylko przy pierwszym wejściu, nie przy nawigacji między stronami.
- **Naklejka**: SVG 72–120 px z białym obrysem 4 px, pojawia się pod kursorem w hero
  (pop scale 0→1, losowa rotacja ±25°), znika po 2.4 s.
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

## Motion

Jedna orkiestracja wejścia (preloader → kurtyna → reveal linii nagłówka ze staggerem),
potem reveal sekcji przy wejściu w viewport. Smooth scroll przez Lenis. Przy
`prefers-reduced-motion: reduce` wyłączone: Lenis, scramble, naklejki, obrót obiektu 3D,
animacja smug; reveal zamienia się w natychmiastowe pokazanie.

## Do's and Don'ts

- Rób: jeden kolor akcentu; na jasnym zawsze jako tło. Nie rób: limonkowego tekstu ani ikon na `#FCFCFB`.
- Rób: metadane w mono, wersalikami. Nie rób: mono w akapitach.
- Rób: ostre rogi. Nie rób: `border-radius` na kaflach i przyciskach.
- Rób: jedna scena 3D na stronę. Nie rób: dodatkowych canvasów w sekcjach treści.
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
  i lead w kroju statement. Bez sceny 3D i bez duetu paneli (odznaka „×” z v4 usunięta).
- **Trzy karty**: ciemny pas `#101318`, karty `#15181D` z obrysem 1 px: Magda (P1), Kuba (P2), agenci AI (P3,
  limonkowe tło zdjęcia). Nagłówek h2 z chipem, zdjęcie (Kuba: prawdziwe, 1:1 przycięte do kadru; Magda: placeholder
  w ukośne kreski), role jako tagi, bio,
  lista `dl` w mono (termin | wartość w jednym wierszu) ze wskaźnikiem „Zamieszanie 0%”, linki social pod spodem.
  Poniżej 900 px jedna kolumna, od 900 px dwie kolumny (w karcie zdjęcie z lewej), od 1200 px trzy karty
  pionowe obok siebie ze zdjęciem 4:3.
- **Marquee**: limonkowy pasek, rola `h2` wersalikami, separator „✦”, pętla 22 s; stoi przy reduced motion.
- **Kto co robi**: nagłówek mono, wiersze z torem 2 px i rombem 18 px w akcencie; pozycja rombu (`--v`, 0% = Magda,
  100% = Kuba) jedzie od środka po wejściu w viewport. Legenda nad torami: Magda z lewej, Kuba z prawej.
- **Social i posty** (`#social`, `#posty`): nagłówek przyklejony po lewej (od 1024 px), lista wierszy po prawej
  z obrysem 1 px między wierszami; hover i fokus dają wierszowi limonkowe tło. Posty w ciemnej tonacji,
  metadane w mono 12 px. Linki-placeholdery wyglądają jak linki, ale są oznaczone jako niedostępne.
- **Oklej nas** (`#play`): plansza z sześcioma naklejkami przeciąganymi wskaźnikiem, dotykiem i strzałkami z klawiatury.
- Okrągłe kształty dozwolone tylko w warstwie zabawy (naklejki), nie w UI.

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
  w pasku 48 px, bez zaokrągleń i cieni), 48 px oddechu dookoła. W środku żywa strona klienta w skali 1440×900 albo poster
  z przyciskiem „Otwórz na żywo ↗” (OTB, Sassy, reduced motion, telefon i dotyk; na telefonie otwiera nową kartę).
- **FilmStrip**: taśma filmowa na `#101318` z perforacją u góry i u dołu (paski 12 px w `#FCFCFB` na 60%),
  klatki z podpisem mono pojawiającym się na hover, fokus i przy aktywnej klatce. Przeciąganie myszą,
  natywny scroll ze snapem, autoprzewijanie co 3,2 s z przyciskiem „Pauza” / „Wznów” (mono) w prawym górnym rogu.
- **PhoneScroller**: makieta telefonu (szerokość do 340 px) z ekranem 640 px i własnym scrollem; w środku cała strona
  mobilna klienta. Fokus: obrys 2 px w akcencie z odstępem 4 px. Na dotyku ekran ma max ~56svh i przewija się
  dopiero po tapnięciu (komunikat mono „Dotknij, aby przewijać”).
- **DragBall**: rekonstrukcja hero otb.vc w polu 16:9 z paletą klienta (czerwień, granat, jasny błękit jako stałe
  z legacy), dwa napisy w roli display 400, kula 22% szerokości z gradientem, za którą idą smugi tła.
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
  kreska 1 px nad wierszem (`FactRow`), od 1024 px trzy kolumny.
- **Blok CTA** (każdy case, przed „Następny projekt”): sekcja w tonacji przeciwnej do ostatniej sekcji,
  nagłówek w roli h2 („Chcesz podobny projekt?”), jedno zdanie w roli lead (`--muted`, do 40 znaków szerokości)
  i `ContactCta` („Porozmawiajmy →” do `#kontakt`, „Umów rozmowę ↗”). Odsłania się jak sekcja (stagger 0–2).
- **Fakty (strony WWW)**: wielkie wiersze `dl` (termin mono, wartość w roli h2, limonkowy chip technologii, link ze
  strzałką „↗”) albo kafle 2 / 4 kolumny (Sassy).

## Komponenty dodane 2026-09-21

- **Suwak „Zamieszanie"** (hero): `input[type=range]`, tor 2 px, uchwyt w kształcie rombu w kolorze akcentu.
  0% = litery napisu 3D w porządku, 100% = litery rozrzucone, obrócone i drgające. Domyślnie 0.
- **Testimonial**: kafel `tile` lub limonkowy, cytat w kroju statement, cudzysłów 96 px w akcencie,
  podpis mono z kwadratowym awatarem 44 px. Układ 7 + 5, trzeci kafel z offsetem.
- **E-mail**: przy myszy (`pointer: fine`) klik kopiuje adres do schowka i na 1,8 s zamienia etykietę
  na „Skopiowano ✓"; na dotyku i bez Clipboard API to zwykły `mailto:`.
