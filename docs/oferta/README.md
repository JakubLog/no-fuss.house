# Oferty no-fuss (PDF)

Oferty współpracy w PDF, składane z jednego pliku HTML w stylu strony (`DESIGN.md` w korzeniu repo)
i renderowane do A4 przez Chrome. Tu leży wzór i oferty już wysłane.

## Pliki

| Plik | Co to jest |
|---|---|
| `wzor-oferty.html` | **Wzór.** Kopia finalnej oferty dla BNA z polami w `[nawiasach]` zamiast danych klienta |
| `oferta-bna-v6.html`, `oferta-bna-v6.pdf` | Finalna oferta dla Brand New Attitude |
| `oferta-bna-v1.html` … `v5.html` | Poprzednie iteracje, zostawione do porównania. PDF-y v1–v5 są tylko lokalnie, żeby nie puchło repo |

## Oferta dla Brand New Attitude (2026-10-01)

- **Dla kogo:** Zuza z BNA (Brand New Attitude, bna.pl). Magda zapytała ją na Instagramie, czy BNA szuka
  wykonawców i wdrożeniowców, i zaproponowała zostawienie namiaru w ich bazie. Odpowiedź: „Biorę to!!!!".
- **Cel:** wizytówka no-fuss do bazy wykonawców agencji, nie wycena konkretnego projektu. Cen nie ma.
- **Status:** v6 wysłana Zuzie przez Magdę 2026-10-01. Czekamy na odpowiedź.
- **Układ, 5 stron A4:**
  1. okładka z ramką „Już się znamy" (wspólna praca Magdy i BNA nad nową stroną BNA, propozycja
     odświeżenia projektu, wdrożenie do 2 tygodni),
  2. co robimy: pięć usług ze strony plus szkolenia i warsztaty AI,
  3. produkty i realizacje: OurMoney, Automation House, Busy Bee Film, OTB Ventures, z linkami
     do case study i do żywych stron,
  4. jak wchodzimy w projekt (cały projekt, sam design, sam kod, audyt) i jak pracujemy,
  5. zespół, stack, kontakt.
- **Decyzje Magdy z iteracji:**
  - kontakt to `magdanestor@gmail.com`, nie skrzynka studia,
  - okładka OurMoney to ciemna grafika OG „Wspólny budżet, bez kłótni o pieniądze" (wklejona przez Magdę;
    w `public/assets/ourmoney/` leży starsza, limonkowa),
  - przy OTB Ventures: „Magda razem z Wami i Piotrem Chuchłą", bo BNA pracowało przy tym projekcie.
    We wzorze zostaje wersja ogólna, bez „z Wami",
  - bio Magdy bez listy zaprojektowanych stron, bio Kuby: „Developer i człowiek orkiestra".
- **Poszło bez osobnego potwierdzenia:** termin „maksymalnie 2 tygodnie" na wdrożenie (do uzgodnienia z Kubą,
  bo jest już obietnicą wobec BNA) i opis szkoleń AI (napisany na potrzeby oferty, na stronie go nie ma).

## Jak zrobić nową ofertę

1. Skopiuj `wzor-oferty.html` jako `oferta-<klient>-v1.html`.
2. Podmień pola w `[nawiasach]`: nazwa klienta (tytuł i okładka), data `[MM.RRRR]` w nagłówkach stron,
   ramka na okładce. Ramkę usuń, jeśli nie ma nic konkretnego do powiedzenia temu klientowi.
3. Dopasuj realizacje i opisy ról do klienta. Zdjęcia są wbudowane w plik (base64), więc HTML otwiera się
   wszędzie bez folderu `public/`.
4. Wyrenderuj PDF:

   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
     --no-pdf-header-footer --virtual-time-budget=8000 \
     --print-to-pdf=oferta-<klient>-v1.pdf "file://$PWD/oferta-<klient>-v1.html"
   ```

   Fonty (TikTok Sans, Geist Mono) idą z Google Fonts, więc render wymaga sieci.
5. Obejrzyj każdą stronę PDF-a. Strona ma stałą wysokość A4 i ucina to, co się nie mieści: dłuższy tekst
   potrafi wypchnąć stopkę poza kartkę.

## Zasady

- **Tokeny z `DESIGN.md` są wiążące:** TikTok Sans i Geist Mono, grafit `#101318`, jasne `#FCFCFB`, limonka
  `#BBFF00` tylko jako tło na jasnym, zero zaokrągleń, rozmiary tylko z listy ról.
- **Kontrast licz skryptem**, nie na oko: `python3 ~/.claude/skills/ux-audit/scripts/kontrast.py "#tekst" "#tlo"`.
  Pary użyte w ofercie zdają AA.
- **Tylko fakty.** Role w realizacjach opisane uczciwie (kto projektował, kto kodował), żadnych wymyślonych
  liczb, wyników ani cytatów. AION MIND to etat Magdy, nie realizacja no-fuss.
- **Bez cennika**, chyba że Magda poda stawki do konkretnej oferty. Wycena jest indywidualna.
- **Każda iteracja to osobny plik** (`-v2`, `-v3`). Poprzedniej wersji nie nadpisujemy.
