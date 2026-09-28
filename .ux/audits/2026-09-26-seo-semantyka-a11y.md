---
data: 2026-09-26
produkt: inne
zakres: no-fuss (Next.js), cała strona — /, /o-nas, /wiedza, 6 case study, 404; SEO techniczne i treściowe, dane strukturalne, hierarchia nagłówków, semantyka HTML5, a11y (obrazy, opisy, ARIA, kolejność Tab, fokus)
tryb: hybrid
p0: 0
p1: 8
p2: 22
---

### 🔍 Audyt: SEO, nagłówki, semantyka HTML5, dostępność

**Kontekst** Czy strona spełnia podstawy SEO i WCAG 2.2 AA w warstwie znaczników: metadane, dane strukturalne, outline nagłówków, landmarki, opisy obrazów, klawiatura.
**Materiał**
- Przegląd kodu `src/` (architect: SEO, JSON-LD, nagłówki, semantyka; scout: obrazy, ARIA, klawiatura).
- Pomiar na żywo na `next dev` (localhost:3000), 10 route'ów:
  - skrypt DOM: `<head>`, outline, landmarki, obrazy, SVG, duplikaty id, referencje ARIA;
  - axe-core 4.10 (tagi `wcag2a/2aa/21a/21aa/22aa` + `best-practice`), po przewinięciu całej strony;
  - pełny przebieg Tab przy 1440×900 i 390×844, z pomiarem pierścienia fokusu i zasłonięcia;
  - WCAG 2.5.8 (rozmiar i odstęp celów), LCP, `robots.txt`, `sitemap.xml`, manifest, przekierowania legacy.
**Uwaga** W trakcie audytu w drzewie roboczym pojawił się formularz kontaktowy w stopce (`ContactForm`, `src/lib/contact/`). Przebieg Tab był robiony przed jego pojawieniem się. Formularz sprawdziłem wstępnie, bez wysyłki (sekcja niżej).
**Statusy** `[zweryfikowane]` zmierzone na żywo, `[kod]` potwierdzone w źródłach, `[do weryfikacji]` wymaga innego narzędzia lub czytnika (VoiceOver, Rich Results Test, dane z produkcji).

### 📋 Poziom wdrożenia w skrócie

| Obszar | Stan | Ocena |
|---|---|---|
| SEO techniczne | Canonical, OG/Twitter z obrazem i alt, `robots` z dyrektywami Google, sitemap z 9 route'ami, 404 ze statusem 404 i `noindex`, redirecty legacy 308 dla `/plik` i `/plik.html`, `lang="pl"`, `og:locale pl_PL` | 4/5 |
| SEO treściowe | Title i description unikalne na każdej stronie, ale title strony głównej to samo „NO-FUSS©2026” (12 zn.), a sekcje case study mają nagłówki typu „03 / Mobile” | 3/5 |
| Dane strukturalne | Spójny `@graph` ze stabilnymi `@id`, bez placeholderów. Dwa błędy: sprzeczny `creator` AION MIND, `Event` bez `location` | 3/5 |
| Hierarchia nagłówków | 1× `h1` na każdej z 10 stron, 0 przeskoków poziomów, 0 pustych nagłówków. Słabe: numerowane `h2` w case'ach, sklejone linie w `textContent` | 4/5 |
| Semantyka HTML5 | `header`/`nav`/`main`/`footer`, `article`, `ul`/`ol`/`dl`, `figure`/`figcaption`, `details`/`summary`, `time datetime`, `blockquote`. Drobne luki: `address`, `h3` w kaflach, `nav` na /o-nas | 4/5 |
| Obrazy i opisy | 0 obrazów bez `alt` (typ `alt: string` jest wymagany), puste `alt` tylko przy dekoracji w opisanej grupie, SVG: 0 bez obsługi, canvas `aria-hidden` z tekstem zastępczym, iframe z `title` | 5/5 |
| Klawiatura i fokus | Skip link, pierścień 2 px na każdym przystanku, 0 zasłoniętych fokusów, 0 `tabindex>0`. Luki: 5 pustych przystanków na Automation House, naklejki na /o-nas skaczą po planszy | 4/5 |

**axe-core: 0 naruszeń na wszystkich 10 stronach** `[zweryfikowane]`. Jedyne „incomplete” to `color-contrast` (tekst na obrazach i gradientach). Kontrast mierzył poprzedni audyt (P1.17), tu go nie powtarzam.

### ✅ Co działa dobrze
- **Metadane z jednego helpera** (`src/lib/seo/metadata.ts:108-143`). Każda strona ma absolutny canonical, komplet OG/Twitter z wymiarami i `og:image:alt`, `max-image-preview:large`. Case study mają `og:type=article` i własną okładkę. `[zweryfikowane]`
- **Sitemap i redirecty z `routes.ts`**. Nowa strona trafia do sitemap automatycznie (`/wiedza` jest). `/o-nas/` → 308 `/o-nas`, `/o-nas-v5(.html)` → 308 `/o-nas`. `[zweryfikowane]`
- **Outline:** 10/10 stron z jednym `h1` i bez przeskoków. Sekcje strony głównej, `/wiedza` i `/o-nas` mają `aria-labelledby`. Tam, gdzie design nie ma nagłówka, jest `h2` sr-only („O nas”, „Głos użytkownika”). `[zweryfikowane]`
- **Obrazy:** 67 `<img>` na 10 stronach, 0 bez `alt`. Alt opisowe po polsku („Kuba na scenie Tech Trends Infoshare 2026, przed nim widownia…”). Kafel OurMoney to poprawny wzorzec grupy: `role="img"` + `aria-label` na grupie, `alt=""` na 3 ekranach. `PartnerLogos`: `role="img"` + `<title>`. `[zweryfikowane]` `[kod]`
- **Widżety ARIA:**
  - DragBall: `slider`;
  - ToySwitcher: `tablist` z roving tabindex;
  - JournalScreen: `grid`;
  - SplitCalculator: `<label for>`, `<output>`, `aria-live`;
  - FilmStrip: `aria-pressed` i Pauza. `[kod]`
- **Klawiatura:**
  - skip link jest pierwszym przystankiem, kolejność idzie HUD → treść → stopka;
  - pierścień fokusu (`outline 2px`) widoczny na 100% przystanków;
  - przy 1440 i 390 żaden fokus nie jest zasłonięty przez HUD (WCAG 2.4.11);
  - 0 duplikatów `id`, 0 zerwanych `aria-labelledby`/`describedby`/`for`;
  - WCAG 2.5.8: wszystkie cele poniżej 24 px mieszczą się w wyjątku odstępu. `[zweryfikowane]`

### 🔴 P0: krytyczne
Brak. Wszystkie strony są indeksowalne i dostępne z klawiatury.

### 🟡 P1: ważne

**SEO i treść**
1. **Linie nagłówków sklejone w `textContent`.**
   - **Problem:** `Line` renderuje `<span class="line"><span>…</span></span>` bez białego znaku między liniami. Wizualnie jest dobrze, bo `.line` ma `display:block`. W tekście dokumentu wychodzi jednak:
     - h1 `/` to „Budujemyprodukty bezzamieszania”;
     - „Czy ja niepłacę więcej?”, „Skalpel,nie scyzoryk”, „Zasadyna starcie” (OurMoney);
     - „Mam mętlik i nie wiem,od czego zacząć.” (AION MIND);
     - stopka: „Zróbmycoś razem”;
     - `<time>` w kaflu wydarzenia: „17–18.112026”.
   - **Skutki:** Chrome składa drzewo dostępności ze spacjami, więc czytnik w Chrome czyta poprawnie (sprawdzone). Problem zostaje dla ekstraktorów tekstu (scrapery AI, `llms`, tryb czytnika, kopiowanie), a strona deklaruje, że jest „czytelna dla AI”. Obejście `aria-label` w `Heading` działa tylko przy samych stringach, a nie przy liniach z `<Mark>`.
   - **Dowód:** `src/components/atoms/Line/Line.tsx:15-20`, `src/components/atoms/Heading/Heading.tsx:54-55,63-69`, `src/app/ourmoney/page.tsx:105-110`, `src/app/aion-mind/page.tsx:114-119`, `src/components/organisms/Footer/Footer.tsx:29-42`, `AboutSection.tsx:66-72`, `EventTile.tsx:57-62`.
   - **Soczewka:** WCAG 1.3.2, AEO.
   - **Fix:** w `Heading` przed każdą linią poza pierwszą wstawić `" "` (spacja między blokami się nie renderuje, wygląd bez zmian). Potem usunąć `autoLabel`/`aria-label` z `Heading` i `Footer`. Ten sam `{" "}` wstawić w `AboutSection` i `<time>` w `EventTile`.
   - **Status:** `[zweryfikowane]` `[kod]`, VoiceOver/Safari `[do weryfikacji]`.
2. **Title strony głównej bez treści, podstrony wersalikami z boilerplate.**
   - **Problem:** `/` ma tytuł „NO-FUSS©2026” (12 zn.): brak słów „studio produktowe”, „aplikacje mobilne”, „AI”. Podstrony mają tytuły typu „OTB VENTURES — CASE STUDY — NO-FUSS©2026”, czyli wersaliki w samym tekście i rok w każdym tytule. Google często przepisuje takie tytuły, a rok trzeba co roku zmieniać.
   - **Dowód:** `src/content/site.ts:39`, `src/lib/seo/metadata.ts:117-123`, `src/content/routes.ts` (tytuły 1:1 z legacy).
   - **Soczewka:** Google „title links”, WCAG 2.4.2.
   - **Fix:**
     - title strony głównej ~55–60 zn., np. „no-fuss — studio produktowe: aplikacje mobilne, strony i AI”;
     - template `%s — no-fuss`;
     - tytuły zdaniowo, np. „OTB Ventures: strona funduszu VC (case study)”;
     - wersaliki i „©2026” zostają w UI.
   - **Status:** wymaga decyzji właściciela, bo odchodzi od zasady „1:1 z legacy”. `[zweryfikowane]`
3. **Nagłówki sekcji case study: numer zamiast nazwy, trzy konwencje.**
   - **Problem:** na Busy Bee, Automation House, OTB i Sassy jedynymi `h2` są 14-pikselowe etykiety mono: „01 / W skrócie”, „02 / Hero”, „03 / Mobile”, „04 / Fakty”. Na OurMoney i AION MIND `h2` to raz zdanie-tytuł („Skalpel, nie scyzoryk”), raz etykieta („03.5 / Codzienność”, „05 / W liczbach”), bo `CaseStrip` robi `h2` z etykiety, a `CaseStudySection` wide/split z `CaseProse`. Numer w nagłówku to szum dla nawigacji po nagłówkach i słaby sygnał dla SEO.
   - **Dowód:** `src/components/templates/CaseStudyLayout/CaseStudySection.tsx:69-70` (lite) i `:95-97` (wide/split), `src/components/organisms/CaseStrip/CaseStrip.tsx:24-27`.
   - **Soczewka:** WCAG 2.4.6, 1.3.1.
   - **Fix:** rozbić etykietę po `" / "`: `<h2 class="mono"><span aria-hidden="true">01 / </span>W skrócie</h2>`. Wygląd bez zmian, nagłówek opisowy, jedna reguła dla `lite` i `CaseStrip`. Przy okazji nadać nazwy mówiące o treści („02 / Hero” → „Pierwszy ekran”, „03 / Mobile” → „Strona na telefonie”).
   - **Status:** `[zweryfikowane]` `[kod]`

**Dane strukturalne**
4. **Sprzeczny `creator` dla tego samego `@id` `…/aion-mind#work`.**
   - **Problem:** na `/` `ItemList` podaje `creator` = Organization AION MIND, a na `/aion-mind` ten sam `@id` ma `creator` = no-fuss. Grafy scalają węzły po `@id`, więc dane się wykluczają.
   - **Dowód:** `src/content/home-jsonld.ts:21-31` vs `src/app/aion-mind/page.tsx` (`creativeWork`).
   - **Fix:** `authorship()` zawsze zwraca `creator: orgRef`. Etat wyrazić przez `contributor` + `about` → `SoftwareApplication` (który na `/aion-mind` ma już `publisher` AION). `[kod]` `[zweryfikowane]`
5. **`Event` bez `location` i bez pól zalecanych.**
   - **Problem:** „Polska With AI” (brak `place`) wychodzi jako `Event` z trybem Offline, ale bez `location`. W Rich Results Test to błąd „Missing field location”. Nadchodzące wydarzenia nie mają `offers`, choć link „Bilety” jest w danych, ani offsetu strefy w `startDate` (`2026-11-27T17:25`). Minione mają `eventStatus: EventScheduled`.
   - **Dowód:** `src/content/events-jsonld.ts:20-36`, `src/content/events.ts:184-197`.
   - **Fix:**
     - nie emitować `Event` offline bez `location`;
     - dla nadchodzących dodać `offers: { "@type": "Offer", url }`, offset `+01:00`/`+02:00` i `addressCountry: "PL"`.
   - **Status:** `[kod]` `[zweryfikowane]`, RRT `[do weryfikacji]`.

**Klawiatura i dostępność**
6. **Automation House: 5 pustych przystanków Tab.**
   - **Problem:** kroki procesu to `<li tabIndex={0}>` bez roli i akcji. Fokus tylko odsłania opis przez `:focus-within`, a opis i tak jest w drzewie dostępności, bo jest schowany przez `max-height`/`opacity`, nie `display:none`. Przebieg Tab: przystanki 11–15 na stronie.
   - **Dowód:** `src/components/organisms/ProcessSteps/ProcessSteps.tsx:71`.
   - **Soczewka:** WCAG 2.4.3, 4.1.2.
   - **Fix:** usunąć `tabIndex`, a opis dla klawiatury i dotyku pokazywać stale (jak `@media (hover: none)`).
   - **Status:** powtórka P2 z 2026-09-25, podniesiona, bo dotyczy wprost spójności Tab. `[zweryfikowane]`
7. **Naklejki na /o-nas: Tab skacze po planszy, 6 identycznych nazw.**
   - **Problem:** kolejność fokusu (y, x) to 4118/111 → 4052/1110 → 4404/220 → 4358/1192 → 4491/650 → 3967/848, czyli zygzak po całej planszy i powrót na górę na końcu. Wszystkie sześć ma nazwę „Naklejka, przesuwaj strzałkami”.
   - **Dowód:** `src/components/organisms/StickerBoard/StickerBoard.tsx:52-61`, `DragSticker.tsx:94`, `src/content/about.ts` (`stickerLabel`).
   - **Soczewka:** WCAG 2.4.3, 4.1.2.
   - **Fix:** posortować naklejki w DOM wg pozycji startowej (góra → dół, lewo → prawo) i numerować nazwy: „Naklejka 1 z 6: <motyw>, przesuwaj strzałkami”.
   - **Status:** powtórka P2 z 2026-09-25. `[zweryfikowane]`
8. **AION MIND: dwa linki „Pobierz ↗” obok siebie.**
   - **Problem:** App Store i Google Play mają tę samą nazwę dostępną. `dt` jest obok wizualnie, ale na liście linków czytnika to dwa identyczne „Pobierz”. To przypadek graniczny WCAG 2.4.4, a naprawa jest tania.
   - **Dowód:** `src/content/cases/aion-mind.ts` (`facts`), `CaseStudyLayout.tsx` (`FactValue`).
   - **Fix:** w `FactValue` przy `href` dać nazwę `${term}: ${value}` („App Store: Pobierz”), najlepiej przez sr-only prefiks zamiast `aria-label`, żeby nazwa zawierała widoczny tekst (WCAG 2.5.3).
   - **Status:** powtórka P2 z 2026-09-25. `[zweryfikowane]`

### 🟢 P2: nice to have

**SEO i pliki techniczne**
- **Opis /o-nas** to fallback `site.shortDescription` (114 zn.): nie mówi o zespole, rolach ani wydarzeniach. Fix: własny `description` z `about.ts` (120–155 zn.). `src/app/o-nas/page.tsx:19`. `[zweryfikowane]`
- **OG case'ów WWW:**
  - WebP 1600×1000 (1,6:1) zamiast 1200×630 PNG/JPG, co grozi przycięciem na LinkedIn `[do weryfikacji]`;
  - brak `article:published_time`.
  - Fix: okładki OG 1200×630 jak w OurMoney i AION MIND, `publishedTime` w `buildMetadata`. `[kod]`
- **`public/llms.txt`** pisany ręcznie, z 11× wpisanym na sztywno `https://no-fuss.pl`. Rozjedzie się z `content/*`. Fix: route handler `src/app/llms.txt/route.ts` z `site.ts`/`routes.ts`/FAQ. `[kod]`
- **Higiena plików technicznych:**
  - `sitemap.lastmod` to stała data dla 8 route'ów (`routes.ts:38`);
  - `robots.txt` ma dyrektywę `Host` (tylko Yandex, bez efektu);
  - manifest: `name: "NO-FUSS©2026"` i brak `id`;
  - komentarz w `next.config.ts` mówi 301, a Next zwraca 308 (dla Google równoważne). `[zweryfikowane]`
- **Dwie formy adresu `/`:** canonical i `og:url` `https://no-fuss.pl`, a sitemap i JSON-LD `https://no-fuss.pl/`. Do tego literówka w `NEXT_PUBLIC_SITE_URL` po cichu spada na domyślną domenę (`src/lib/seo/site-url.ts:12-14`). Fix: jedna forma i `warn`/`throw` w buildzie produkcyjnym. `[zweryfikowane]`
- **JSON-LD, drobiazgi:**
  - `BreadcrumbList` bez widocznych okruszków (kicker case'u mógłby być „Realizacje → OTB Ventures”);
  - nazwy stron wersalikami („WIEDZA”, „O NAS”);
  - `datePublished` = data projektu, a nie publikacji case'u (lepiej `temporalCoverage`/`dateCreated`);
  - OurMoney: opis `CreativeWork` ≠ meta description;
  - `Offer` OurMoney bez `availability: PreOrder` przy „przed premierą”;
  - `FAQPage` nie da już kafla w Google (od 2023 tylko serwisy rządowe i medyczne), zostaje jako dane dla AEO. `[kod]`
- **404:** `og:title` „NO-FUSS©2026” zamiast „404”, a `og:image` na dev wskazuje `localhost` (plikowy obraz z layoutu). Nieszkodliwe przy `noindex`. `[zweryfikowane]`
- **LCP opóźniony przez reveal:** na `/`, `/o-nas`, `/wiedza`, `/aion-mind` i `/ourmoney` elementem LCP jest lead `p.fade`, liczony dopiero po odsłonięciu, ~2,1 s na dev. Core Web Vitals to sygnał rankingowy. Fix do rozważenia: lead hero bez `opacity:0` na starcie (sam `transform`) albo krótszy stagger. `[zweryfikowane]` na dev, produkcja `[do weryfikacji]` (Lighthouse/CrUX).

**Nagłówki i semantyka HTML5**
- **Kafle realizacji na `/` bez `h3`**, więc nawigacja po nagłówkach pomija 6 projektów. Nazwa linku jest rozwlekła: alt obrazu powtarza podpis („OurMoney: trzy ekrany aplikacji OurMoney — wspólny budżet…”). Fix: `MetaRow` z `nameAs="h3"` w `WorkTile`, obraz w kaflu `alt=""`, bo podpis nazywa projekt. `WorkTile.tsx:70`, `MetaRow.tsx:19`. `[zweryfikowane]`
- **Kolekcje:**
  - `WorkGrid` to `<ol>`, choć kolejność nic nie znaczy → `<ul>` (`WorkGrid.tsx:40`);
  - kroki procesu na Automation House to `strong`, a na `/` `h3` → `h3` w `ProcessSteps`. `[kod]`
- **/o-nas:**
  - trzy karty osób (`article > h2`) bez sekcji nadrzędnej „Zespół”;
  - widoczny licznik `[02]` przy „Kto co robi” bez `aria-hidden`;
  - `FindSection` to `nav` z gołymi linkami zamiast `ul > li`;
  - 4 landmarki `nav` w `main` (dwa social, „Więcej o pracy z AI”, „Wydarzenia no-fuss”) zaśmiecają listę landmarków → `section`/`ul`, a `nav` tylko dla nawigacji serwisu.
  - Pliki: `TeamSheets.tsx:45`, `RolesSplit.tsx:23-25`, `FindSection.tsx:63-93`. `[zweryfikowane]`
- **Stopka:** e-mail bez `<address>`, copyright w `span` zamiast `<small>`. `Footer.tsx:53-57`. `[kod]`
- **`article` case study obejmuje CTA i „Następny projekt”**, które nie są treścią utworu. Fix: zamknąć `article` po `{children}`. `CaseStudyLayout.tsx:140-192`. `[kod]`
- **`section#hero` bez nazwy** na wszystkich stronach, choć reszta sekcji ją ma. Fix: `aria-labelledby` na `h1` albo zapisać w `docs/COMPONENTS.md`, że hero celowo nie jest regionem. Tam też spisać regułę: sekcje narracyjne case'ów bez nazwy, żeby nie robić 13 regionów na stronę. `[zweryfikowane]`
- **h1 strony głównej to hasło** („Budujemy produkty bez zamieszania”), a oferta jest dopiero w leadzie. Decyzja copy. Opcja bez zmiany wyglądu: `hgroup` z h1 i leadem. `[kod]`
- **Powtórka P1.9:** „Kto co robi” przekazuje podział ról tylko wizualnie (romb na torze `aria-hidden`). `RolesSplit.tsx:33-40`. `[kod]`

**Obrazy, opisy, linki**
- **Nowa karta bez zapowiedzi:** `Button external`, `ArrowLink`, `ScrambleLink`, `SpecList` i `FactValue` mają `target="_blank"` bez sygnału dla czytnika. Tylko LiveFrame mówi „w nowej karcie”. Fix: wspólny sr-only sufiks „(nowa karta)” jak istniejący wzorzec „(wkrótce)”. To technika G201 (zalecenie, nie wymóg AA). Powtórka P2. `[zweryfikowane]`
- **Jakość alt:**
  - hero OTB „OTB Ventures” i Sassy „Sassy” są uboższe niż ten sam obraz na `/` („OTB Ventures: strona główna”);
  - „Pulpit” w ToySwitcher: jedno słowo;
  - GuideCards: alt „Przewodnik Herodot” powtarza sąsiedni `h3` „Herodot” → opisać wygląd postaci albo `alt=""`;
  - na /o-nas zdjęcia Magdy i Kuby są dwa razy (karty + plansza naklejek), więc czytnik słyszy imiona podwójnie → na planszy `alt=""` albo „Naklejka ze zdjęciem Magdy”. `[zweryfikowane]`
- **Marquee bez pauzy** (WCAG 2.2.2): `animation-play-state: paused` na `:hover`/`:focus-within`. Powtórka. `[kod]`
- **Logo bez `aria-current="page"` na `/`**, choć linki HUD go mają. Powtórka. `[kod]`
- **`NotFoundStage` bez `sceneLabel`** (HomeHero go ma). h1 sr-only opisuje stronę, więc chodzi tylko o spójność API. `[kod]`
- **Angielskie wstawki bez `lang="en"`:** „Head of Operations”, „Open to beyond”, „AI-Native Workers”. Nazwy własne i terminy są zwolnione z WCAG 3.1.2, więc warto oznaczyć tylko dłuższe frazy i cytaty. `[zweryfikowane]`

### 🧪 Formularz kontaktowy w stopce (praca w toku, stan na czas audytu)
- **OK:**
  - `form aria-label="Napisz do nas"`;
  - pola z `<label for>`: Imię, E-mail, Wiadomość;
  - `required` i `autocomplete` (`name`, `email`);
  - honeypot `website` z `tabIndex=-1` w `aria-hidden`;
  - `p role="status"` na komunikat. `[zweryfikowane]`
- **Do sprawdzenia po ukończeniu (bez wysyłki, żeby nie wysyłać maili):**
  - czy błędy walidacji dostają `aria-invalid` i `aria-describedby`;
  - dokąd trafia fokus po wysłaniu i po błędzie;
  - czy komunikat w `role="status"` pojawia się po zamontowaniu elementu, a nie razem z nim.

### 🧭 Przebieg Tab (1440×900, liczba przystanków od skip linku do stopki)
| Strona | Przystanki | Uwagi |
|---|---|---|
| `/` | 28 | Logiczny. 7× `summary` FAQ, kafle realizacji w kolejności czytania |
| `/o-nas` | 26 | Naklejki 20–25 zygzakiem (P1.7) |
| `/wiedza` | 12 | Dwa „Bilety ↗” obok siebie, rozróżnione tylko kontekstem kafla |
| `/busy-bee` | 24 | 8 klatek FilmStrip (`aria-pressed`), częściowo poza ekranem w poziomie, ale przewijane do widoku |
| `/automation-house` | 20 | 5 pustych `li` (P1.6) |
| `/otb` | 16 | Slider „Kula” (nazwa mogłaby mówić, co robi) |
| `/sassy` | 15 | `tablist` z jednym przystankiem, strzałki w środku |
| `/aion-mind` | 16 | „Pobierz ↗” ×2 (P1.8) |
| `/ourmoney` | 18 | Suwaki z etykietami (`<label for>`) |
| 404 | 11 | OK |

Przy 390×844 (`/`, `/o-nas`, `/busy-bee`, `/ourmoney`) nie znalazłem zasłoniętych ani niewidocznych przystanków. Na dev ostatnim przystankiem jest nakładka Next (`nextjs-portal`), której na produkcji nie ma.

### 📊 Ogólna ocena

| Wymiar | Ocena (1-5) | Komentarz |
|---|---|---|
| SEO techniczne | 4/5 | Komplet znaczników, sitemap, 404, redirecty. Do poprawy pliki techniczne i okładki OG |
| SEO treściowe | 3/5 | Title strony głównej i numerowane nagłówki case'ów marnują najsilniejsze sygnały |
| Dane strukturalne | 3/5 | Dobra architektura `@graph`, dwa błędy danych (creator, Event) |
| Semantyka HTML5 | 4/5 | Szeroki repertuar elementów, drobne niespójności między stronami |
| Dostępność | 4/5 | axe 0 naruszeń, alt 100%, fokus widoczny. Luki w kolejności Tab (Automation House, naklejki) i w nazwach linków |

### 🎯 Top 3 priorytety do wdrożenia
1. **Tekst i nagłówki:** separator linii w `Heading`/`Line` (P1.1), nagłówki case study bez numerów (P1.3), `h3` w kaflach realizacji (P2). Zmiana w 3–4 komponentach, bez zmian wizualnych.
2. **Kolejność Tab i nazwy:** `ProcessSteps` bez `tabIndex` (P1.6), naklejki w kolejności wizualnej z numerowanymi nazwami (P1.7), „App Store: Pobierz” (P1.8), sufiks „(nowa karta)” (P2).
3. **Sygnały wyszukiwarki:** decyzja o tytułach (P1.2), `creator` AION i `Event.location` (P1.4–5), opis /o-nas i okładki OG 1200×630 (P2). Potem Rich Results Test na `/`, `/wiedza` i jednym case'ie.

### 🛠 Rekomendacja na przyszłość
`scripts/check-outline.mjs` uruchamiany po `next build` na prerenderowanym HTML z `.next/server/app/**`. Sprawdza:
- dokładnie jeden `h1` i brak przeskoków poziomów;
- nagłówki bez numerów i ze spacjami między `.line`;
- jeden `main` i `lang="pl"`.

Dziś poziomy są poprawne, bo kompozycja stron jest płaska i stała, ale nic ich nie pilnuje. Odrzucone alternatywy: kontekst React z poziomem nagłówka (nie działa w Server Components bez `"use client"`) i lint `jsx-a11y` (nie widzi poziomów między komponentami).

### ✅ Wdrożone
2026-09-26 (niezacommitowane), decyzje właściciela do P1.1–P1.8. Sprawdzone na `next dev` (Chromium, 1440×900, dotyk przez emulację CDP):
- **P1.1:** `Heading` wstawia spację między `lines`; to samo w stopce, statemencie „O nas” i `<time>` w `EventTile`. Usunięte obejście `aria-label` (automatyczne w `Heading` i ręczne w stopce). `textContent`: „Budujemy produkty bez zamieszania”, „Czy ja nie płacę więcej?”, „17–18.11 2026 · wt–śr”. Wygląd bez zmian (zrzuty hero i stopki). `[zweryfikowane]`
- **P1.2:** tytuł `/` = „NO-FUSS©2026 | Studio produktowe: aplikacje, strony i AI” (56 zn., `site.homeTitle`), także `og:title` i `twitter:title`. Podstrony bez zmian. `[zweryfikowane]`
- **P1.3:** nowy atom `SectionLabel`: numer „NN / ” widoczny, ale `aria-hidden`. Użyty w `CaseStudySection` (`lite` `h2` i kicker `wide`/`split`) oraz w `CaseStrip`. Nazwy w drzewie dostępności: „W skrócie”, „Mobile”, „Codzienność”, „W liczbach”, „Przewodnicy”. Copy etykiet bez zmian. `[zweryfikowane]`
- **P1.4:** `authorship()` zawsze daje `creator` = no-fuss; AION MIND dostaje `contributor` = Magda i `about` → `…/aion-mind#app`. Węzeł `Organization` AION na stronie case'u czyta `aionMind.employer`. `[zweryfikowane]`
- **P1.5:** `Event` tylko dla wydarzeń z `place` albo `online`. „Polska With AI” zostaje w UI, ale wypada z JSON-LD i z `hasPart`. `[zweryfikowane]`
- **P1.6:** kroki procesu (Automation House) to przyciski w `h3` z `aria-expanded`/`aria-controls`:
  - Enter, Spacja lub klik w kafel rozwija opis, otwarty jest jeden krok naraz;
  - zwinięty opis ma `visibility: hidden`;
  - obrys fokusu na kaflu;
  - hover myszą podgląda opis jak wcześniej;
  - na dotyku nie ma przycisków, a opisy są widoczne od razu.
  - Opt-out kursora `data-cursor="arrow"` usunięty (nie miał już użytkowników). `[zweryfikowane]`
- **P1.7:** naklejki na /o-nas są poza Tab (`aria-hidden`, bez roli i obsługi strzałek, usunięte instrukcja dla czytnika i `stickerLabel`). Przeciąganie myszą działa. Przystanki Tab do stopki: 26 → 20. `[zweryfikowane]`
  - Uwaga: WCAG 2.1.1 i 2.5.7 formalnie obejmują każdą funkcję. Naklejki traktujemy jako dekorację bez treści (decyzja właściciela).
- **P1.8:** fakty hero z powtarzającą się treścią linku dostają sr-only termin: „App Store: Pobierz ↗”, „Google Play: Pobierz ↗”. Wygląd bez zmian. `[zweryfikowane]`
- **Kontrola:** `tsc` i ESLint na zmienionych plikach bez błędów. axe-core 0 naruszeń na `/`, `/o-nas`, `/wiedza`, `/automation-house`, `/aion-mind`, `/ourmoney`, `/busy-bee`.
- **Dokumentacja:** `docs/COMPONENTS.md` i `DESIGN.md` zaktualizowane.

Otwarte: wszystkie P2.
