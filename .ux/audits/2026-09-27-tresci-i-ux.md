---
data: 2026-09-27
produkt: inne
zakres: no-fuss (Next.js), cała strona — /, /o-nas, /wiedza, 6 case study, 404; treść (copy, fakty, typografia PL, terminologia), struktura i ścieżka konwersji, spójność wizualna, interakcje i motion, formularz kontaktowy (bezpieczeństwo i RODO), status otwartych ustaleń z 09-25 i 09-26
tryb: hybrid
p0: 1
p1: 11
p2: 16
---

### 🔍 Audyt: treści i UI/UX

**Kontekst** Porządkowanie treści i UI/UX portfolio przed premierą. Cel strony: pozyskanie klientów usługowych, case study = narzędzie sprzedaży.
**Materiał**
- Przegląd kodu `src/` (6 agentów): treść, struktura case study, struktura stron głównych i kontaktu, style i z-index, interakcje i motion, security review formularza.
- Przegląd na żywo na `next dev` (localhost:3000, Chromium): /, /o-nas, /wiedza, 404 przy 1440/1024/768/390; 6 case study przy 1440/390 (+1024/768 dla /ourmoney, /otb, /busy-bee). Pomiary: `scrollWidth`, tekst < 12 px, przecięcia HUD × tekst (`Range.getClientRects`), mapa tonów sekcji, łamanie kwot i dat, wymiary źródeł (`sips`).
- Weryfikacja wszystkich otwartych ustaleń z audytów 2026-09-25 i 2026-09-26 w bieżącym kodzie (z niezacommitowanymi zmianami).
**Uwaga** Drzewo robocze zawiera niezacommitowane zmiany właściciela (wdrożenie audytu 09-26, z-index 2 dla kanw 3D i naklejek, zapętlony sweep w `ProcessSection`). Audyt obejmuje ten stan.
**Statusy** `[zweryfikowane]` zmierzone na żywo, `[kod]` potwierdzone w źródłach, `[decyzja]` wymaga decyzji właściciela, `[materiał]` wymaga treści/assetów od właściciela, `[urządzenie]` do sprawdzenia na prawdziwym telefonie.

### ✅ Co działa dobrze
- 0 poziomego scrolla i 0 elementów poza viewportem na 10 stronach i wszystkich badanych szerokościach. `[zweryfikowane]`
- P1.5 z 09-25 zamknięte: h1 strony głównej nie leży już na limonkowym obiekcie 3D przy 1024 i 1440. Zdjęcia osób na /o-nas są ostre (źródło 1254 px). `[zweryfikowane]`
- Warstwy po podniesieniu kanw 3D i naklejek na z-index 2 działają: siatka pod treścią, treść i CTA klikalne nad naklejkami (`elementFromPoint`), kursor nad wszystkim. `[zweryfikowane]`
- Formularz: walidacja po stronie serwera z limitami, brak header/HTML injection, stały adresat, klucz tylko po stronie serwera, `aria-invalid`/`aria-describedby`, fokus na pierwsze błędne pole, `role="status"` zamontowany zawsze. Trzy kontrole z 09-26 zamknięte. `[kod]` `[zweryfikowane]`
- Mechanizm placeholderów szczelny: żaden `[…]` nie trafia do UI ani JSON-LD. Pętla „Następny projekt” zamknięta, kontakt osiągalny z każdej strony (stopka `#kontakt` w layoucie). `[kod]` `[zweryfikowane]`

### 🔴 P0: blokuje premierę

**1. Formularz bez informacji RODO i bez polityki prywatności**
- **Problem:** formularz zbiera imię, e-mail i wiadomość i przekazuje je do Resend (USA). Przy formularzu nie ma informacji z art. 13 RODO (administrator, cel, podstawa, odbiorcy, transfer, okres, prawa), w serwisie nie ma strony polityki prywatności.
- **Dowód:** `src/components/molecules/ContactForm/ContactForm.tsx:142-152`, `src/content/site.ts:61-68`, `src/lib/contact/action.ts:24-33`; brak trafień „prywatno|polityk|RODO|privacy” w `src/`.
- **Fix:** krótka klauzula pod przyciskiem (mono-sm) z linkiem, nowa trasa `/polityka-prywatnosci`, link w stopce. Checkbox zgody niepotrzebny przy podstawie art. 6 ust. 1 lit. b/f.
- **Status:** `[kod]` + `[materiał]` (dane administratora: JDG / spółka / wspólnicy).

Powtórka z 09-25: **P0.3 kontakt** — częściowo. E-mail jest prawdziwy, ale `calendarUrl: null`, 3× social `href: null`, `responseNote` placeholder (`src/content/site.ts:63-73`). `[materiał]`

### 🟡 P1: ważne

**Formularz kontaktowy**
1. **Brak rate limitu i realnej ochrony przed botami.** Server Action to publiczny POST, ID akcji jest w bundlu, żądania bez `Origin` Next przepuszcza z ostrzeżeniem. Jedyny filtr to honeypot. Skrypt w pętli zaleje skrzynkę i wyczerpie dzienny limit Resend, po czym prawdziwi klienci dostaną „nie doszła”. Fix: limit per IP (Upstash/Vercel KV albo reguła Vercel Firewall na `Next-Action`), pułapka czasowa (HMAC timestamp), `serverActions.bodySizeLimit` ~32 kB. `src/lib/contact/action.ts:48-58`, `next.config.ts:29-42`. `[kod]` `[decyzja]` (hosting)
2. **Honeypot `name="website"` może po cichu zgubić lead.** Autofill / menedżer haseł wpisuje URL w ukryte pole → użytkownik widzi „wiadomość doszła”, mail nie wychodzi, brak śladu w logu. Fix: nieznacząca nazwa (np. `nf_field_2`), `autoComplete="new-password"` + `data-1p-ignore data-lpignore="true"`, `console.warn` bez PII w gałęzi pułapki. `src/lib/contact/form.ts:19`, `action.ts:54`, `ContactForm.tsx:128-131`. `[kod]`

**Nagłówki, motion, nawigacja**
3. **/wiedza: h1 „PRZEKAZUJEMY” ma uciętą literę Y na każdej szerokości.** Tekst linii o 6–13 px szerszy niż pudełko, `.line` ma `overflow: hidden`. Przyczyna: `max-width: 12ch` (`src/components/organisms/PageHero/PageHero.module.css:17-18`). Fix: `13ch` albo `max-width: none` od 1024 px. `[zweryfikowane]`
4. **„Jak pracujemy”: zapętlony sweep bez końca i pauzy (WCAG 2.2.2, poziom A).** Cykl 5,6 s, trwa, dopóki sekcja jest w widoku. Treść kroku przesuwa się o 12 px co 1,4 s, więc czytany tekst się rusza. Przy 390 podświetlany bywa krok poza ekranem. Duży numer w tle (158 px) przecina opis kroku przy 1440. Kod sam zaznacza naruszenie. Fix: jeden przebieg ≤ 1200 ms/krok (4,8 s), aktywny krok bez `translateX`, numer poza obszarem tekstu. `src/components/organisms/ProcessSection/ProcessSection.tsx:20-24,38`, `src/lib/hooks/useSweep.ts`. `[zweryfikowane]` `[decyzja]`
5. **HUD nieczytelny i nachodzi na treść (rozszerza 09-25 P1.3 i P1.4).**
   - 390: tekst treści przecina się z logo/linkami HUD na / w 26 z ~45 pozycji scrolla, na /o-nas w 17/36, na /wiedza w 9/21 („USŁAT AUTOMATION HOUSE” na karcie Kuby). Linki dzieli 8 px, więc czytają się jako jeden ciąg „USŁUGI REALIZACJE O NAS KONTAKT”.
   - `mix-blend-mode: difference` gubi kontrast nad: og-image i kalendarzem na /aion-mind, posterem LiveFrame i PhoneScrollerem na /otb, marquee na /o-nas (1440), cyfrą 3D „4” na 404, limonkowym krokiem procesu na / (390); na /sassy etykiety „03 / MOBILE” nachodzą na logo.
   - Fix: poniżej 768 px chować nawigację przy scrollu w dół; `gap` ≥ 16 px; `isolation: isolate` na sekcjach z obrazem/limonką albo wariant HUD `data-tone` (jak kursor). `src/components/organisms/Hud/*`, `CaseStage`, `DragBall`, `Marquee`, `NotFoundStage`. `[zweryfikowane]` `[decyzja]`

**Treść i dowody**
6. **„Etat: Automation House” na karcie Kuby przeczy case study.** Case jest opisany jako zlecenie klienta (`ownership: "client"`), a karta Kuby używa tego samego terminu „Etat”, co Magda dla AION MIND. Klient nie wie, czy to pracodawca, czy klient. `src/content/about.ts:130`, `src/content/cases/automation-house.ts:26-28`. Fix zależny od faktów: pracodawca → case oznaczony jak AION MIND; klient → inny termin albo usunięcie wiersza. `[zweryfikowane]` `[decyzja]`
7. **Case'y WWW (Busy Bee, Automation House, OTB, Sassy) nie sprzedają efektu (rozszerza P1.14).**
   - Hero bez leadu: w `#hero` jest tylko eyebrow, lewa dolna połowa pusta przy 1440/1024 (`busy-bee/page.tsx:60-66`, `automation-house/page.tsx:58-64`, `otb/page.tsx:52`, `sassy/page.tsx:65`).
   - EFEKT w „W skrócie” i WYNIK w hero to „Strona działa pod adresem …”.
   - „04 / Fakty” powtarza metryczkę z hero prawie 1:1 i kończy stronę tuż przed CTA (700–960 px przy 390 bez nowej informacji).
   - Fix: lead (1 zdanie: problem → efekt), EFEKT = zmiana u klienta (cytat, co ułatwiła strona, pierwsze dane), „Fakty” skrócić do pozycji spoza hero albo zastąpić cytatem. `[zweryfikowane]` `[materiał]`
8. **Brak dowodów przed kontaktem (rozszerza P1.11).**
   - Strona główna: opinie 0/3 (sekcja się nie renderuje), jedyny dowód to 5 logotypów. `src/content/home.ts:169-187`.
   - „W liczbach” na OurMoney i AION MIND to liczby zakresu, nie efektu.
   - Sformułowania szkodzące: „Czytelna dla scraperów AI” (/automation-house, hero i Fakty) → „Czytelna dla wyszukiwarek i asystentów AI”; AION MIND „Rola no-fuss: — (etat Magdy, nie projekt no-fuss)” → „Product design, dziś Head of Operations (Magda)”, informacja o etacie zostaje w eyebrow. `src/content/cases/automation-house.ts`, `src/content/cases/aion-mind.ts:76`.
   - `[zweryfikowane]` `[materiał]` (min. 1 prawdziwa opinia)
9. **OurMoney: dane testowe i rozmyte zrzuty (potwierdza P1.12).** Transakcje „test”, „test” (hero i 03.1), osoba „T2 Test 2” (03.5). `zasady-podzialu.png` ma 391×202 i jest rozciągany 1,4–1,9× już przy DPR 1; telefony 387–415 px na 300–360 px CSS. Fix: zrzuty z konta demo (Anna/Michał, spójne z kalkulatorem), eksport ≥ 2× (~780 px), „Nasze zasady” ≥ 1100 px. `[zweryfikowane]` `[materiał]`
10. **/o-nas: karta „Agenci AI” to pusta ramka (rozszerza P1.10).** Kadr 688×917 przy 768 z ikoną ~100 px, sekcja kart 4430 px (4,3 viewportu). Fix: poniżej 900 px kadr 4:3 albo `max-height: 60svh`; karta agentów bez ramki 3:4 (ikona w nagłówku albo kadr 16:9). `src/components/organisms/TeamSheets/*`, `PersonCard/*`. `[zweryfikowane]`
11. **FAQ: gotowa odpowiedź o prawach do kodu i designu jest ukryta.** „Do kogo należy kod i design?” to placeholder w nawiasach, więc pytanie znika z UI i `FAQPage`. Kluczowa obiekcja B2B. Copy do potwierdzenia: „Do Was. Po rozliczeniu przekazujemy prawa autorskie, repozytorium i pliki projektowe.” `src/content/faq.ts:41-42`. `[decyzja]`

### 🟢 P2: nice to have
- **Rytm tonów:** dwie ciemne pod rząd na /ourmoney (03.4 → 03.5), /otb (02 → 03) i /o-nas (`#wydarzenia` ciemne, bo ton zależy od ukrytej sekcji postów, potem StickerBoard). `ourmoney/page.tsx:207-231`, `otb/page.tsx:62,70`, `o-nas/page.tsx:59-61`. `[zweryfikowane]`
- **Typografia polska:**
  - `home.ts` bez twardych spacji (lead hero, 5 opisów usług; reszta `content/` używa `NBSP`);
  - brak NBSP przed „zł” (`ourmoney/page.tsx:179-180,226`) i „h” (`sassy.ts:73`), „01.2025 – 05.2026” ze spacjami (`aion-mind.ts:38`) wobec „2025–2026” w reszcie serwisu;
  - półpauza na początku linii w podpisach „O nas” przy 768 („— KOD”);
  - wdowa „prelekcjach” w leadzie /wiedza przy 1440;
  - stopka przy 390: „BEZ” sam w linii i 0 px do limonkowego „ZAMIESZANIA” (`Footer.tsx:26-27`);
  - brak przecinka w tytule wydarzenia „…automatyzacja, jaką znamy, …” (jeśli to nie oficjalny tytuł). `[zweryfikowane]` `[kod]`
- **Łamanie linków:** „↗” samo w drugiej linii (/busy-bee hero), domena łamana na dywizie „sassy- / tan.vercel.app”, „1 / plik”, etykieta „03.3 / / PRZEWODNICY” przy 390. Fix: NBSP przed strzałką, `nowrap` na domenach, NBSP po „/”. `[zweryfikowane]`
- **Siatki z dziurą:** realizacje przy 768–1023 (Sassy sam, pusta komórka ~360×300), AION „W liczbach” 3 kafle w 4 kolumnach (`CaseNumbers.module.css:30-33`), TeamSheets przy 900–1199 (trzecia karta sama), `RolePath` łamie się przy 800 px, sąsiednie sekcje przy 900 (`RolePath.module.css:30`). `[zweryfikowane]` `[kod]`
- **Hover bez `@media (hover: hover)`** w 13 plikach (Button, ArrowLink, ContactForm, PersonCard, SocialLinks, MetaRow, Footer, LiveFrame, FindSection, AboutSection, ToySwitcher, SpecList, CaseStudyLayout) → przyklejony hover na dotyku, wbrew konwencji z DESIGN.md. Przycisk wysyłki w stanie „Wysyłamy…” wygląda na aktywny (brak stylu `[aria-disabled]`). `[kod]`
- **LiveFrame:** przycisk „Otwórz na żywo” wyśrodkowany zasłania punkt centralny postera (/automation-house, /otb, /sassy); po „Załaduj” fokus spada na `body` (09-25, otwarte). `[zweryfikowane]`
- **ToySwitcher przy 390:** po tapnięciu podgląd zmienia się poza ekranem (lista 7 pozycji zajmuje ekran). Fix: `scrollIntoView` na podgląd albo lista jako chipy. `[zweryfikowane]`
- **Busy Bee:** taśma reklam (Mercedes, Nescafé, Samsung) czyta się jak klienci no-fuss; wyjaśnienie jest tylko w podpowiedzi. Fix: widoczny podpis „Realizacje klienta”. `[kod]`
- **Kolejność „Następny projekt”:** pętla zaczyna od produktu własnego (OurMoney) i etatu (AION MIND), pierwsze zlecenie klienta jest trzecie. `src/content/routes.ts:145-151`. `[decyzja]`
- **„Następny projekt ↗” na /ourmoney** prowadzi do strony wewnętrznej strzałką zewnętrzną. Udokumentowana reguła z legacy, do ponownej decyzji. `ourmoney/page.tsx:98`. `[decyzja]`
- **Formularz, utwardzenie:** `EMAIL_PATTERN` przepuszcza `<>,;"()` (trafia do `reply_to`), znaki bidi/sterujące w imieniu trafiają do tematu maila z Waszej domeny → stały temat, usuwanie `\p{Cc}\p{Cf}`; guard `formData instanceof FormData`; log odpowiedzi Resend bez danych wejściowych; osobny komunikat dla za długiego e-maila. `src/lib/contact/form.ts:35,48-68`, `action.ts:30-43`. `[kod]`
- **Nagłówki bezpieczeństwa:** brak CSP i `frame-ancestors`/`X-Frame-Options` (clickjacking formularza). Fix: `X-Frame-Options: DENY` + CSP najpierw jako Report-Only (frame-src dla 4 originów LiveFrame). `next.config.ts:19-27`. `[kod]`
- **Wydajność i obrazy:** brak `priority`/preload na obrazach LCP (sprawdzić API w Next 16), `aion-mind/og-image.png` 1,2 MB i użyty jako kadr sekcji (1200 px na 1440 full-bleed), portrety przewodników PNG ~350 KB, `ScrollProgress` bez rAF, `useSweep` nie reaguje na zmianę `prefers-reduced-motion` w trakcie. `[kod]` `[zweryfikowane]`
- **Terminologia:** „Realizacje” / „case study” / „projekt” (09-25, otwarte); link do produktu w faktach raz „Zobacz” (OurMoney, AION), raz „Strona” (case'y WWW); „Product Designerka” vs „Developer”. `[decyzja]`
- **Domena:** e-mail i nadawca formularza na `no-fuss.house`, a canonical, sitemap, JSON-LD i `llms.txt` na `no-fuss.pl`. `src/content/site.ts:63`, `src/lib/seo/site-url.ts:5`, `public/llms.txt`. `[decyzja]`
- **Motyw „zamieszanie”** pojawia się ~8 razy na ścieżce / → /o-nas → 404. Świadomy kalambur marki, tylko obserwacja. `[decyzja]`

### ❎ Odrzucone i do sprawdzenia na urządzeniu
- **Odrzucone:** „OTB obiecuje opinie founderów, których nie ma” — to opis sekcji na stronie OTB, którą zaprojektowała Magda, nie obietnica opinii o no-fuss (`otb.ts:42`).
- **Odrzucone:** zmienne CSS dla breakpointów — `var()` nie działa w warunkach `@media`.
- **`[urządzenie]` PhoneScroller łapie swipe przy 390:** pomiar bez `pointer: coarse` (emulacja `hasTouch` go nie włącza, szerokość telefonu 320 zamiast ~273 px). Kod ma blokadę „Dotknij, aby przewijać” (`PhoneScroller.tsx:27-39`). Sprawdzić na telefonie.
- **`[urządzenie]` SplitCalculator zmienia wartość przy swipe po torze:** ta sama emulacja; na iOS tor zwykle nie reaguje na tap.
- **`[urządzenie]` ProcessSteps „najedź na krok” na dotyku:** test bez `pointer: coarse`; wdrożenie 09-26 pokazuje opisy na dotyku od razu.

### 🔁 Status otwartych ustaleń
| Audyt | Zamknięte | Częściowo | Nieaktualne | Otwarte | Tylko na żywo |
|---|---|---|---|---|---|
| 2026-09-25 | 8 (m.in. P1.5, FAQ 46ch, NBSP w AboutSection, CopyEmail) | 6 (P0.3, P1.11, P1.12, hero /o-nas, 404 fokus, AION liczby) | 2 („Następny ↗” udokumentowane, `PairSubscription` nie istnieje) | ~33 | 9 |
| 2026-09-26 (P2 + formularz) | 5 (3 kontrole formularza, `ProcessSteps` h3, alt OTB/Sassy) | 1 (404 `og:title`) | 1 (`FAQPage`) | 26 (S: ~19) | 1 |

Szybkie S bez decyzji z 09-26: `WorkGrid` `ul`, `h3` w kaflach realizacji, stopka `address`/`small`, `article` bez CTA i „Następny”, logo `aria-current`, `[02]` `aria-hidden`, Marquee pauza na hover/focus, sufiks „(nowa karta)”, `sceneLabel` w 404, alt w ToySwitcher/GuideCards/StickerBoard, manifest `name`/`id`, `robots` bez `Host`, `article:published_time`, komentarz 301→308, `warn` przy złym `NEXT_PUBLIC_SITE_URL`.

### 📊 Ogólna ocena
| Wymiar | Ocena (1-5) | Komentarz |
|---|---|---|
| Treść | 3/5 | Konkretne copy usług i FAQ; case'y WWW bez efektu, sprzeczny „Etat”, drobna typografia |
| Struktura i konwersja | 2/5 | Kontakt osiągalny wszędzie, ale brak dowodów (opinie 0/3), case'y WWW kończą się metryczką, kalendarz i social puste |
| Spójność wizualna | 4/5 | 0 overflow, z-index spójny; ucięte h1 na /wiedza, dziury w siatkach, dwie ciemne pod rząd |
| Nawigacja (HUD) | 2/5 | Nakładanie na treść przy 390, utrata kontrastu nad obrazami i limonką |
| Interakcje i motion | 4/5 | Widżety dopracowane; pętla sweepa, hover bez bramki na dotyku |
| Formularz: bezpieczeństwo i RODO | 2/5 | Solidna walidacja; brak klauzuli RODO, rate limitu, ryzyko cichej utraty leadu |

### 🎯 Top 3 priorytety
1. **Premiera formularza:** RODO + polityka prywatności (P0.1), rate limit i honeypot (P1.1–2), utwardzenie walidacji (P2).
2. **Czytelność:** HUD na mobile i nad obrazami (P1.5), h1 /wiedza (P1.3), sweep bez pętli (P1.4), karta agentów i kadry na /o-nas (P1.10).
3. **Sprzedaż w treści:** „Etat” Kuby (P1.6), lead i efekt w 4 case'ach WWW (P1.7), dowody i sformułowania (P1.8), zrzuty OurMoney (P1.9), odpowiedź FAQ o prawach (P1.11).

### 🧭 Decyzje właściciela (2026-09-27)
- P1.6: Automation House by Tigers to pracodawca Kuby → case oznaczony jak AION MIND (etat), „Etat” na karcie Kuby zostaje.
- P1.4: pętla sweepa w „Jak pracujemy” zostaje (świadome odstępstwo od WCAG 2.2.2).
- P1.5: HUD bez zmian w tej iteracji (właściciel pracuje nad `MobileMenu`).
- Domena: `https://no-fuss.house`. Hosting: Vercel; rate limit formularza = reguła Vercel Firewall na każdy POST (poza kodem).
- P0.1: administrator danych = JDG Magdy (czekamy na dane do polityki prywatności).
- Formularz ma działać bez JS (decyzja kierownika sesji): akcja wprost w `useActionState`, bez blokady nagłówka `next-action`.

### ✅ Wdrożone
2026-09-27 (niezacommitowane). Każda zmiana sprawdzona w przeglądarce na `next dev` (390/768/1024/1440), potem review i security review:
- P1.1: `bodySizeLimit` 64 kB; odrzucone wywołanie (429, sieć) → `ContactFormBoundary` i stan `failed` z mailto; formularz działa bez JS. Rate limit: po stronie Vercel. `[zweryfikowane]`
- P1.2: honeypot `nf_field_2` z atrybutami anty-autofill, log trafień bez PII. `[zweryfikowane]`
- P1.3: h1 /wiedza bez ucięcia na 390–1440 (`min-width: min-content`), lead bez wdowy. `[zweryfikowane]`
- P1.6: Automation House jako etat Kuby (kicker, kafel, „Firma”, termin „Rola”, JSON-LD `Organization` + `employee`, `about` tylko przy `softwareApp`). `[zweryfikowane]`
- P1.10: karty /o-nas: kadr ≤ 60svh poniżej 900 px, agenci 16:9, 900–1199 bez osieroconej karty; sekcja przy 768: 4430 → 3293 px. `[zweryfikowane]`
- P2 formularz: e-mail tylko ASCII, usuwanie Cc/Cf (bez ZWJ/ZWNJ), stały temat, guard `FormData`, logi Resend bez PII; `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`. `[zweryfikowane]`
- P2 rytm tonów: /ourmoney, /otb, /o-nas bez dwóch ciemnych pod rząd. `[zweryfikowane]`
- P2 typografia: twarde spacje w `home.ts`, przy „zł”/„h”/„plik”, przed „—” w podpisach „O nas”, półpauza bez spacji w AION. `[zweryfikowane]`
- P2 łamanie linków: strzałka nie zostaje sama (ArrowLink, `LinkText`, „Następny projekt”), domeny bez łamania na dywizie, `SectionLabel` bez łamania po „/”. `[zweryfikowane]`
- P2 siatki: realizacje 768–1023 (ostatni kafel pełna szerokość + `sizes`), CaseNumbers (kolumny = kafle), RolePath 900 px. `[zweryfikowane]`
- P2 hover tylko przy `(hover: hover)` w ~25 plikach, stan `aria-disabled` w Button, FindSection z fokusem jak hover. `[zweryfikowane]`
- P2 LiveFrame: przycisk w rogu postera (48 px), fokus po załadowaniu na oknie ramki z widocznym obrysem, `role="group"`. P2 ToySwitcher: podgląd nad listą poniżej 1024, wyrównanie aktywnej pozycji. P2 stopka: `address`/`small`, odstęp „bez / zamieszania”. P2 FAQ: „na rozmowie” jako link. `[zweryfikowane]`
- Domena `no-fuss.house` w kodzie, `.env.example`, README, `llms.txt`; `warn` przy złym `NEXT_PUBLIC_SITE_URL`. `[zweryfikowane]`

Otwarte: P0.1 (dane do polityki prywatności), P0.3, P1.5, P1.7–1.9, P1.11 (treść/materiały), pozostałe P2 (m.in. drobne a11y z 09-26, priorytet LCP, pełne CSP, terminologia, kolejność „Następny projekt”).
