---
data: 2026-09-25
produkt: inne
zakres: no-fuss (Next.js), cała strona — /, /o-nas, 6 case study, 404; użyteczność, a11y, spójność z DESIGN.md, flow konwersyjny
tryb: hybrid
p0: 3
p1: 17
p2: 17
---

### 🔍 UX Audit: no-fuss, cała strona (wersja Next.js)

**Kontekst** Pierwszy audyt wersji Next.js (poprzedni dotyczył legacy HTML). Cel strony: pozyskanie klientów usługowych, case study = narzędzie sprzedaży.
**Materiał** Kod `src/` (3 przeglądy statyczne: a11y/interakcja, zgodność z DESIGN.md i responsywność, treść/IA/konwersja) + przegląd na żywo na `next dev` (localhost:3000): 1440×900, 1024×768, 768×1024, 390×844 z emulacją dotyku, dodatkowo 700/780–1000 px; pełny przebieg Tab, `prefers-reduced-motion`, pomiary computed styles, kontrastu i `scrollWidth`.
**Uwaga** W trakcie audytu w drzewie roboczym pojawiły się zmiany spoza audytu (usunięty suwak „Zamieszanie” z hero, „Umów rozmowę” bez adresu ukryty zamiast wyszarzony, FAQ bez CTA, zmiany w `HomeHero`). Ustalenia to uwzględniają; P1.5 wymaga ponownego sprawdzenia po tych zmianach.
**Statusy** `[zweryfikowane]` zaobserwowane na żywo, `[kod]` potwierdzone w źródłach, `[ręcznie]` do potwierdzenia na prawdziwym urządzeniu.

### ✅ Co działa dobrze
- Klawiatura: skip link do `main#main`, widoczny fokus wszędzie (2 px, biały na ciemnym, `#101318` na jasnym i limonce), brak pułapek poza iframe. SplitCalculator, JournalScreen (roving tabindex), DragBall (`role=slider`), FilmStrip (Pauza/Wznów, ← →), naklejki (strzałki) działają z klawiatury. `[zweryfikowane]`
- `prefers-reduced-motion` kompletne na wszystkich stronach: 0 ukrytych `.fade`, `getAnimations()` puste, Lenis wyłączony, iframe jako poster, CountUp od razu z wartością końcową. `[zweryfikowane]`
- Brak poziomego scrolla na wszystkich stronach i szerokościach, z jednym wyjątkiem (P0.2). `[zweryfikowane]`
- Mechanizm placeholderów (`isPlaceholder`, `published*()`) nie wypuszcza `[…]` do renderu ani JSON-LD. Pętla „Następny projekt” jest zamknięta. Role no-fuss są oznaczone uczciwie. `[kod]`
- PhoneScroller to wzorzec: najpierw kółko przewija telefon, potem stronę. Na dotyku jest blokada z komunikatem „Dotknij, aby przewijać”. `[zweryfikowane]`

### 🔴 P0: krytyczne

**1. LiveFrame przechwytuje scroll i Tab (Busy Bee, Automation House; OTB i Sassy po „Otwórz na żywo”)**
- **Problem:** Ramka zajmuje ~75% ekranu przy 1440. Kółko z kursorem na ramce przewija stronę klienta i nie oddaje przewijania stronie: po 60 ruchach scrollY stał w miejscu. Tab wchodzi do iframe na 21 (Busy Bee), 56 (Automation House), 86 (Sassy) i >120 (OTB) przystanków. Sam iframe nie ma obrysu fokusu. `src/components/organisms/LiveFrame/LiveFrame.tsx:105-113`.
- **Soczewka:** Nielsen #3 (kontrola i swoboda), WCAG 2.4.1, 2.4.3.
- **Fix:** Żywa ramka domyślnie nieaktywna (`pointer-events: none`, iframe `tabIndex={-1}` + `inert`) z nakładką mono „Kliknij, aby przewijać stronę klienta”, jak w PhoneScroller. Wyjście przez Esc, kliknięcie obok lub wyjazd z widoku. Najprostsza alternatywa: `load="click"` wszędzie. Dodatkowo żywa ramka dopiero od 1024 px, bo przy 768 skala 0,5 daje tekst ~8 px.
- **Status:** `[zweryfikowane]` w Chromium (zdarzenia CDP), `[ręcznie]` trackpad i Safari.

**2. Automation House, 390 px: poziomy scroll i ucięte fakty**
- **Problem:** `scrollWidth` 398 przy 390. Wiersze „04 / Fakty” mają 382 px w kontenerze 358 px. Ucięte są „AUTOMATION.HOUSE”, „CZERWIEC 2026” i „SCRAPERÓW AI”, a cała strona pływa o 8 px w bok. Przyczyna: `grid-template-columns: 1fr 2fr` bez `minmax(0, …)` przy niełamliwym linku `inline-block`. `src/components/organisms/SpecList/SpecList.module.css:19`.
- **Soczewka:** WCAG 1.4.10 Reflow.
- **Fix:** Poniżej 768 px termin nad wartością (jedna kolumna), co przy okazji wyrówna lewą krawędź wartości, dziś poszarpaną na Busy Bee. Powyżej: `minmax(0,1fr) minmax(0,2fr)` + `overflow-wrap: anywhere` na `dd`.
- **Status:** `[zweryfikowane]` `[kod]`

**3. Ścieżka kontaktu to dziś tylko placeholder e-maila**
- **Problem:** Wszystkie CTA („Porozmawiajmy →” w hero, pod usługami, „Kontakt” w HUD, CTA w case study) prowadzą do stopki, w której jedyną akcją jest `[email@no-fuss]` (`src/content/site.ts:63`). `calendarUrl: null`, więc „Umów rozmowę” jest ukryte. Social studia to 3× `href: null`, więc w stopce nic się nie renderuje.
- **Soczewka:** flow konwersyjny, Nielsen #1.
- **Fix:** Przed publikacją podać e-mail, `calendarUrl` i linki social w `src/content/site.ts`. Blokuje premierę, nie wymaga zmiany kodu.
- **Status:** `[kod]` `[zweryfikowane]`

### 🟡 P1: ważne

**Chrome i nawigacja**
1. **Po „Porozmawiajmy →” / „Kontakt” fokus zostaje w hero.** Strona przewija się do stopki, ale `activeElement` to dalej przycisk z hero, a hash się nie zmienia. Następny Tab cofa użytkownika do usług. `SmoothScroll.tsx:78-80` przenosi fokus tylko na cel z `tabindex`, a stopka go nie ma. Fix: nadać `tabindex="-1"`, gdy brak, i dodać `history.pushState` z hashem. WCAG 2.4.3. `[zweryfikowane]`
2. **Preloader: Tab trafia pod zasłonę.** W ciągu ~0,7–1,2 s fokus chodzi po HUD pod kurtyną. `main` nie ma `inert`, nie ma też `aria-busy`. Przy reduced motion ciemny ekran nadal miga przez ~100–260 ms. Fix: `inert` na header/main/footer do `markIntroDone()`. Przy reduced motion preloadera nie renderować. WCAG 2.4.11. `[zweryfikowane]`
3. **HUD (`difference`) nieczytelny nad obrazami o średniej jasności**: CaseStage na /aion-mind („O nas”, „Kontakt” prawie znikają), pole DragBall na OTB. Fix: `isolation: isolate` na polach z obrazem albo przyciemnienie górnych ~80 px sceny. WCAG 1.4.11. `[zweryfikowane]`
4. **HUD nachodzi na tekst przy przewijaniu na mobile.** Przy 390 logo i nawigacja przecinają akapity usług i tytuły procesu. Przy 1440 leżą na liczbach display procesu. Fix bez tła (zgodnie z DESIGN.md): poniżej 768 px chować nawigację przy scrollu w dół. Wymaga decyzji. Nielsen #8. `[zweryfikowane]`

**Strona główna**
5. **Nagłówek h1 leży na limonkowym obiekcie 3D od 1024 px.** Kontrast bieli na `#BBFF00` to ~1,2:1, litery „JEM” gubią kontur. Przy 768 i 390 problemu nie ma. Fix kompozycją: scena nad linią h1 albo w kolumnach 6–12. WCAG 1.4.3. `[zweryfikowane]` przed zmianami w `HomeHero`, **do ponownego sprawdzenia**.
6. **Martwa strefa kafli realizacji 768–~900 px.** Kafle ~174 px, tag „STRONA WWW” zasłania pół kafla, podpisy i rok ze strzałką łamią się na 2 linie. `WorkGrid.module.css:24-60`. Fix: pary i trójki od 1024. W 768–1023 układ 6+6, rok z `nowrap`. `[zweryfikowane]`
7. **404: tytuł karty to „NO-FUSS©2026”.** Status HTTP to 404, ale tytuł o tym nie mówi. Fix: `<title>` renderowany w `NotFoundHero` (React 19 hoistuje go do `<head>`). WCAG 2.4.2. `[zweryfikowane]`

**/o-nas**
8. **Brak CTA kontaktu.** Strona kończy się planszą z naklejkami, a jedyną akcją jest placeholder e-maila w stopce. Fix: `ContactCta` jak w case study, przed StickerBoard. `[zweryfikowane]`
9. **„Kto co robi” jest nieme dla czytnika.** Wiersze to h3 z torem `aria-hidden`, a pozycja rombu (Magda ↔ Kuba) istnieje tylko wizualnie. Fix: lista + `sr-only` „Design: głównie Magda”, wyliczone z `--v`. Dodatkowo etykieta „razem” na środku legendy. WCAG 1.3.1. `[zweryfikowane]`
10. **Karty osób na mobile.** Przy 768 kadr 3:4 ma 688×917 px, a placeholder Magdy wypełnia cały ekran. Pas kart przy 390 to 3044 px z 6695 px strony. Zdjęcie Kuby ma źródło 455 px, powiększenie ~2,5× daje miękki obraz. Fix: poniżej 900 px kadr 4:3 lub `max-height: 60svh`, źródło zdjęcia min. 1200×1600. `[zweryfikowane]`

**Case study: treść i dowody**
11. **Brak dowodów efektu.** Opinie na stronie głównej są w 0/3 opublikowane, więc sekcja się nie renderuje. „W liczbach” to liczby zakresu (13 kroków, 3 modele, 152 polityki), nie wyniki. AION MIND zaczyna fakty od „— (etat Magdy…)”, co czyta się jak brak danych, i nie ma „Wynik: App Store / Google Play ↗”. Fix: min. 1 prawdziwa opinia, 1 kafel wynikowy na case, rola AION MIND opisana słowami. Treść, nie kod. `[zweryfikowane]`
12. **Zrzuty OurMoney: dane testowe i niska rozdzielczość.** Widać transakcje „test”, osobę „Test 2”, cel „164%”. Źródła mają ~390 px i są powiększane 2,8–3,8×. Portret `trenerka.png` na /aion-mind ma 120×120 przy pozostałych 480×480. Fix: nowe zrzuty 3× (~1170 px) z konta demo. `[zweryfikowane]`
13. **JournalScreen: toast „Podsumowanie miesiąca…” ucięty z obu stron** (362 px w ekranie 300 px, `white-space: nowrap`). `JournalScreen.module.css:228`. Fix: `max-width: calc(100% - 16px); white-space: normal`. WCAG 1.4.10. `[zweryfikowane]`
14. **Hero case'ów WWW nie ma leadu.** Pierwsze zdanie o efekcie jest ~2 ekrany niżej, za LiveFrame. DESIGN.md wymaga „tytuł mega, lead statement”. Fix: jedno zdanie `lead` dla busy-bee, automation-house, otb i sassy. `[zweryfikowane]`

**Case study: interakcja i czytelność**
15. **FilmStrip (Busy Bee) blokuje pionowe przewijanie** kółkiem i palcem. `.lenis [data-lenis-prevent]` daje `overscroll-behavior: contain` w obu osiach (`globals.css:75-80`). Fix: `overscroll-behavior-y: auto` na taśmie, tak jak w `PhoneScroller.module.css:34-36`. `[zweryfikowane]` `[kod]`
16. **„W skrócie”: kolumny tekstu oddzielone 8 px** (`CaseStory.module.css:5`). Oko czyta w poprzek kolumn głównego tekstu sprzedażowego. Fix: `column-gap: var(--gutter)` lub min. 32 px. `[zweryfikowane]`
17. **Kontrast:**
    - Podpis DragBall (OTB): biały mono 12 px na pastelu, ~1,6:1.
    - Opisy kroków procesu (Automation House): `#5F6369` na `#15181D`, ~3,0:1.
    - Wskazówka „najedź na krok” widoczna na dotyku.
    - Fix: podpis w `#101318` lub pod polem, opisy ≥4,5:1, wskazówka zależna od `pointer`. WCAG 1.4.3. `[zweryfikowane]`

### 🟢 P2: nice to have
- **Rytm tonacji:** dwie ciemne sekcje pod rząd na OTB (`otb/page.tsx:62-78`) i na OurMoney (03.4 i 03.5). `[zweryfikowane]`
- **Niespójności case study:**
  - etykiety sekcji w dwóch kolorach (CaseStrip pełny kontrast, CaseStudySection `--muted`);
  - „Następny projekt” raz „↗”, raz „→”;
  - kicker z datą w różnych formatach;
  - OTB bez wiersza „Kod”;
  - kafle procesu na Automation House z `tabindex` bez roli. `[zweryfikowane]`
- **LiveFrame:**
  - po „Załaduj” fokus spada na `body`;
  - „Otwórz na żywo ↗” ładuje w miejscu, choć strzałka zapowiada nową kartę;
  - „przewijaj i klikaj” na nieaktywnym posterze. `[zweryfikowane]`
- **ToySwitcher (Sassy):** aktywna pozycja przeskakuje na x=235 zamiast wcięcia 12 px (`space-between`). `[zweryfikowane]`
- **Limonka na limonce:**
  - kursor `help` znika na podświetlonym FAQ;
  - pierścień kursora ledwo widoczny nad okładką OurMoney;
  - tag „Aplikacja mobilna” na limonkowej okładce traci prostokąt. `[zweryfikowane]`
- **Strona główna:**
  - odpowiedzi FAQ mają ~80 znaków w wierszu wobec 60 w DESIGN.md (`FaqSection.module.css:82`, fix ~46ch);
  - tytuły kart procesu na różnych wysokościach;
  - „produkty,” samo w linii w „O nas”;
  - ~250 px pustki przed FAQ;
  - „na rozmowie” pod FAQ nie jest linkiem;
  - e-mail kopiuje się przy 1440 bez zapowiedzi. `[zweryfikowane]`
- **/o-nas:**
  - hero ma 4 linie zamiast 3, lead w wąskiej kolumnie, brak zdania o ofercie;
  - przy 1024 trzecia karta sama w rzędzie;
  - „Zamieszanie” styka się z paskiem (3–4 px);
  - hover w #social przesuwa tekst o 12 px, a fokus nie dostaje limonkowego tła (`FindSection.module.css:47-51`);
  - wiersze social bez adresu mają „↗” i wyglądają na zepsute. `[zweryfikowane]`
- **Naklejki:**
  - `role="img"` i 6 identycznych nazw;
  - kolejność Tab skacze po planszy;
  - przy 390 naklejki są przycięte, a start gestu na naklejce nie przewija strony. WCAG 4.1.2, 2.4.3. `[zweryfikowane]`
- **Marquee bez pauzy:** pętla 22 s, 145 px/s. Fix: pauza na hover i fokus albo `aria-hidden`. WCAG 2.2.2. `[zweryfikowane]`
- **SplitCalculator na dotyku:**
  - uchwyt 16 px, krok ~1,7 px;
  - podpis pod kalkulatorem nie aktualizuje się;
  - `aria-live` ogłasza przy każdym kroku;
  - w trybie „Tylko śledzenie” suwaki są aktywne. `[zweryfikowane]`
- **Siatki z dziurą i łamanie cen:**
  - „W liczbach” na AION MIND: 3 kafle w siatce 4-kolumnowej;
  - GuideCards: mono z interlinią 24 px;
  - PairSubscription: cena łamie się przy 1024 i 390. `[zweryfikowane]`
- **Typografia polska i nazwy linków:**
  - zakresy dat z łącznikiem łamią się, fix: półpauza + `&nbsp;`;
  - brak twardej spacji po „i” (`AboutSection.tsx:61`);
  - dwa „Pobierz ↗” o identycznej nazwie;
  - małe linki w `dl` hero (65×16). `[zweryfikowane]`
- **404:**
  - wskaźnik „Zamieszanie” wygląda jak suwak, a jest `div`;
  - po „Posprzątaj” przycisk znika i „Realizacje” wskakuje pod kursor;
  - licznik pokazuje „000%”. `[zweryfikowane]`
- **Kursor:** brak stanu „tekst”, bo I-beam jest ukryty, a własny kursor zostaje strzałką. `[kod]`
- **HUD i linki:**
  - cele dotyku 24 px (minimum spełnione, zalecane 44 nie);
  - logo bez `aria-current` na `/`;
  - tylko LiveFrame zapowiada nową kartę, inne `target=_blank` nie. `[zweryfikowane]` `[kod]`
- **Rozjazd DESIGN.md ↔ kod (decyzja: dokumentować czy sprzątać):**
  - `letter-spacing` ≠ normal w ~18 plikach (−0,01…−0,04em);
  - 7 progów breakpointów, w tym pojedyncze 800 i 640/768;
  - ~25 odstępów spoza siatki 8 px (Button 14×20, CaseNumbers 20, FilmStrip 20…);
  - surowe `#fff` i powielony `#3a3f47`;
  - Tag 4×8 w kodzie wobec 2×6 w DESIGN.md;
  - mono bez wersalików w pasku adresu LiveFrame;
  - waga 600 w kursorze;
  - `text-shadow` w FilmStrip. `[kod]`
- **Terminologia:** „Realizacje” / „case study” / „projekt” dla tej samej rzeczy. `[kod]`

### 🔁 Regresje i powtórki
Poprzedni audyt (2026-09-21) dotyczył legacy. Jego ustalenia (skala `--t-*`, wagi 400/500/700, jedna siatka 12 kol.) utrzymały się w Next.js. Wraca temat odstępów spoza siatki 8 px i nowy: letter-spacing (P2, rozjazd dokumentu i kodu).

### 📊 Ogólna ocena

| Wymiar | Ocena (1-5) | Komentarz |
|---|---|---|
| Użyteczność | 3/5 | Widżety dopracowane, ale LiveFrame i FilmStrip łapią scroll, a Automation House rozjeżdża się na telefonie |
| Spójność wizualna | 3/5 | System trzymany (mono, siatka, limonka jako tło); psują go zrzuty z danymi testowymi, rozmyte obrazy, martwa strefa 768–900 i rozjazd z DESIGN.md |
| Flow konwersyjny | 2/5 | Jedyny kanał to placeholder e-maila, /o-nas bez CTA, brak opinii i wyników w case study |
| Dostępność | 3/5 | Mocna baza (fokus, reduced motion, ARIA widżetów); luki: iframe, preloader, fokus po kotwicy, kontrasty, RolesSplit |

### 🎯 Top 3 priorytety do wdrożenia
1. Interakcje blokujące: LiveFrame aktywowany kliknięciem (P0.1), SpecList na mobile (P0.2), FilmStrip `overscroll-behavior-y` (P1.15).
2. Ścieżka kontaktu: dane kontaktowe (P0.3), CTA na /o-nas (P1.8), fokus i hash po kotwicy `#kontakt` (P1.1).
3. Czytelność: h1 vs obiekt 3D (P1.5), HUD nad obrazami i tekstem (P1.3–4), kontrasty (P1.17), odstęp kolumn „W skrócie” (P1.16), lead w hero case'ów WWW (P1.14).

### ✅ Wdrożone
2026-09-25 (niezacommitowane). Każdą zmianę agent sprawdził w przeglądarce na `next dev`, potem przejrzał reviewer:
- P0.1: LiveFrame bez trybu `auto`, żywa strona dopiero po kliknięciu na wszystkich 4 case'ach. Kółko nad ramką przewija stronę, Tab nie wchodzi do iframe. Przycisk ma nazwę „Załaduj żywą stronę <host>”, a pasek adresu pokazuje sam host. `[zweryfikowane]`
- P0.2: `SpecList` `rows` poniżej 768 px w jednej kolumnie, `minmax(0,…)` i `overflow-wrap`. Automation House przy 390: `scrollWidth` 390. `[zweryfikowane]`
- P1.1: kotwice na tej samej stronie ustawiają `#hash` (przed przewinięciem, więc „Wstecz” wraca na miejsce) i przenoszą fokus na cel. `[zweryfikowane]`
- P1.2: na czas preloadera `inert` na skip link, header, main i footer. Przy reduced motion nie ma preloadera ani blokady scrolla (`globals.css`). `[zweryfikowane]`
- P1.7: 404 ma tytuł „404 — NO-FUSS©2026”, description z legacy i jeden tag `noindex`. `[zweryfikowane]`
- P1.8: `ContactCta` na /o-nas pod leadem hero i pod „Kto co robi”. `[zweryfikowane]`
- P1.13: toast JournalScreen łamie się w granicach ekranu. `[zweryfikowane]`
- P1.15: FilmStrip przepuszcza pionowy scroll (`overscroll-behavior-y: auto`). `[zweryfikowane]`
- P1.16: „W skrócie” z odstępem kolumn 56 px od 1024 px. `[zweryfikowane]`
- P1.17: podpis DragBall pod polem (8,08:1), opisy kroków Automation House 7,81:1, na dotyku podpowiedź „Rebranding” bez „najedź”. `[zweryfikowane]`
- P1.6: sekcja „Produkty i realizacje” przywrócona do HEAD (siatka legacy + licznik „01–06”, decyzja właściciela). Przy 768–1023 px dwie równe kolumny, rok ze strzałką `nowrap` (`MetaRow`). `[zweryfikowane]`
- P2: tytuły „Jak pracujemy” wyrównane (subgrid). `[zweryfikowane]`
- P2: FAQ hover tylko przy `(hover: hover)` (bez przyklejenia na dotyku), `transform` zamiast `padding`. `[zweryfikowane]`
- P2: kursor na limonce ma ciemny wariant (`data-tone`, stos `elementsFromPoint`). `[zweryfikowane]`
- P2: kafle realizacji bez skali i ruchu telefonów przy reduced motion, hover tylko myszą. `[kod]`
- Poza audytem (prośba właściciela): hover w „Co robimy”, „Jak pracujemy” i w kaflach wydarzeń, w tym samym języku co FAQ.
- DESIGN.md i docs/COMPONENTS.md zaktualizowane pod powyższe.

Otwarte: P0.3 (dane kontaktowe, treść), P1.3–1.5, P1.9–1.12, P1.14, pozostałe P2.
