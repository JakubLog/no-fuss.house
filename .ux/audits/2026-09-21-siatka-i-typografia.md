---
data: 2026-09-21
produkt: inne
zakres: no-fuss, siatka 8 px i warianty typografii (strona główna v5, O nas v1, case OurMoney v1)
tryb: hybrid
p0: 0
p1: 4
p2: 4
---

### 🔍 UX Audit: no-fuss, siatka i typografia

**Kontekst** Trzy aktualne strony no-fuss. Pytanie Magdy: czy wszystko stoi na siatce i rytmie 8 px, czy warianty fontów zgadzają się z DESIGN.md i czy nie ma ich za dużo.
**Materiał** `no-fuss-v5.html`, `o-nas-v1.html`, `case-ourmoney-v1.html`, `DESIGN.md`. Pomiar z computed styles przy 1440×900 (skrypt zliczający unikalne zestawy font/rozmiar/interlinia/waga oraz paddingi, marginesy i gapy niebędące wielokrotnością 4 px). Ilustracje telefonu OurMoney i próbki dwóch języków wizualnych wyłączone z pomiaru, bo celowo pokazują cudzy system.

### ✅ Co działa dobrze
- Metadane są zdyscyplinowane: Geist Mono występuje w dwóch rozmiarach (14/20 i 12/16) i niesie 198 z 310 zmierzonych elementów tekstowych. To się zgadza z DESIGN.md co do piksela. `[zweryfikowane]`
- Dwie rodziny krojów na całej stronie, zero trzeciej poza case study, gdzie Instrument Serif jest cytatem z marki klienta. `[zweryfikowane]`
- Makro-rytm jest czysty: guttery 56 px, sekcje 96 px, gap kafli 8 px, wysokości hero i stopki 100svh. Wszystko wielokrotności 8. `[zweryfikowane]`

### 🔴 P0: krytyczne
Brak.

### 🟡 P1: ważne

**1. Za dużo wariantów kroju treści: 24 zestawy TikTok Sans wobec 4 w DESIGN.md**
- **Problem:** DESIGN.md definiuje dla TikTok Sans cztery role (display 700, statement 400, title 500, body 400). Na trzech stronach zmierzyłem 24 różne zestawy rozmiar/waga: strona główna 8, O nas 8, case study 12. Przykłady z samego case study: 187, 144, 101, 63, 40, 36, 32, 22, 21,6, 20 px.
- **Soczewka:** Nielsen, spójność i standardy.
- **Dlaczego:** każda nowa sekcja dostawała własny `clamp()`, więc skala nie jest skalą, tylko zbiorem wyjątków. Przy kolejnych podstronach będzie tylko rosło.
- **Fix:** zamknąć skalę w 7 tokenach CSS i używać wyłącznie ich: `--t-mega` (imiona, tytuł case), `--t-display`, `--t-h2`, `--t-statement`, `--t-title`, `--t-lead`, `--t-body`. Wszystkie `font:` w sekcjach zastąpić klasami.
- **Status:** `[zweryfikowane]`

**2. Waga 800 nie istnieje w DESIGN.md, a jest na każdej stronie**
- **Problem:** DESIGN.md zna wagi 400, 500, 700. W kodzie 800 mają: logo, imiona MAGDA/KUBA, tytuł OURMONEY, nagłówki kart postaci, „Oklej nas", cudzysłów w testimonialu, liczby, marquee. Do tego ten sam rozmiar 86,4 px występuje raz jako 700, raz jako 800 (`o-nas-v1.html`).
- **Soczewka:** Nielsen, spójność i standardy.
- **Dlaczego:** dwie prawie identyczne wagi display obok siebie wyglądają jak błąd, nie jak decyzja.
- **Fix:** decyzja Magdy, jedna z dwóch: (a) display zostaje 700 wszędzie, 800 znika; (b) 800 wchodzi do DESIGN.md jako osobna rola „mega" tylko dla największych napisów, a wszystko ≤ display wraca na 700.
- **Status:** `[zweryfikowane]`

**3. Dwie różne siatki kolumn i stopka poza gutterem**
- **Problem:** hero i sekcja „o nas" używają 12 kolumn bez gapu (kolumna 4 zaczyna się na 392 px), kafle, usługi i testimoniale używają 12 kolumn z gapem 8 px (kolumna 4 na 394 px, kolumna 7 na 724 zamiast 720). Stopka ma padding 64 px zamiast guttera 56 px, więc jej nagłówek startuje na 221 px, poza jakąkolwiek kolumną. Suwak „Zamieszanie" jest pozycjonowany absolutnie (340 px szerokości, start na 988 px, czyli kolumna 8,4).
- **Soczewka:** Nielsen, estetyka i spójność.
- **Dlaczego:** strona ma stale widoczne linie siatki z pionem dokładnie na środku (720 px). Każde odchylenie treści o 2 do 4 px od tej linii widać gołym okiem, bo linia jest wzorcem.
- **Fix:** jedna definicja `.grid12 { grid-template-columns: repeat(12, 1fr); column-gap: 8px }` użyta wszędzie, stopka na `padding-inline: var(--gutter)`, suwak jako element siatki (`grid-column: 9 / span 4`).
- **Status:** `[zweryfikowane]`

**4. Mikro-odstępy poza rytmem 4/8 px**
- **Problem:** zmierzone wartości spoza wielokrotności 4: tagi i chipy `2×6` px, podpis kafla `margin-top: 10`, wiersze „Kto co robi" `padding: 22` i `margin: 10`, chipy stacku `6×10`, meta case study `10` i `2`, marquee `28,8`, `mark` w nagłówku `6,9`, suwak `padding-bottom: 10`, akapity case `21,6`. Osobna grupa: wartości na siatce 4, ale nie 8 (gapy 12, paddingi 28 i 4).
- **Soczewka:** Nielsen, spójność i standardy.
- **Dlaczego:** DESIGN.md deklaruje `unit: 4px`, więc 12 i 28 są legalne, ale 2, 6, 10, 22 już nie. Część z nich to wartości w `em`, które dają ułamki (28,8, 21,6, 6,9).
- **Fix:** tokeny `--s1: 4px … --s12: 96px` i zamiana: 2×6 → 4×8, 10 → 8 albo 12, 22 → 24, 6×10 → 8×12, odstępy w `em` → tokeny px. Jeśli rytm ma być twardo 8, to dodatkowo 12 → 8 albo 16, 28 → 24 albo 32.
- **Status:** `[zweryfikowane]`

### 🟢 P2: nice to have
- Geist Mono 16/24 bez wersalików w hero (2 elementy) nie jest rolą z DESIGN.md → zamienić na body TikTok Sans 16/24 albo dopisać rolę `mono-lg`. `[zweryfikowane]`
- Geist Mono 12/16 bez wersalików w kalkulatorze (3 elementy) łamie zasadę „mono zawsze wersalikami" → dodać `text-transform`. `[zweryfikowane]`
- `.line` ma `padding-bottom: .06em`, co daje ułamki 1,9 do 9,9 px → to kompensacja maski reveal, zostawić, ale opisać w DESIGN.md jako wyjątek. `[zweryfikowane]`
- Interlinie nie siedzą na siatce bazowej 4 px (46,7, 39,6, 32,8, 29,2 px) → po zamknięciu skali ustawić interlinie tokenów na wielokrotności 4. `[zweryfikowane]`

### 🔁 Regresje i powtórki
brak wcześniejszych audytów

### 📊 Ogólna ocena

| Wymiar | Ocena (1-5) | Komentarz |
|---|---|---|
| Użyteczność | nie oceniano | poza zakresem tego audytu |
| Spójność wizualna | 3/5 | makro-rytm i mono trzymają system, skala kroju treści i mikro-odstępy się rozjechały |
| Flow konwersyjny | nie oceniano | poza zakresem |
| Obsługa błędów | nie oceniano | poza zakresem |

### 🎯 Top 3 priorytety do wdrożenia
1. Zamknąć skalę typografii w 7 tokenach i rozstrzygnąć wagę 800 (P1.1 i P1.2), zaktualizować DESIGN.md.
2. Jedna siatka `.grid12` z gapem 8 px na wszystkich stronach, stopka i suwak wpięte w kolumny (P1.3).
3. Tokeny odstępów i wymiana wartości 2, 6, 10, 22 oraz odstępów w `em` (P1.4).
