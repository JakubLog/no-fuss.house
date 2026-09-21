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
    line: "rgba(255,255,255,0.10)"   # rysowane w mix-blend-mode: difference
    cross: "rgba(255,255,255,0.40)"
typography:
  display:
    family: "TikTok Sans"            # OFL, Google Fonts
    weight: 700
    size: "clamp(2.25rem, 6svw, 5.5rem)"   # oryginał: 7.2svw mobile, 6svw lg, 5svw 2xl
    lineHeight: 1.0
    transform: uppercase
  statement:
    family: "TikTok Sans"
    weight: 400
    size: "clamp(1.5rem, 3svw, 2.75rem)"
    lineHeight: 1.0-1.1
  title:
    family: "TikTok Sans"
    weight: 500
    size: "30px"
    lineHeight: 1.25
  body:
    family: "TikTok Sans"
    weight: 400
    size: "16px"
    lineHeight: "24px"
  mono:
    family: "Geist Mono"             # zamiennik komercyjnego Tronica Mono
    weight: 400
    size: "14px"
    lineHeight: "20px"
    transform: uppercase
  mono-sm:
    family: "Geist Mono"
    size: "12px"
    lineHeight: "16px"
    transform: uppercase
rounded:
  none: "0px"            # cały system jest ostry; zero zaokrągleń w UI
spacing:
  unit: "4px"
  gutter-mobile: "16px"
  gutter-desktop: "56px"
  section-y-mobile: "72px"
  section-y-desktop: "96px"
  grid-columns: 12
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
jasne (`tone-light`) i ciemne (`tone-dark`). Przełącznik motywu (`A`) zamienia jasne sekcje
na ciemne (`#101318` / `#15181D` na zmianę), hero i stopka zostają bez zmian.

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

Nad całością leży stała warstwa `position: fixed`:
- **siatka**: 3 piony (lewy gutter, środek, prawy gutter) i 2 poziomy (⅓ i ⅔ wysokości),
  z przerwą 12 px wokół przecięć i krzyżykiem 12 px w każdym przecięciu; rysowana na biało
  w `mix-blend-mode: difference`, więc sama odwraca się na każdym tle,
- **HUD**: logo i nawigacja u góry, czas lokalny, współrzędne kursora i ikona globu u dołu,
  pasek postępu scrolla przy prawej krawędzi.

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
- **Preloader**: pasek 110×4 px na środku, limonkowy na 25% bieli, tło `#101318`, po wypełnieniu kurtyna
  odjeżdża w górę.
- **Naklejka**: SVG 72–120 px z białym obrysem 4 px, pojawia się pod kursorem w hero
  (pop scale 0→1, losowa rotacja ±25°), znika po 2.4 s.
- **Kursor**: limonkowa strzałka z gradientem, podąża z opóźnieniem (lerp 0.18); tylko
  na urządzeniach ze wskaźnikiem `fine`.

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
w liczbie mnogiej. Produkty własne pokazywane jako pierwsze kafle: OurMoney (wspólny budżet
dla par, budowany razem) i AION MIND (aplikacja do journalingu z AI, budowana przez Magdę).

## Podstrona „O nas" (komponenty dodatkowe)

- **Duet**: dwa panele na pełną wysokość; Magda zawsze `tone-light`, Kuba zawsze `tone-dark`
  (design = jasny papier, kod = ciemny terminal), niezależnie od motywu. Hover rozszerza panel
  (flex-grow 1 → 1.45), okrągła limonkowa odznaka „×" z obracającym się napisem jedzie po szwie.
- **Marquee**: limonkowy pasek, display 800, pętla 22 s.
- **Karta postaci**: lista `dl` w mono, obrys 1 px, wskaźnik „Zamieszanie 0%".
- **Kto co robi**: tor 2 px z rombem w kolorze akcentu; pozycja rombu (`--v`) animuje się od środka.
- **Oklej nas**: naklejki przeciągane wskaźnikiem, dotykiem i strzałkami z klawiatury.
- Okrągłe kształty dozwolone tylko w warstwie zabawy (odznaka, naklejki), nie w UI.
