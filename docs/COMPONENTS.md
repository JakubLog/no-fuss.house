# Komponenty no-fuss — kontrakt dla agentów

Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, CSS Modules, metodologia atomowa.
Przed pisaniem CSS przeczytaj [`DESIGN.md`](../DESIGN.md). Wzorce treści i zachowań: `legacy/*.html`.

## Zasady

1. **Server Component domyślnie.** `"use client"` tylko przy interakcji (stan, efekty, zdarzenia, `window`).
   Klienckie wrappery (`Reveal`, `SmoothScroll`) przyjmują serwerowe `children`, więc strona zostaje serwerowa.
2. **three.js tylko przez `next/dynamic` z `ssr: false`**, w komponencie klienckim:
   ```tsx
   "use client";
   import dynamic from "next/dynamic";
   const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
   ```
   Jedna scena 3D na stronę (DESIGN.md). Importy: `three`, `three/addons/...` (np. `three/addons/geometries/TextGeometry.js`).
   **three 0.186:** `TextGeometry` ma `depth` zamiast `height`; fonty typeface nie są w paczce npm, użyj
   `/three/fonts/helvetiker_bold.typeface.json` (skopiowany do `public/`).
   Scena ma czekać na koniec preloadera: `window.addEventListener(INTRO_EVENT, …)` albo `isIntroDone()` z `@/lib/intro`.
3. **Copy 1:1 z legacy.** Nie wymyślamy tekstów. Placeholdery `[w nawiasach]` zostają placeholderami.
4. **Design:** zero `border-radius` w UI (wyjątki: [Wyjątki od zero-radius](#wyjątki-od-zero-radius)),
   jeden akcent `var(--accent)` (na jasnym tylko jako tło), kroje tylko `var(--sans)` / `var(--mono)`,
   rozmiary tylko z tokenów `--t-*`, odstępy w wielokrotnościach 8 px.
5. **Props typowane, bez `any`.** Każdy komponent: `Name/Name.tsx` + `Name.module.css` (jeśli ma własne style) + `index.ts`.
6. **Import** z folderu komponentu (`@/components/atoms/Heading`) albo z barrela warstwy (`@/components/atoms`).
   Barrele warstw eksportują wszystkie komponenty; `HeroScene.tsx` celowo nie (tylko `LazyHeroScene`).

## Czego NIE ruszać bez uzgodnienia

- `src/app/layout.tsx` (chrome, fonty, kolejność warstw, JSON-LD globalne)
- `src/styles/tokens.css`, `src/styles/globals.css` (kontrakt tokenów i klas globalnych)
- `src/lib/intro.ts`, `src/lib/hooks/*`, `src/lib/seo/*` (kontrakty współdzielone)
- `src/content/routes.ts` — **tylko dopisujemy** nowe route'y, nie zmieniamy istniejących
- organizmy chrome: `Preloader`, `Hud`, `GridOverlay`, `Cursor`, `Footer`, `SmoothScroll`

---

## Tokeny i klasy globalne

Tokeny (`src/styles/tokens.css`, źródło: frontmatter DESIGN.md):

| Grupa | Tokeny |
|---|---|
| kolory bazowe | `--light` `--dark` `--shade-900` `--shade-700` `--accent` `--on-accent` |
| tonacja (przepinana przez `.tone-dark` / `.tone-light`) | `--bg` `--ink` `--muted` `--tile` `--tile-ink` |
| hero / stopka | `--hero-sky` `--hero-glow` `--object` |
| alpha na ciemnym | `--alpha-25` `--alpha-100` `--alpha-200` `--alpha-400` `--alpha-600` `--alpha-700` |
| siatka | `--grid-line` `--grid-cross` |
| kroje | `--sans` (TikTok Sans) `--mono` (Geist Mono) |
| typografia (shorthand `font:`) | `--t-mega` `--t-display` `--t-h2` `--t-statement` `--t-title` `--t-lead` `--t-body` `--t-mono` `--t-mono-sm` |
| przestrzeń | `--unit` (8px) `--gap` (8px) `--gutter` (16/56px) `--section-y` (72/96px) `--radius` (0) |
| motion | `--ease` `--reveal-duration` `--reveal-stagger` `--theme-duration` `--scramble-duration` |

Użycie w CSS Modules: `font: var(--t-title);`, `padding: var(--section-y) var(--gutter);`, `color: var(--muted);`.

Klasy globalne (`src/styles/globals.css`):

| Klasa | Do czego |
|---|---|
| `.section` | padding sekcji, tło `var(--bg)`, dzieci nad siatką overlay |
| `.tone-dark` / `.tone-light` | tonacja sekcji (przepina `--bg`, `--ink`, `--muted`, `--tile`) |
| `.grid-12` | siatka 12 kolumn, `column-gap: 8px` |
| `.above-grid` | dzieci dostają `z-index: 2` (nad siatką overlay) dla elementów, które nie są `.section` |
| `.mono` / `.mono-sm` | Geist Mono 14/20 i 12/16, wersaliki |
| `.sr-only` | tylko dla czytników ekranu |
| `.line` + `.fade` + `.is-in` | reveal (sterują `Reveal` i preloader); stagger przez `style={{ "--i": n }}` |

Warstwy (`z-index`): siatka overlay 1, treść sekcji 2, HUD 50, kursor 90, preloader 100, skip link 200.
Tło hero/stopki (`GlowBackdrop`) 0, naklejki 0.

Custom properties w `style` są typowane (`src/types/css.d.ts`): `style={{ "--i": 2 }}` bez rzutowania.

## Wyjątki od zero-radius

W UI `border-radius` jest zawsze 0 (`--radius`). Uzgodnione wyjątki (warstwa zabawy albo ilustracja cudzego sprzętu / UI):

| Gdzie | Dlaczego |
|---|---|
| kula OTB (`DragBall`, `border-radius: 50%`) | warstwa zabawy (rekonstrukcja hero otb.vc) |
| naklejki (`StickerLayer`, `DragSticker`) | warstwa zabawy |
| kursor (`Cursor`) | warstwa zabawy |
| odznaki | warstwa zabawy |
| makiety telefonów: `PhoneFrame` (korpus `12.5% / 6.2%`, ekran `10.5% / 5%`), ekrany w `PhoneScroller` i `JournalScreen`, iPhone w kaflu OurMoney (`WorkTile`) | ilustracja sprzętu, nie UI strony |
| ekran Dziennika AION MIND (`JournalScreen`: przyciski, karty, kropki) | rekonstrukcja UI aplikacji (stałe z legacy, `--jr-*`) |

Portrety przewodników AION MIND są okrągłe w plikach PNG (bez `border-radius`). Ramka `LiveFrame`, pole kuli OTB, pasek preloadera: 0.

---

## Atomy (`src/components/atoms`)

Wszystkie są Server Components, poza `ScrambleLink`. Barrel: `@/components/atoms`.

### `Heading` — server
```ts
type HeadingVariant = "mega" | "display" | "h2" | "statement" | "title" | "lead";
interface HeadingProps {
  variant?: HeadingVariant;          // rola typograficzna (w specyfikacji „role”), domyślnie "h2"
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"; // domyślnie "h2"
  lines?: readonly ReactNode[];      // linie z reveal (stagger 80 ms); zastępuje children
  startIndex?: number;               // --i pierwszej linii
  children?: ReactNode;
  uppercase?: boolean;               // domyślnie true dla mega/display/h2
  className?: string; id?: string; "aria-label"?: string;
}
```
```tsx
<Heading as="h1" variant="display" lines={["Budujemy", "produkty bez", "zamieszania"]} />
<Heading as="h2" variant="h2">Co robimy</Heading>
```
Nazwa propa to `variant`, nie `role` (kolizja z atrybutem ARIA).

### `Text` — server
```ts
interface TextProps { children: ReactNode; variant?: "body" | "lead"; muted?: boolean; as?: "p" | "span" | "div"; className?: string; id?: string }
```

### `MonoLabel` — server
```ts
interface MonoLabelProps { children: ReactNode; size?: "md" | "sm"; muted?: boolean; as?: "span" | "p" | "div" | "small" | "dt" | "dd" | "time"; className?: string; id?: string }
```
```tsx
<MonoLabel muted className="fade">01 / Problem</MonoLabel>
```

### `Tag` — server
```ts
interface TagProps { children: ReactNode; variant?: "accent" | "line"; className?: string }
```
Limonkowy chip (legacy `.chip`, `.tile__tag`). `line` = obrys 1 px.

### `Mark` — server
`<Mark>zamieszania</Mark>` — limonkowe tło w nagłówku.

### `Line` / `Fade` — server
```ts
interface LineProps { children: ReactNode; index?: number; className?: string }
interface FadeProps { children: ReactNode; index?: number; as?: "div" | "span" | "p" | "figure" | "figcaption" | "li" | "dl" | "ul"; className?: string; style?: CSSProperties; id?: string }
```
Budulce reveal: `Line` = `<span class="line"><span>…</span></span>`, `Fade` = element z klasą `.fade`.
Działają wewnątrz `Reveal` (albo hero z `trigger="intro"`). `index` = kolejność w staggerze.

### `ScrambleLink` — client
```ts
interface ScrambleLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "children" | "href"> {
  href: string;       // "/…" i "/#…" → next/link; "#…", "mailto:", "https://" → <a>
  children: string;   // tylko tekst
  external?: boolean; // target=_blank rel=noopener
}
```
`aria-disabled="true"` (link-placeholder): klik nie nawiguje, bez `target` (patrz [Linki-placeholdery](#linki-placeholdery)).
Scramble 420 ms na hover/focus, wyłączony przy reduced motion. `aria-label` = oryginalny tekst.

### `ArrowLink` — server
```ts
interface ArrowLinkProps { href: string; children: ReactNode; arrow?: "→" | "↗" | "↓" | null; external?: boolean; variant?: "plain" | "underline"; className?: string }
```
`underline` = link w tekście (podkreślenie 1 px, hover limonkowe tło).

### `Button` — server
```ts
type ButtonProps =
  | ({ children; variant?: "accent" | "ghost"; className? } & ButtonHTMLAttributes & { href?: undefined })
  | { children; variant?: "accent" | "ghost"; className?; href: string | null; external?: boolean;
      placeholderNote?: string /* „wkrótce” */; "aria-label"?: string; "data-cursor"?: string };
```
Legacy `.btn` z 404. Z `href` renderuje link (`/…` → `next/link`, reszta `<a>`; `external` → `target="_blank" rel="noopener"`).
`href: null` = link-placeholder: `<span>` z wyglądem przycisku, opacity .5, bez hovera, sr-only „(wkrótce)”.
`onClick` tylko z komponentu klienckiego. `data-cursor` (stan `Cursor`) trafia na link/`<a>`, przy placeholderze jest pomijany.

### `VisuallyHidden` — server
`<VisuallyHidden as="h2">Realizacje</VisuallyHidden>`, `role?: "status" | "alert"`.

### `Logo` — server
`<Logo href="/" />` — „no—fuss”, `aria-label="no-fuss, strona główna"`.

### `GlowBackdrop` — server
`<GlowBackdrop className? />` — ciemne tło z czterema smugami limonki (legacy `.hero__bg`). Rodzic: `position: relative; overflow: hidden`.

### `StickerLayer` — server
```tsx
<section data-stickers className="…">   {/* strefa naklejek */}
  <StickerLayer />                       {/* Cursor dokleja tu naklejki */}
</section>
```
Eksporty: `STICKERS` (5 SVG 1:1 z legacy, np. dla przeciąganych naklejek na /o-nas), `stickerClassName`,
`STICKER_ZONE_ATTR`, `STICKER_LAYER_ATTR`. Element z `data-no-stickers` wyłącza naklejki nad sobą (np. suwak).

### `PhotoPlaceholder` — server
```ts
interface PhotoPlaceholderProps { label?: string; children?: ReactNode; tone?: "tile" | "sky" | "lime"; ariaLabel?: string; className?: string }
```
Legacy `.ph`: tło kafla w ukośne kreski, podpis mono w ramce przerywanej. Proporcje (`aspect-ratio`) ustawia rodzic przez `className`.
`ariaLabel` + `children` = ilustracja z `role="img"`.
```tsx
<PhotoPlaceholder label="Zdjęcie Magdy 3:4" className={styles.photo} />
```

### `PartnerLogos` — server
Eksporty: `TigersLogo`, `AutomationHouseLogo`, `BnaLogo`, `InPostLogo` (`PartnerLogoProps` = `SVGProps` bez `children/role/viewBox`),
`PARTNERS: readonly Partner[]` (`{ name, Logo? }`, kolejność z legacy), `PartnerLogo({ partner, className })`.
Każde SVG: `role="img"`, `aria-label` + `<title>`, `fill="currentColor"`, wysokość 28 px, szerokość z viewBox.
Bez `Logo` renderuje się nazwa w roli `title` 700 (legacy `.clients__word`).
Klasy `.cls-*` i `id` z oryginalnego InPost usunięte (inline `<style>` w SVG byłby globalny).
```tsx
<PartnerLogo partner={{ name: "Nowy klient" }} />   // tekstowy fallback
<InPostLogo className={styles.logo} />
```

---

## Molekuły (`src/components/molecules`)

Wszystkie są Server Components, poza `CopyEmail` i `FussSlider`.

### `NavList` — server-compatible (bez hooków)
```ts
interface NavListProps { items: readonly NavItem[]; pathname: string; ariaLabel: string; className?: string }
```
`aria-current="page"` przy dokładnej ścieżce, `"true"` gdy strona należy do sekcji linku (case study → Realizacje).
Eksport pomocniczy `getAriaCurrent(item, pathname)`. Dane: `src/content/navigation.ts`.

### `MetaRow` — server
```ts
interface MetaRowProps { name: ReactNode; meta: ReactNode; arrow?: boolean; className?: string }
```
Wiersz pod kaflem: nazwa | rok (+ strzałka reagująca na hover linku-przodka).
```tsx
<Link href="/otb" className={styles.tile}>… <MetaRow name="OTB Ventures" meta="2025" arrow /></Link>
```

### `TileCaption` — server
```ts
interface TileCaptionProps { children: ReactNode; as?: "figcaption" | "p"; tone?: "muted" | "ink"; className?: string }
```
Podpis mono 12 px, domyślnie `--muted` (legacy `.cs-cap`). `tone="ink"`: kolor tekstu sekcji (legacy `.screens figcaption`, `CaseScreens`).
```tsx
<figure>…<TileCaption>Grafika z ourmoney.pl.</TileCaption></figure>
```

### `FactRow` — server
```ts
interface FactRowProps { term: ReactNode; children: ReactNode; className?: string }
```
Jeden wiersz `<dt>/<dd>`; musi być w `<dl>`. Budulec faktów w hero case study, `SpecList` i `PersonCard`.

### `CopyEmail` — client
```ts
interface CopyEmailProps { email: string; copiedLabel?: string; statusMessage?: string; className?: string }
```
`pointer: fine` (`usePointerFine`): klik kopiuje, 1,8 s „Skopiowano ✓”, komunikat w `role="status"`.
Dotyk, SSR przed hydratacją i brak Clipboard API: zwykły `mailto:`. Adres zawsze z `site.contact.email`.
W `FindSection` (`findCopyClassName`) ikona „⧉” tylko przy `pointer: fine`, na dotyku „↗”.

### `SocialLinks` — server-compatible
```ts
interface SocialLinksProps { links: readonly SocialLink[]; ariaLabel: string; className?: string }
```
`<nav>` z `ScrambleLink`, linki w nowej karcie. Placeholdery (`href: null`) są pomijane; bez żadnego prawdziwego linku
komponent zwraca `null` (stopka bez „Social”, karta Magdy bez linków). Patrz [Linki-placeholdery](#linki-placeholdery).

### `ContactCta` — server
```ts
interface ContactCtaProps { index?: number; note?: boolean; className?: string }
const CONTACT_CTA_LABELS: { primary: "Porozmawiajmy →"; calendar: "Umów rozmowę ↗" };
```
Dwa `Button`: accent „Porozmawiajmy →” → `#kontakt` (stopka) i ghost „Umów rozmowę ↗” → `site.contact.calendarUrl`
(nowa karta; `null` → link-placeholder). `note` dokłada `site.contact.responseNote` (mono-sm, `--muted`), ale nie gdy to
placeholder `[…]`. `index` = `.fade` + `--i` (reveal z rodzicem). Przyciski zawijają się (odstęp 8 px). Dane tylko z `site.contact`.
```tsx
<ContactCta index={4} />            {/* hero, pod h1 i leadem */}
<Reveal><ContactCta index={0} note /></Reveal>  {/* pod listą usług */}
{/* case study: blok CTA w `CaseStudyLayout` (ContactCta index={2} note), strony go nie składają */}
```

### `FussSlider` — client
```ts
interface FussSliderProps {
  onValueChange: (value: number) => void; // 0–1
  defaultValue?: number;                  // 0–100, domyślnie 0
  label?: string;                         // domyślnie "Zamieszanie"
  hint?: string;                          // opis sr-only przez aria-describedby
  className?: string; style?: CSSProperties;
}
```
`<label for>` powiązany przez `useId`, `aria-valuetext="37%"`, odczyt `037%`, `data-no-stickers`.
Tor 2 px (`--ink` na 40%), uchwyt-romb w akcencie z obrysem `--dark`.
```tsx
<FussSlider onValueChange={fuss.set} hint="…" />
```

### `PhoneFrame` — server
```ts
type PhoneFrameProps =
  | { image: Required<CaseStudyImage>; sizes: string; className?: string }   // zrzut w next/image
  | { children: ReactNode; className?: string };                            // własny ekran w HTML
```
Makieta iPhone'a (legacy `.device.iph`): ciemny korpus, dynamic island, przycisk boczny. Renderuje `<div>` (może zawierać blokowy ekran).
Jedna makieta dla wszystkich case'ów: `CaseStage`, `CaseScreens`, `PhoneScroller`, `JournalScreen`, strony OurMoney i Sassy.
Zaokrąglenia korpusu i ekranu to ilustracja sprzętu (patrz [wyjątki](#wyjątki-od-zero-radius)). Ekran HTML w `children`
powtarza promień ekranu `10.5% / 5%` (`PhoneScroller`, `JournalScreen`).
```tsx
<PhoneFrame image={ourmoneyImages.home} sizes="320px" />
<PhoneFrame><div className={styles.screen}>…</div></PhoneFrame>
```

### `CaseProse` / `CaseBigLine` — server
```ts
interface CaseProseProps {
  lines: readonly ReactNode[];      // <h2> z reveal linii
  variant?: "h2" | "quote";         // quote = legacy .cs-quote (display, bez wersalików), nadal <h2>
  paragraphs?: readonly ReactNode[];// legacy .cs-p (lead, 44ch)
  paragraphIndex?: number;          // --i pierwszego akapitu: 2 w split (domyślnie), 3 w wide
  spaced?: boolean;                 // 32 px pod ostatnim akapitem (gdy pod spodem grafika)
  children?: ReactNode;             // treść pod akapitami
}
interface CaseBigLineProps { children: ReactNode; reveal?: "fade" | "line"; index?: number; className?: string } // legacy .bigline
```
Nagłówek sekcji case study + akapity (legacy `.cs-txt` / `.cs-wide`). Składa `Heading`; do `CaseStudySection` (`text` w split, `children` w wide).
```tsx
<CaseStudySection layout="split" label="03.1 / Ekran główny"
  text={<CaseProse lines={["Bez salda"]} paragraphs={["…"]} />} visual={…} />
```

### `PersonCard` — server
```ts
interface PersonCardProps {
  id?: string;                  // kotwica; dla osób = Person["id"] → zgodne z @id Person w JSON-LD (/o-nas#magda)
  name: string; code: string;   // „P1”…
  photo: ReactNode;
  roles: readonly string[]; bio: string;
  facts: readonly AboutFact[];  // text | links (wewnętrzne) | meter („Zamieszanie 0%”)
  social?: readonly SocialLink[];               // → SocialLinks
  internalLinks?: readonly AboutInternalLink[]; // zamiast social (karta agentów AI)
  linksLabel: string; variant?: "person" | "ai"; className?: string;
}
```
Legacy `.sheet`: obrys 1 px (`box-shadow inset`), `dl` mono z `FactRow` (układ dt | dd w jednym wierszu),
wskaźnik „Zamieszanie” wypełnia się do `--v`, gdy przodek dostanie `is-in`. Siatka 6 kolumn: < 900 px wszystko w kolumnie,
900–1199 px zdjęcie z lewej (2/6), ≥ 1200 px karta pionowa ze zdjęciem 4:3. Karta nie zawiera `Reveal` — owija ją `TeamSheets`.

### `WorkTile` — server
```ts
interface WorkTileProps { tile: WorkTile; sizes: string; index?: number; className?: string }
```
`next/link` → tag w prawym górnym rogu → okładka (`.fade`, maska, `aspect-ratio` 16/10 lub 1/1, `next/image` z `object-fit: cover`,
hover/focus: `scale: 1.03`) → `MetaRow name={title} meta={years} arrow`. `sizes` ustawia rodzic (szerokość w siatce);
telefony dostają ~28% tej wartości. Okładka z `screens`: `role="img"` + `aria-label={cover.alt}`, obrazy `alt=""`,
własny mockup iPhone'a 1:1 z legacy `.iph` (hover rozsuwa telefony; CSS zduplikowany z `PhoneFrame`). Placement w siatce robi rodzic.
```tsx
<WorkTile tile={tile} sizes={SIZES[tile.size]} index={second ? 1 : undefined} />
```

### `TestimonialCard` — server
```ts
interface TestimonialCardProps { testimonial: Testimonial; index?: number; className?: string }
testimonialCardClassName(testimonial, className?) // klasy kafla dla <figure>
```
Renderuje fragment: cudzysłów (`aria-hidden`, `--t-display`, akcent) + `<blockquote>` (`--t-title`) + `<figcaption>` (mono-sm,
awatar 44×44 w paski, rola w `<small>` z opacity .64). `accent: true` → kafel limonkowy (tekst `--on-accent`, awatar `#101318`).
```tsx
<Reveal as="figure" className={testimonialCardClassName(t)}><TestimonialCard testimonial={t} /></Reveal>
```

### Linki-placeholdery

Placeholdery nie są klikalnymi linkami (bez `href="#"`, bez skoku na górę, poza kolejnością Tab). `href: null` w danych →

| Gdzie | Zachowanie |
|---|---|
| `SocialLinks` (stopka, karty osób) | link **pomijany**; bez żadnego prawdziwego → brak `<nav>` (lista równorzędnych profili, brakujący nic nie wnosi) |
| wiersze `FindSection` (`/o-nas#social`, `#posty`) | `<span>` z klasą wiersza, opacity .5, bez hovera, sr-only „(wkrótce)” (układ sekcji zostaje) |
| `Button` / `ContactCta` („Umów rozmowę ↗” przy `calendarUrl: null`) | `<span>` z wyglądem przycisku, opacity .5, sr-only „(wkrótce)” |

Tekstowe placeholdery `[…]` się nie renderują (dane zostają w plikach do podmiany). Helpery: `isPlaceholder()`
(cały tekst w nawiasach / `#`) i `hasPlaceholder()` (`[…]` także w środku zdania) z `site.ts`; filtry danych:

| Helper | Gdzie | Co |
|---|---|---|
| `publishedTestimonials()` | `home.ts` | opinie; pusto → brak sekcji i `Review` |
| `publishedFaq()` | `faq.ts` | FAQ i `FAQPage` |
| `publishedNumbers(items)` + `MIN_CASE_NUMBERS` (2) | `cases/index.ts` | „W liczbach”; mniej niż 2 → strona nie renderuje `CaseStrip` |
| `publishedSpec(items)` | `cases/index.ts` | wiersze `SpecList` (OTB „Kod”) |
| `publishedFacts(facts)` | `about.ts` | wiersze kart postaci (`[…]` wycinane, pusty wiersz znika) |
| `publishedLinkedinPosts()` | `about.ts` | `#posty`; bez wiersza z prawdziwym linkiem → `null`, sekcji nie ma |

Wyjątek: `site.contact.email` (do podmiany przed startem).
Helper dla prawdziwych adresów: `externalLinkProps(href)` z `@/lib/href` (`target="_blank" rel="noopener"`).
`ScrambleLink` i `SmoothScroll` nadal obsługują `aria-disabled="true"` (dla linków spoza danych).

---

## Organizmy (`src/components/organisms`)

### Chrome (`app/layout.tsx`)

Montowany w layoucie. Strony go nie renderują.

| Komponent | Typ | Rola |
|---|---|---|
| `Preloader` | client | pasek 110×4 po `document.fonts.ready`, min. 600 ms / max. 1200 ms, kurtyna 1 s, `markIntroDone()`; tylko pierwsze wejście (root layout, przy nawigacji klienckiej się nie pokazuje; po `isIntroDone()` od razu znika); reduced motion → od razu; bez JS chowa go `<noscript>` w layoucie |
| `Hud` | client | logo, nav (`<header>`, `<nav aria-label="Główna">`), postęp scrolla. Fokus: biały obrys 2 px (odwraca się w `difference`). Poniżej 480 px nav w `--t-mono-sm` z odstępem 8 px, na < ~340 px nav zawija się pod logo |
| `GridOverlay` | client | 3 piony + 2 poziomy z krzyżykami, `mix-blend-mode: difference` |
| `Cursor` | client | strzałka (lerp 0.18) + naklejki; tylko `pointer: fine`, off przy reduced motion. Jeden SVG 88 px (punkt wskaźnika w środku), stan w `data-state` bez re-renderów: `arrow`; `link` nad `a[href], button, [role="button"], label, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])` (bez `:disabled`) → limonkowy pierścień; `grab` nad `[data-cursor="grab"]` (ma pierwszeństwo; track `FilmStrip`, kula `DragBall`, naklejka `StickerBoard`) → mała kropka, `data-pressed` przy wciśnięciu ją ściska. Opt-out `[data-cursor="arrow"]` (kafle `ProcessSteps`: fokusowalne, nieklikalne) wymusza strzałkę. `help` nad `[data-cursor="help"]` (`summary` w `FaqSection`) → pełny limonkowy krążek z „?”, przy `details[open]` z „−” (`data-open`, odświeża się przy ruchu); `calendar` nad `[data-cursor="calendar"]` (`Button` „Umów rozmowę ↗” w `ContactCta` i `Footer`) → krążek z ikoną kalendarza; wciśnięcie ściska oba do 0.8 jak `link`. Wartości `data-cursor`: `arrow` \| `grab` \| `help` \| `calendar`; kolejność detekcji (`closest`): arrow → grab → help → calendar → link. Śledzi `pointermove` (działa też przy `preventDefault` na `pointerdown`). Nad `[data-native-cursor]` (żywa ramka `LiveFrame`, ekran `PhoneScroller`) i po wejściu do `iframe` / wyjściu z okna chowa się, zostaje kursor systemowy. Reguła w `globals.css`: `html[data-cursor="on"] :not([data-native-cursor], [data-native-cursor] *) { cursor: none !important }`, więc `cursor:` w modułach nie przebija się; element z `data-native-cursor` musi sam ustawić `cursor` (`auto` albo własny) |
| `SmoothScroll` | client | Lenis (lerp 0.1), stop do końca preloadera, kotwice, reset przy zmianie route |
| `Footer` | server | `#kontakt` (cel „Porozmawiajmy →”), CTA display, „Umów rozmowę ↗” + `responseNote`, `CopyEmail`, `SocialLinks`, copyright |
| `Reveal` | client | wrapper `data-reveal` |

### `Reveal` — client
```ts
interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "figure" | "ul" | "ol" | "li" | "p" | "span" | "dl";
  trigger?: "view" | "intro"; // view: IntersectionObserver (0.15, raz); intro: po preloaderze (hero)
}
```
```tsx
<Reveal as="section" className="section tone-dark" id="realizacje">
  <MonoLabel className="fade">Produkty i realizacje</MonoLabel>
  <Heading variant="h2" lines={["Co robimy"]} startIndex={1} />
</Reveal>

{/* hero każdej strony */}
<Reveal as="section" trigger="intro" id="hero" className="above-grid …" data-stickers="">
  <GlowBackdrop /><StickerLayer />
  <Heading as="h1" variant="display" lines={["Budujemy", "produkty bez", "zamieszania"]} />
</Reveal>
```

### `SmoothScroll` / `useLenis`
`useLenis(): Lenis | null` (client) i `getLenis()` (poza Reactem). Zawsze obsłuż `null` (reduced motion).
Kontener z własnym scrollem (np. przewijany telefon) oznacz `data-lenis-prevent`.

---

### Hero i scena 3D

Źródła: `legacy/no-fuss-v5.html` (hero, „Obiekt 3D w hero”), `legacy/404.html`.

| Plik | Typ | Rola |
|---|---|---|
| `HeroScene/createScene.ts` | moduł (three) | cała scena imperatywnie: renderer, materiał, pętla z pauzą, `dispose()` |
| `HeroScene/physics.ts` | moduł (bez three/DOM) | fizyka liter 1:1 z legacy (`stepWorld`) + akumulator stałego kroku (`FixedStepper`) |
| `HeroScene/legacyRoomEnvironment.ts` | moduł (three) | `RoomEnvironment` z r160 w wariancie legacy (światło 5, nie 900) |
| `HeroScene/HeroScene.tsx` | client, default export | kanwa + montaż sceny od razu po hydratacji; **nie importuj bezpośrednio** |
| `HeroScene/LazyHeroScene.tsx` | client | `next/dynamic(() => import("./HeroScene"), { ssr: false })` |
| `HeroScene/fussStore.ts` | moduł | `createFussStore(initial)` — kanał zamieszania bez re-renderów |
| `HeroScene/types.ts` | typy | `FussStore`, `SceneFit`, `SceneRepel`, `HeroSceneProps` |
| `HomeHero/HomeHero.tsx` | server, default export, bez propsów | `<section id="hero">` strony głównej |
| `HomeHero/HomeHeroStage.tsx` | client | scena + fallback + suwak, sloty na serwerową treść (`headline` = h1 + lead + `ContactCta`, `top`, `sceneLabel`, `sceneClassName`) |
| `NotFoundHero/` | server + `NotFoundStage` (client) | hero 404, bez propsów |

Barrel `organisms/HeroScene/index.ts` (i barrel warstwy) eksportuje tylko `LazyHeroScene`, `createFussStore` i typy:
statyczny import `HeroScene.tsx` wciągnąłby three.js do bundla strony.

#### `LazyHeroScene` — client
```ts
interface HeroSceneProps {
  text: string;                 // "no–fuss" (półpauza U+2013) albo "404"
  fuss: FussStore;              // wartość początkowa sklepu = zamieszanie na starcie
  fit?: SceneFit;               // domyślnie hero strony głównej
  repel?: SceneRepel | false;   // domyślnie { radius: 1.2, strength: 60 } (legacy)
  className?: string;
  onUnsupported?: () => void;   // brak WebGL albo fontu → rodzic pokazuje fallback CSS
}
interface SceneFit { widthDesktop; widthMobile; maxScale; offsetYDesktop; offsetYMobile } // próg 768 px
```

| | widthDesktop | widthMobile | maxScale | offsetYDesktop | offsetYMobile | start fuss |
|---|---|---|---|---|---|---|
| hero `/` | 0.62 | 0.86 | 1.4 | 0.02 | 0.12 | 0 |
| 404 | 0.5 | 0.7 | 1.0 | 0.1 | 0.16 | 1 |

```tsx
"use client";
const [fuss] = useState(() => createFussStore(0));
<LazyHeroScene text="no–fuss" fuss={fuss} onUnsupported={() => setUnsupported(true)} />
<FussSlider onValueChange={fuss.set} hint="…" />
// 404: createFussStore(1), przycisk woła fuss.set(0)
```
Rodzic kanwy musi mieć `position: relative` (kanwa: `absolute; inset: 0; z-index: 0`). Jedna scena na stronę.

#### Decyzje sceny
- **Start jak legacy:** scena powstaje od razu po hydratacji (pod preloaderem), bez wejścia `opacity`; po zjeździe
  kurtyny litery już stoją. Budowa geometrii i kompilacja shaderów nie trafia na animację kurtyny.
- **LCP:** h1 i copy renderuje serwer; three.js jest w osobnym chunku ładowanym po hydratacji.
- **Suwak → scena:** mutowalny sklep; scena czyta `fuss.get()` w każdym kroku (wartość suwaka / 100, bez krzywej).
  Wygładzanie wyłącznie w scenie (lerp 0.12 na krok, jak legacy). 404: „Posprzątaj” ustawia 0 od razu, licznik 1100 ms.
- **Pętla:** działa tylko gdy kanwa jest w viewporcie (`IntersectionObserver`) i karta widoczna (`visibilitychange`);
  po wznowieniu akumulator jest zerowany (bez skoku). `ResizeObserver` na kanwie; pixel ratio ≤ 2.
- **Krok czasu (1:1 z legacy):** legacy wołał `getElapsedTime()` a potem `getDelta()` → delta 0 → `|| .016`, czyli stałe
  dt = 0.016 na klatkę i lerpy 0.12 / 0.05 na klatkę. Port: 60 kroków/s (`FixedStepper`, tolerancja drgań rAF 25%),
  każdy z dt = 0.016; czas drgań `t = kroki / 60`. Przy 60 Hz jeden krok na klatkę (poza strefą kursora i spokoju
  wynik bitowo równy legacy); przy 120 Hz rysowanie co drugą klatkę, tempo jak legacy na 60 Hz.
- **Stabilność pod kursorem (świadome odejście od legacy):** legacy przy zamieszaniu < 1% teleportował literę do domu,
  gdy |v| < 0.05, także gdy kursor ją odpychał; kursor stojący nad napisem dawał cykl odepchnięcie → teleport
  („ścinki”), a sprężyna (ζ ≈ 0.3) i tak oscylowała. W `physics.ts`: odpychanie działa wzdłuż prostej kursor → cel
  sprężyny (jeden punkt stały, bez ujemnej sztywności w poprzek), w strefie ≤ 1.25 × promień odpychania i przy
  zamieszaniu < 0.05 tłumienie jest dokładane do krytycznego osobno dla każdego modu, a dosunięcie do domu następuje
  tylko bez odpychania, ≤ 0.002 od domu. Efekt: kursor nieruchomo nad napisem = litery odsunięte i nieruchome
  (po 1.5 s |v| < 0.001), bez skoków; po odjeździe kursora płynny powrót. Dalej od kursora i przy zamieszaniu ≥ 0.05
  fizyka jest bitowo równa legacy (rozrzut, drgania, kolizje).
- **Wskaźnik (jak legacy):** `mousemove` na `window`, `clientX / innerWidth − 0.5`; start 0 = środek ekranu, więc
  odpychanie działa od pierwszej klatki. Dotyk: tylko emulowany `mousemove` po tapnięciu (jak legacy).
- **Reduced motion (jak legacy):** bez drgań, obrotu, „oddechu” i odpychania; suwak nadal rozrzuca litery (akcja użytkownika).
- **Fallback:** wyjątek WebGL albo błąd fontu → napis CSS z gradientem (legacy `.hero__fallback`), suwak ukryty.
- **Ekspozycja 0.8:** legacy ustawiał 1.15, ale `applyTheme()` natychmiast nadpisywał na 0.8 (efektywnie 0.8).
- **Środowisko (r160 → r186):** legacy wołał `new RoomEnvironment()` bez renderera, co w r160 dawało światło główne 5
  zamiast 900 (ciemny pokój, jasne panele → kontrastowe odbicia). r186 ma zawsze 900 i pokój przesunięty o y −3.5,
  więc używamy kopii z r160 (`LegacyRoomEnvironment`).
- **Sprzątanie:** geometrie, materiał, env map, PMREM, `RoomEnvironment`, renderer, obserwatory, listenery. Font cache'owany w module.
- **Warstwy:** tło, kanwa i naklejki `z-index: 0` pod siatką (1), treść `z-index: 2`; stąd sloty w `HomeHeroStage`.
- **Dostępność:** kanwa `aria-hidden`; na `/` `VisuallyHidden` „W tle trójwymiarowy napis no–fuss.” (nowe zdanie);
  na 404 `h1.sr-only` 1:1 z legacy, tekst `aria-live="polite"`. „Wróć na stronę główną →” (accent) widoczny od początku,
  obok „Posprzątaj ↓” (ghost) i „Realizacje”; po „Posprzątaj” przycisk znika, a fokus idzie na „Wróć na stronę główną →”.
- **Nagłówki `/`:** rola „Design & Development” to `<p>` w kroju `--t-title` (legacy: `h2` przed `h1`), jedyny `h1` to hasło.
- **Hero `/` pod usługi:** pod h1 lead (`hero.lead` z `home.ts`, `--t-lead`) i `ContactCta`. Kolejność DOM: h1, lead, CTA,
  rola z akapitami, suwak. Telefon / tablet (< 1024 px): pierwszy wiersz siatki ma min. `100svh − 2 × --section-y`
  (h1 + lead + CTA dosunięte do dołu pierwszego ekranu), rola, akapity i suwak pod nim; kanwa ograniczona do
  `min(100%, 100svh)` (`.hero .scene`). Hero ma `min-height`, nie stałą wysokość (treść nie jest obcinana).
  Desktop: układ legacy (rola u góry, h1 + lead + CTA na dole 1/span 8, suwak 9/span 4).
- **Tytuł 404:** `not-found.tsx` nie obsługuje `metadata`; eksperymentalny `global-not-found.js` omija root layout.
  Zostaje domyślny tytuł „NO-FUSS©2026”, Next sam dodaje `noindex`.

---

### Strona główna

Źródło: `legacy/no-fuss-v5.html` (+ nowe sekcje „Jak pracujemy” i FAQ spoza legacy). Server Components, reveal przez `Reveal`.
Sekcje z legacy są bez propsów (dane z `src/content/home.ts`); `ProcessSection` i `FaqSection` dostają dane z propsów
(`src/content/process.ts`, `src/content/faq.ts`) w `app/page.tsx`.
Kolejność pod klientów usługowych (zmiana wobec legacy): `HomeHero` → `ServicesList` → `ProcessSection` → `WorkGrid` →
`AboutSection` → `TestimonialsSection` → `FaqSection` → stopka (layout).

| Komponent | Sekcja (kotwica) | Tonacja | Nagłówek | Reveal |
|---|---|---|---|---|
| `HomeHero` | `section#hero` | ciemna | `h1` display | `trigger="intro"` |
| `ServicesList` | `section#uslugi` | jasna | `h2` mono „Co robimy” (licznik „01–05”), usługi w `h3` | nagłówek + każdy wiersz `li` + `ContactCta` pod listą (od 1024 px od kolumny 4) |
| `ProcessSection` | `section#proces.tone-light` | jasna (kafle ciemne) | `h2` mono „Jak pracujemy” (licznik „01–04”), kroki w `h3` | nagłówek + `ol` (kafle `.fade` ze staggerem `--i`) |
| `WorkGrid` | `section#realizacje.tone-dark` | ciemna | `h2` mono „Produkty i realizacje” (licznik „01–06”) | nagłówek + każdy kafel osobno (`li`) |
| `AboutSection` | `section#o-nas`, siatka 12 | jasna | `h2` sr-only „O nas” | cała sekcja; zdjęcie `.fade`, statement liniami 0–2, drugi statement `--i:4`, logotypy `--i:5` |
| `TestimonialsSection` | `section#opinie.tone-dark` | ciemna | `h2` mono „Co mówią klienci” | nagłówek + każdy `figure`; **zwraca `null`**, gdy `publishedTestimonials()` jest puste (teraz: same placeholdery) |
| `FaqSection` | `section#faq.tone-light` | jasna | `h2` mono „Częste pytania” (licznik z liczby pytań), pytania w `h3` w `summary` | nagłówek + każdy wiersz + zdanie i `ContactCta` pod listą; **zwraca `null`** przy pustej liście |
| `Footer` (layout) | `footer#kontakt` | ciemna | display CTA | `Reveal` |

Rytm tonacji: nie da się przeplatać wszystkich par. Usługi i proces są obie jasne (proces między jasnymi usługami
a ciemnymi realizacjami, każda tonacja da dwie takie same obok siebie); proces odróżniają ciemne kafle.
Dopóki opinie są ukryte, „O nas” i FAQ też są jasne obok siebie; z opiniami rytm FAQ jest poprawny (ciemna → jasna → stopka ciemna).

Wszystkie sekcje mają `aria-labelledby`. Jedyny `h1` jest w `HomeHero`.

Siatka realizacji (od 768 px, 1:1 z legacy): `xl` 5/span 8 · `l` span 5, `l + l` 7/span 5 · `m` 6/span 3, `m + m` 10/span 3 ·
`s` span 3, `s.off` 5/span 3, `s.off2` 9/span 3. Poniżej 768 px wszystko 1/-1. Odstęp 56 px pion / 8 px poziom.
Kafle: OurMoney `xl` · AION MIND + Busy Bee `l + l` · OTB + Automation House `m + m` · Sassy `s` na końcu (tag „Eksperyment” z case'u).
Opinie (od 900 px): 1/span 7, 8/span 5, 4/span 6. Usługi (od 1024 px): numer span 1, nazwa 4/span 4, opis 9/span 4.
Tekst sekcji o nas: zdjęcie 1/span 4 + tekst 6/span 7 (640 px), 1/span 3 + 5/span 8 (1024 px).
Proces: kafle 1 kolumna → 2 (640 px) → 4 (1024 px). FAQ jak usługi (od 1024 px): numer span 1, pytanie 4/span 8, „+” w 12, odpowiedź 4/span 7.

#### `ProcessSection` — server
```ts
interface ProcessSectionProps {
  id: string;                     // kotwica; nagłówek dostaje `${id}-heading` (aria-labelledby)
  label: string; counter?: string;
  steps: readonly { no: string; title: string; text: string }[];   // ProcessSectionStep z @/content/process
  tone?: "light" | "dark";        // domyślnie light
  className?: string;
}
```
Ogólny proces współpracy (strona główna). Kafle mają `.tone-dark` (tło `--bg` = `--dark`, biały tekst, czytelne `--muted`),
numer w roli display, tytuł `h3` w roli title, opis zawsze widoczny. Nic nie jest fokusowalne, brak hovera.
Nie myl z `ProcessSteps` (case Automation House: 5 kroków, opis na hover / `:focus-within`, `tabIndex=0`); jego kontrakt bez zmian.
```tsx
<ProcessSection id="proces" label={processSection.label} counter={processSection.counter} steps={processSection.steps} />
```

#### `FaqSection` — server
```ts
interface FaqSectionProps {
  id: string;                     // kotwica; nagłówek `${id}-heading`
  label: string;
  items: readonly FaqItem[];      // już przefiltrowane: publishedFaq()
  more?: string;                  // zdanie nad CTA
  cta?: boolean;                  // ContactCta pod listą, domyślnie true
  tone?: "light" | "dark";
  className?: string;
}
```
Natywne `<details>/<summary>` (zero JS, Tab + Enter/Spacja): numer mono (`aria-hidden`), pytanie w `h3` (`--t-title`),
„+” w mono obracany do „×” przy `[open]` (off przy reduced motion). Wiersze z obrysem 1 px (`--ink` 18%) jak w `ServicesList`,
hover limonkowy z wcięciem 12 px jak w `FindSection`, fokus: obrys 2 px `--ink`. Licznik liczony z długości listy.
Pytania z placeholderem `[…]` odfiltrowuje `publishedFaq()` (i w UI, i w JSON-LD `FAQPage`).

---

### Podstrona `/o-nas`

Źródło: `legacy/o-nas-v5.html`. Kolejność: `TeamHero` → `TeamSheets` → `Marquee` → `RolesSplit` → `FindSection #social` →
`FindSection #posty` → `StickerBoard #play`. Klienckie są tylko `Reveal`, `CopyEmail`, `ScrambleLink` (w `SocialLinks`) i `DragSticker`.

#### `TeamHero` / `TeamSheets` / `RolesSplit` / `StickerBoard` — server, bez propsów
- `TeamHero` (legacy `.team-hero`): `Reveal trigger="intro"`, `<h1>` display w 3 liniach + lead statement. Jasne tło.
- `TeamSheets` (legacy `.sheets`): ciemny pas (`--dark`), karty `--shade-900`: Magda i Kuba z `people`, trzecia karta agentów AI. Każda karta w osobnym `Reveal`.
  Zdjęcie: gdy `personCards[id].photo` istnieje (dziś tylko Kuba), `next/image` z klasą `.photo` (`object-fit: cover`, `object-position: 50% 10%`,
  `sizes="(min-width: 1200px) 33vw, (min-width: 900px) 17vw, 100vw"`, bez `priority`); inaczej `PhotoPlaceholder` z `photoLabel`.
- `RolesSplit` („Kto co robi”): każdy wiersz to `Reveal` ze `style={{ "--v": "92%" }}`; romb (18 px, obrót 45°) jedzie od 50% do `--v`
  po `is-in`. Legenda z `people[].givenName`. Nagłówek to `<h2>` w mono.
- `StickerBoard` (`#play`): 6 naklejek z `STICKERS` na pozycjach z legacy, każda to `DragSticker`. Zdjęcia: Magda placeholder,
  Kuba `next/image` z `personCards.kuba.photo` (3:4 `cover`, `draggable={false}`, `pointer-events: none`; naklejki `z-index: 3` nad nim).

#### `Marquee` — server (CSS)
```ts
interface MarqueeProps { items: readonly string[]; copies?: number /* 4 */; className?: string }
```
Pętla 22 s (`translate -50%`). Pierwsza kopia czytelna, kolejne `aria-hidden`, „✦” zawsze `aria-hidden`. Stoi przy reduced motion.
```tsx
<Marquee items={marqueeItems} />
```

#### `FindSection` — server
```ts
interface FindSectionProps {
  id: string; label: string; title: string; lead: string; note?: string;
  ariaLabel: string; items: readonly FindItem[];
  extra?: ReactNode;          // np. CopyEmail z klasą findCopyClassName (dokleja „⧉”)
  tone?: "light" | "dark";
}
```
Legacy `.find`: nagłówek (sticky ≥ 1024 px) + lista wierszy z hoverem limonkowym. Linki przez `externalLinkProps` (placeholdery: [Linki-placeholdery](#linki-placeholdery)).
```tsx
<FindSection {...findUs} extra={<CopyEmail email={site.email} className={findCopyClassName} />} />
<FindSection {...linkedinPosts} tone="dark" />
```

#### `DragSticker` — client
```ts
interface DragStickerProps { svg: string; left: number; top: number; size: number; rotate: number; label: string; describedBy?: string }
```
- Pointer Events z `setPointerCapture` (mysz, dotyk, pióro); `touch-action: none` na naklejce, `pan-y` na sekcji.
- Klawiatura: `tabIndex=0`, strzałki o 16 px (przycięte do planszy), `role="img"`, `aria-label` 1:1 z legacy, `aria-describedby` → ukryta instrukcja.
- Pozycja żyje w DOM (`left/top` w px), bez re-renderu na ruch. Reduced motion: bez przejść `scale`/`rotate`.
- Sekcja nie ma `data-stickers`, więc naklejki spod kursora tu nie działają.

---

### Case study

Źródła: `legacy/case-*.html`. Strony składają `CaseStudyLayout` + `CaseStudySection` z organizmami poniżej.
Produkty (`/ourmoney`, `/aion-mind`): warianty `wide` / `split`. Strony WWW (`/busy-bee`, `/automation-house`, `/otb`, `/sassy`): wariant `lite`.

| Komponent | Typ | Legacy | Gdzie |
|---|---|---|---|
| `CaseStage` | server | `.stage`, `.stage--img` | OurMoney, AION MIND |
| `CaseStrip` | server | `.section` + `.work__head` | OurMoney, AION MIND |
| `CaseScreens` | server | `.screens` | OurMoney |
| `CaseNumbers` + `CountUp` | server + client | `.nums`, `[data-count]` | OurMoney, AION MIND |
| `SplitCalculator` | client | `#calc` | OurMoney |
| `PairSubscription` | server | `.sub` | OurMoney |
| `TechStack` | server | `.stack` | OurMoney |
| `JournalScreen` | client | `#jr` | AION MIND |
| `GuideCards` | server | `.guides` | AION MIND |
| `RolePath` | server | `.path` | AION MIND |
| `LiveFrame` | client | `.live` | Busy Bee, AH, OTB, Sassy |
| `FilmStrip` | client | `.film` | Busy Bee |
| `PhoneScroller` | client | `.scrollphone` | Busy Bee, AH, OTB |
| `DragBall` | client | `.otb` | OTB |
| `ToySwitcher` | client | `.sw2` | Sassy |
| `SpecList` | server | `.spec`, `.facts` | Busy Bee, AH, OTB, Sassy |
| `ProcessSteps` | server | `.steps` | AH |
| `CaseStory` | server | — (nowy) | Busy Bee, AH, OTB, Sassy |

#### `CaseStage` — server
```ts
type CaseStageProps =
  | { variant: "phones"; images: readonly Required<CaseStudyImage>[]; className?: string }
  | { variant: "image"; image: Required<CaseStudyImage>; sizes?: string /* 100vw */;
      placement?: "standalone" | "inline"; index?: number; className?: string };
```
Limonkowa scena pod hero: trzy `PhoneFrame` wystające poza dolną krawędź albo jedna grafika. `standalone` ma własny `Reveal`,
`inline` to `.fade` w sekcji, która już ma `Reveal`.
```tsx
<CaseStage variant="phones" images={ourmoneyImages.stage} />
```

#### `CaseStrip` — server
```ts
interface CaseStripProps { label: string; aside: ReactNode; tone?: "light" | "dark"; id?: string; className?: string; children: ReactNode }
```
Sekcja pełnej szerokości: wiersz mono (etykieta `<h2>`, `aside` po prawej, 48 px odstępu), `Reveal` tylko na nagłówku,
`children` (zwykle organizm z własnym `Reveal`) pod spodem.
```tsx
<CaseStrip label="05 / W liczbach" aside="Stan: wrzesień 2026" tone="dark"><CaseNumbers items={ourmoneyNumbers} /></CaseStrip>
```

#### `CaseScreens` — server
```ts
interface CaseScreensProps { screens: readonly { image: Required<CaseStudyImage>; caption: string }[]; className?: string }
```
`<figure>` z `PhoneFrame` + `TileCaption tone="ink"`, 2 / 4 kolumny (900 px).

#### `CaseNumbers` — server, `CountUp` — client
```ts
interface CaseNumbersProps { items: readonly { value: number | string; label: string; accent?: boolean }[]; className?: string }
interface CountUpProps { end: number; duration?: number /* 1200 */ }
```
Komponent renderuje wszystko, co dostanie: strona podaje `publishedNumbers(items)` (bez `[…]`) i pomija cały `CaseStrip`, gdy zostaje mniej niż `MIN_CASE_NUMBERS`.
Liczby w `<ul>`; `CountUp` animuje 0 → `end` po wejściu w viewport (0.6). SSR i czytniki dostają `end`; reduced motion = bez animacji.

#### `SplitCalculator` — client
```ts
interface SplitCalculatorProps { className?: string }
```
Trzy modele (`role="group"`, przyciski `aria-pressed`), trzy suwaki z `<label htmlFor>`, `<output htmlFor>` i `aria-valuetext` („6 500 zł”),
wynik w `aria-live="polite" aria-atomic="true"`. Logika w `split.ts` (`computeSplit`, `formatZl`): najpierw zaokrąglony procent, potem kwota;
pasek 28–72%. `formatZl` grupuje tysiące zawsze, bo `toLocaleString("pl-PL")` daje „6500”.

#### `PairSubscription` / `TechStack` / `GuideCards` / `RolePath` — server
```ts
interface PairSubscriptionProps { className?: string }                                  // ilustracja „1 subskrypcja → dwie osoby”, role="img"
interface TechStackProps { groups: readonly { label: string; items: readonly string[] }[]; className?: string } // listy <ul>
interface GuideCardsProps { guides: readonly { name: string; role: string; image: Required<CaseStudyImage> }[]; className?: string } // nazwa <h3>, 2 / 5 kolumn
interface RolePathProps { stages: readonly { when: string; title: string; scope: string }[]; index?: number; className?: string }     // <ol>, tytuły <h3>
```

#### `JournalScreen` — client
```ts
interface JournalScreenProps { className?: string }
```
Rekonstrukcja ekranu Dziennika AION MIND (maj 2026) w `PhoneFrame`. Dane i arytmetyka dat w `journal.ts`, bez `toLocale*` (brak rozjazdu SSR/klient).
- Kalendarz: `role="grid"` → `row` → `columnheader` / `gridcell` (`aria-selected`) z przyciskiem dnia.
- Klawiatura: roving tabindex; ←/→ ±1 dzień, ↑/↓ ±7, Home/End tydzień (z Ctrl: siatka), Enter/Spacja/klik → „Tydzień N” (ISO 8601) w `aria-live`.
- Karty podsumowań: `aria-pressed`, komunikat w `role="status"` (toast 1,6 s).
- Paleta, zaokrąglenia i małe rozmiary px to ekran aplikacji (stałe z legacy, zmienne `--jr-*`), krój `var(--sans)`.

#### `LiveFrame` — client
```ts
interface LiveFrameProps {
  src: string; title: string; urlLabel: string;
  poster: Required<CaseStudyImage>;
  load?: "auto" | "click";   // auto: Busy Bee, AH; click: OTB, Sassy
  loadLabel?: string;        // domyślnie „Otwórz na żywo ↗”
  loadAriaLabel?: string;
  className?: string;
}
```
Limonkowa scena z ramką przeglądarki, własny `Reveal`; stawiaj zaraz pod hero. `iframe` 1440×900 skalowany `--s = szerokość / 1440`
(`ResizeObserver`), `loading="lazy"`, `referrerPolicy="no-referrer"`, `sandbox="allow-scripts allow-same-origin"`.
Pasek adresu (mono 12 px, `--t-mono-sm`) to link do strony w nowej karcie na całą wysokość paska 48 px (obszar dotyku).
Reduced motion, poniżej 768 px i `pointer: coarse`: nic nie ładuje się samo, niezależnie od `load`; poniżej 768 px przycisk
„Otwórz na żywo ↗” jest linkiem do strony w nowej karcie (zamiast ramki w skali ~0,25). SSR renderuje poster z przyciskiem,
tryb ustala się po hydratacji (bez mismatchu). Żywa ramka ma `data-native-cursor` (kursor systemowy, patrz `Cursor`).
```tsx
<LiveFrame {...otbLive} load="click" />
```

#### `FilmStrip` — client
```ts
interface FilmStripProps { frames: readonly { image: Required<CaseStudyImage>; title: string; meta: string }[]; ariaLabel: string; autoAdvanceMs?: number /* 3200 */; className?: string }
```
Taśma z perforacją, klatki `button[aria-pressed]` w `role="group"`. Mysz: przeciąganie (capture po 6 px). Dotyk: natywny scroll ze snapem.
Klawiatura: ← → Home End. Autoprzewijanie co 3,2 s w widoku (IO 0.4), pauza na hover / fokus / interakcję, off przy reduced motion.
Przycisk „Pauza” / „Wznów” (mono 12 px, prawy górny róg, zmienna etykieta bez `aria-pressed`, WCAG 2.2.2): pauza z przycisku jest trwała;
przycisk renderuje się tylko, gdy autoprzewijanie jest możliwe (bez reduced motion, ≥ 2 klatki, `autoAdvanceMs > 0`).
`data-lenis-prevent`; wyśrodkowanie przez `scrollTo` taśmy (bez przewijania strony).

#### `PhoneScroller` — client
```ts
interface PhoneScrollerProps { image: Required<CaseStudyImage>; label: string; className?: string }
```
`PhoneFrame` (szerokość `min(100%, 340px)`) z ekranem 640 px i własnym scrollem: `role="region"`, `tabIndex=0`, `data-lenis-prevent`,
↑ ↓ o 120 px. Zrzut `m-full.webp` jako `unoptimized` (11–16 tys. px). Po dojechaniu do końca gest przewija stronę.
`pointer: coarse`: ekran `min(640px, 56svh)`, makieta węższa w tej samej proporcji; ekran nie łapie scrolla (`data-locked`,
`overflow: hidden`), dopóki nie zostanie tapnięty (komunikat mono „Dotknij, aby przewijać”). Tap poza telefonem albo wyjazd
telefonu z widoku wyłącza tryb. Klawiatura działa zawsze. `pointer: fine` bez zmian; ekran ma `data-native-cursor` (`ns-resize`).

#### `DragBall` — client
```ts
interface DragBallProps { label: string; words: readonly [string, string]; caption: string; ballLabel: string; className?: string }
```
Rekonstrukcja hero otb.vc w DOM/CSS. Kula `role="slider"`, Pointer Events z capture, strzałki (Shift = większy krok). Gradient idzie za kulą.
`touch-action: none` tylko na kuli.

#### `ToySwitcher` — client
```ts
interface ToySwitcherProps { toys: readonly { name: string; tag: string; caption: string; image: Required<CaseStudyImage> }[]; ariaLabel: string; className?: string }
```
Wzorzec ARIA tabs: `tablist` (vertical) + `tab` z roving tabindex + jeden `tabpanel` (`<figure>` z `TileCaption`). ↑ ↓ ← → Home End.
Przenikanie obrazów 0.5 s (bez przy reduced motion).

#### `SpecList` — server
```ts
interface SpecListProps { items: readonly { term: string; value: string; chip?: string; href?: string }[]; variant?: "rows" | "tiles"; className?: string }
```
`<dl>` z `FactRow`. `rows` = legacy `.spec` (wielkie wiersze), `tiles` = legacy `.facts` (Sassy). Stagger przez `nth-child`; musi być w `Reveal`.

#### `ProcessSteps` — server
```ts
interface ProcessStepsProps { steps: readonly { title: string; text: string }[]; ariaLabel?: string; className?: string }
```
`<ol>` z licznikiem 01–05; opis rozwija się na hover i `:focus-within` (krok ma `tabIndex=0`). Bez hovera opisy widoczne od razu.

#### `CaseStory` — server
```ts
interface CaseStoryProps { story: CaseStudyStory; index?: number /* domyślnie 2 */; className?: string }
const CASE_STORY_TERMS: { done: "Co zrobiliśmy"; effect: "Efekt" };
```
Narracja case'u strony WWW: `<dl class="mono">` (w `Fade`) z trzema `FactRow`: `story.problemTerm` („Problem” tylko,
gdy problem wynika z danych; inaczej „Zadanie” = brief), „Co zrobiliśmy”, „Efekt”. Termin mono, wartość w roli `lead`;
od 1024 px trzy kolumny. Zawsze pierwsza sekcja po `LiveFrame`: `CaseStudySection layout="lite" label="01 / W skrócie"`
(kolejne sekcje przenumerowane, tonacja dobrana tak, żeby sekcje dalej się przeplatały). Treść w `cases/<slug>.ts` → `story`.

#### Odstępstwa od legacy (case studies stron)
- Ramka przeglądarki, kropki i pasek adresu bez zaokrągleń i bez cienia; kolory chrome z tokenów.
- Pole kuli OTB bez `border-radius: 6px`; `touch-action: none` tylko na kuli (legacy blokowało przewijanie palcem po całym polu).
- Napisy „Open to / beyond”: `--t-display` w wadze 400 zamiast `clamp(2rem, 6.5cqw, 6rem)` z niezaładowanym TWKEverett.
- Taśma: wyśrodkowanie bez `scrollIntoView` (legacy szarpało stroną), pauza na hover / fokus.

---

## Szablony (`src/components/templates`)

### `CaseStudyLayout` + `CaseStudySection` — server
```ts
interface CaseStudyLayoutProps {
  hero: {
    kicker: string; title: string; lead?: ReactNode;
    summary: CaseStudySummary;              // fakty standardowe, zawsze pierwsze
    facts: readonly CaseStudyFact[];        // dodatkowe fakty po standardowych
    datePublished?: string;
  };
  children: ReactNode;
  cta?: { tone?: "light" | "dark" /* domyślnie dark */; title?: string; text?: string };
  next?: { href: string; title: string; arrow?: "→" | "↗" };
}
const CASE_SUMMARY_TERMS: { role: "Rola no-fuss"; scope: "Zakres"; time: "Czas"; client: "Klient"; result: "Wynik" };
const CASE_CTA_COPY: { title: "Chcesz podobny projekt?"; text: "Opowiedz, co chcesz zbudować, a powiemy, od czego zacząć." };
function caseHeroFacts(summary: CaseStudySummary, facts: readonly CaseStudyFact[]): CaseStudyFact[];
type CaseStudySectionProps =
  | { label: string; tone?: "light" | "dark"; id?; className?; layout?: "wide"; children: ReactNode }
  | { label: string; tone?: "light" | "dark"; id?; className?; layout: "split"; text: ReactNode; visual: ReactNode; flip?: boolean }
  | { label: string; tone?: "light" | "dark"; id?; className?; layout: "lite"; hint?: ReactNode; bleed?: boolean; children: ReactNode };
```
Hero: kicker to `<p class="mono">` z chipem „Case study”, tytuł `h1` mega, lead statement, fakty w `<dl>` (`FactRow`, mono-sm).

**Fakty hero** (`caseHeroFacts`): najpierw standardowe z `summary` w stałej kolejności „Rola no-fuss” → „Zakres” →
„Czas” → „Klient” (jeśli `client`) → „Wynik” (jeśli `result`, może mieć `href`), potem `facts`. Wiersz z `facts` o terminie
standardowym jest pomijany (bez dublowania). Brak danych = brak wiersza, nigdy placeholder. „Rola no-fuss” mówi uczciwie,
co zrobiło studio, z nazwiskami osób spoza no-fuss (Busy Bee: kod Michał Gabryelewicz; OTB: design z Piotrem Chuchłą;
AION MIND: „—”, bo to etat Magdy). „Wynik” tylko jako fakt (działająca strona), bez liczb spoza danych.

**Blok CTA** (zawsze, przed „Następny projekt”): `Reveal as="section"` z `aria-labelledby`, klasa `section` + `tone-dark`
przy `cta.tone: "dark"`. Nagłówek `h2` w roli h2 („Chcesz podobny projekt?”, `--i:0`), jedno zdanie w roli lead
(`--muted`, `--i:1`), `ContactCta index={2} note` („Porozmawiajmy →” do `#kontakt` w stopce z layoutu, więc kotwica
działa na każdej stronie). `cta.tone` ustawiaj **przeciwnie do ostatniej sekcji** case'u (szablon nie zna tonu `children`).

| `layout` | Legacy | Układ |
|---|---|---|
| `wide` (domyślnie) | `.cs-block` + `.cs-wide` | etykieta mono (`MonoLabel`, kolumny 1–2), treść w kolumnach 3–12 od 1024 px |
| `split` | `.cs-block` + `.cs-txt` / `.cs-vis` | tekst sticky (3–6) + wizualizacja (8–12); `flip` zamienia strony |
| `lite` | `.lite` / `.cs-lite` | wiersz mono: etykieta jako `<h2>` (`--i:0`), `hint` po prawej (`--i:1`); pod spodem treść na pełną szerokość, odstęp 24 px; `bleed` = treść od krawędzi do krawędzi (nagłówek z gutterem) |

Wariant `lite` (case studies stron): treść w środku daj w `<Fade index={2}>`. `.cs-lite` (OTB, Sassy) ma 32 px odstępu:
strony nadpisują klasą `section.csLite` w `page.module.css`.
```tsx
<CaseStudyLayout
  hero={{ kicker: otb.kicker, title: otb.title, summary: otb.summary, facts: otb.facts, datePublished: otb.datePublished }}
  cta={{ tone: "dark" }}  {/* ostatnia sekcja („04 / Fakty”) jest jasna */}
  next={{ href: otb.next, title: "Sassy" }}
>
  <CaseStudySection label="01 / Problem">…</CaseStudySection>
  <CaseStudySection layout="split" tone="dark" flip label="02 / Kierunek" text={…} visual={…} />
  <CaseStudySection layout="lite" bleed label="01 / Stories" hint="Przeciągnij taśmę">
    <Fade index={2}><FilmStrip frames={busybeeStories} ariaLabel="Stories" /></Fade>
  </CaseStudySection>
</CaseStudyLayout>
```
Specyficzne bloki case study budujesz jako organizmy obok strony (patrz [Case study](#case-study)).

---

## Strony (`src/app`)

Wszystkie `page.tsx` to Server Components: `buildMetadata` + `<JsonLd>` + organizmy. Chrome i globalny JSON-LD
(Organization, WebSite, Person) są w `layout.tsx`.

| Route | Plik | Źródło legacy | Sekcje | JSON-LD strony |
|---|---|---|---|---|
| `/` | `app/page.tsx` | `no-fuss-v5` | `HomeHero` → `ServicesList` → `ProcessSection #proces` → `WorkGrid` → `AboutSection` → `TestimonialsSection` (ukryta bez opinii) → `FaqSection #faq` | `homeGraphNodes()`: `ItemList #realizacje`, `OfferCatalog #uslugi`, `Review` (tylko nie-placeholdery, teraz 0), `FAQPage #faq` (`publishedFaq()`) |
| `/o-nas` | `app/o-nas/page.tsx` | `o-nas-v5` | `TeamHero` → `TeamSheets` → `Marquee` → `RolesSplit` → `FindSection` ×2 → `StickerBoard` | `BreadcrumbList` + `AboutPage #webpage` (`mainEntity` → Organization, `mentions` → Person) |
| `/ourmoney` | `app/ourmoney/` | `case-ourmoney-v2` | `CaseStage` phones, wide/split, `SplitCalculator`, `CaseScreens`, `CaseNumbers`, `TechStack` | `BreadcrumbList` + `CreativeWork` (`about` → app) + `SoftwareApplication` (`FinanceApplication`, oferty 24,99 / 249,99 PLN) |
| `/aion-mind` | `app/aion-mind/` | `case-aion-mind-v1` | `CaseStage` image, `JournalScreen`, `GuideCards`, `RolePath`, `CaseNumbers` | jak wyżej, `LifestyleApplication`, `installUrl` = sklepy, `contributor` = Magda, `publisher` = `Organization` AION MIND z `employee` = Magda (etat, nie produkt no-fuss) |
| `/busy-bee` | `app/busy-bee/page.tsx` | `case-busybee-v3` | `LiveFrame` → lite: `CaseStory`, `FilmStrip` (podpis: reklamy Busy Bee dla ich klientów), `PhoneScroller`, `SpecList` | `BreadcrumbList` + `CreativeWork` (`about.url` = żywa strona) + `WebSite` klienta |
| `/automation-house` | `app/automation-house/page.tsx` | `case-automation-house-v1` | `LiveFrame` → lite: `CaseStory`, `ProcessSteps`, `PhoneScroller`, `SpecList` | jak Busy Bee |
| `/otb` | `app/otb/` | `case-otb-v2` | `LiveFrame` (click) → lite: `CaseStory`, `DragBall`, `PhoneScroller`, `SpecList` | jak Busy Bee |
| `/sassy` | `app/sassy/` | `case-sassy-v2` | `LiveFrame` (click) → lite: `CaseStory`, `ToySwitcher`, 2 × `PhoneFrame`, `SpecList tiles` | jak Busy Bee, `WebSite.author` = Magda |
| 404 | `app/not-found.tsx` | `404` | `NotFoundHero` | — |

Każdy case kończy się blokiem CTA z szablonu, potem „Następny projekt”.
Metadane case studies: `buildMetadata({ path, type: "article", description: caseDescription(c), images: [cover] })`.
`caseDescription` zwraca `CaseStudy.description` (do 155 znaków: co zrobiło no-fuss i dla kogo); tytuł bez zmian z `routes.ts`. `images` na poziomie strony wygrywa z `app/opengraph-image.tsx`. FAQ: tylko strona główna (`FAQPage` z `faq("/", …)` w `homeGraphNodes()`, `@id` = `/#faq`).

## Treść (`src/content`)

| Plik | Co |
|---|---|
| `site.ts` | `site` (w tym `contact: SiteContact` = `{ email, calendarUrl, responseNote }`, `homeTitle`, `description`), `people`, `products` (tylko produkty własne no-fuss: OurMoney; AION MIND to etat Magdy, adres w `cases/aion-mind.ts`), `isPlaceholder()` |
| `routes.ts` | `routes`, `caseOrder`, `getRoute`, `getNextCase`, `getNavSection` |
| `navigation.ts` | `mainNav` (Usługi, Realizacje, O nas, Kontakt; wszystkie widoczne na każdej szerokości, `hideOnSmall` nieużywane) |
| `types.ts` | typy współdzielone (`CaseStudy`, `CaseStudySummary`, `CaseStudyStory`, `SocialLink`, `Person`…) |
| `home.ts` | `hero` (lead, akapit o duecie), `about`, `work` (kafle), `servicesSection`, `testimonialsSection`, `publishedTestimonials()`; typy `WorkTile`, `SizedImage` |
| `home-jsonld.ts` | węzły JSON-LD strony głównej (`workItemList`, `servicesCatalog`, `reviews`, `faqPage`). W `workItemList` `creator` wg `CaseStudy.ownership`: `own`/`client` → no-fuss; `employment` → `Organization` pracodawcy (`ids.externalOrganization(url)`) + `contributor` = Person z `employer.employee` |
| `process.ts` | `processSection` (label, counter, 4 kroki `ProcessSectionStep`) dla `ProcessSection` |
| `faq.ts` | `faqSection` (label, `more`, pytania `FaqItem`), `publishedFaq()` (bez placeholderów `[…]`) |
| `about.ts` | treść `/o-nas` (`aboutHero`, `personCards`, `aiCard`, `marqueeItems`, `rolesSplit`, `findUs`, `linkedinPosts`); opcjonalne `personCards[id].photo` (`AboutPhoto`: `src`, `width`, `height`, `alt`), dziś tylko Kuba (`/assets/team/kuba.avif`, 640×640), trafia też do `image` w JSON-LD `Person` |
| `cases/index.ts` | `cases` (6 × `CaseStudy` w kolejności `caseOrder`), `getCase(path)`, `CasePath`, `caseDescription(c)` |
| `cases/<slug>.ts` | `CaseStudy` + dane bloków (`*Live`, `*Phone`, `*Spec`, `*Next`, obrazy, liczby…) |

Nowe pola `CaseStudy` (wymagane, poza `story`):
```ts
interface CaseStudySummary {            // fakty standardowe hero, kolejność stała
  role: string;                         // „Rola no-fuss”: co zrobiło studio, z nazwiskami spoza no-fuss
  scope: string;                        // „Zakres”
  time: string;                         // „Czas”, z kickera legacy: „06.2025”, „01.2025 → teraz”
  client?: string;                      // „Klient” + branża; brak = wiersz pominięty
  result?: { value: string; href?: string }; // „Wynik”: tylko fakt (działająca strona)
}
interface CaseStudyStory { problemTerm: "Problem" | "Zadanie"; problem: string; done: string; effect: string }
type CaseOwnership = "own" | "client" | "employment"; // own: OurMoney, Sassy; client: Busy Bee, AH, OTB; employment: AION MIND
interface CaseEmployer { name: string; url: string; employee: Person["id"] } // tylko przy "employment"
interface CaseStudy { …; ownership: CaseOwnership; employer?: CaseEmployer; summary: CaseStudySummary; facts: readonly CaseStudyFact[] /* dodatkowe */; story?: CaseStudyStory; description: string }
```
Zasada: tylko fakty z `legacy/case-*.html` i repo. Bez danych (wynik, kod OTB) pole zostaje puste i nic się nie renderuje.
| `cases/software-app.ts` | `softwareApplication()`, `softwareAppId()` — węzeł `SoftwareApplication` |

Kafle `work.tiles` są wyprowadzone z `cases` (`tileLabel` → `title`, `title` → `name`, `years`, `kind`, `cover`):
w `home.ts` zostaje tylko układ (`size`, `offset`, `square`, `screens`) i okładka OurMoney (inny `alt` niż w case'ie).
Kolejność kafli jest z legacy (inna niż `caseOrder`), poza Sassy przeniesionym na koniec. Wymiary obrazów to realne piksele (`sips`); helper `img()` w plikach case'ów
zwraca `Required<CaseStudyImage>`.

```ts
type SizedImage = CaseStudyImage & { width: number; height: number };
interface WorkTile {
  href: RoutePath; title: string; name: string; years: string; kind: string;
  cover: SizedImage;                                        // przy `screens`: aria-label + obraz JSON-LD
  screens?: readonly [SizedImage, SizedImage, SizedImage];  // 3 telefony na limonce (OurMoney)
  size: "xl" | "l" | "m" | "s"; offset?: 1 | 2; square?: boolean;
}
```

---

## Hooki (`src/lib/hooks`) — wszystkie client

| Hook | Sygnatura | Uwagi |
|---|---|---|
| `useReducedMotion` | `() => boolean` | `false` na serwerze i przy hydratacji |
| `usePointerFine` | `() => boolean` | `(pointer: fine)` |
| `useMediaQuery` | `(query: string, serverValue?: boolean) => boolean` | baza dwóch powyższych |
| `useIntroDone` | `() => boolean` | preloader skończył |
| `useReveal` | `(target: RefObject<T \| null> \| T \| null, { trigger?: "view" \| "intro" }) => boolean` | `true` → dodaj `is-in` |
| `useScramble` | `(text: string, { disabled?, duration? }) => { text, scramble, cancel, isScrambling }` | stan w React, bez mutacji DOM |
| `useViewportSize` | `() => { width, height } \| null` | `null` na serwerze |

Poza Reactem: `@/lib/intro` → `isIntroDone()`, `subscribeIntro(fn)`, zdarzenie `INTRO_EVENT` na `window`.

---

## Nowa strona: checklista

1. **Route:** dopisz wpis do `src/content/routes.ts` (`path`, `title` 1:1 z `<title>` legacy bez sufiksu,
   `kind`, `section`, `legacy` — stare pliki do przekierowań 301, `source`, `lastModified`, `changeFrequency`, `priority`).
   Sitemap i redirecty zaktualizują się same. Dopisz stronę do `public/llms.txt`.
   Case study: `CaseStudy` w `src/content/cases/<slug>.ts` (z `summary`, `description`, dla stron WWW też `story`),
   wpis w `caseOrder` i w `byPath` w `src/content/cases/index.ts`.
2. **Plik:** `src/app/<slug>/page.tsx` (Server Component).
3. **Metadane:**
   ```ts
   import { buildMetadata } from "@/lib/seo/metadata";
   export const metadata = buildMetadata({ path: "/otb", type: "article" });
   ```
   Tytuł z `routes.ts` + template „%s — NO-FUSS©2026”. Wyjątek: `/` (tytuł `null` w routes) dostaje
   `site.homeTitle` jako `absolute` (bez template'u), opis `site.description`. Canonical, OG, Twitter, robots składa helper.
   Obraz OG dziedziczy się z `app/opengraph-image.tsx`; własny: `app/<slug>/opengraph-image.tsx`.
4. **JSON-LD:**
   ```tsx
   import { JsonLd, graph, breadcrumb, creativeWork } from "@/lib/seo/jsonld";
   <JsonLd data={graph(
     breadcrumb("/otb", [{ name: "OTB Ventures", path: "/otb" }]),
     creativeWork({ path: "/otb", name: "OTB Ventures", about: "…", datePublished: "2025-06", image: "/assets/otb/d-00.webp" }),
   )} />
   ```
   Organization, WebSite i Person są już w layoucie (łączone przez `@id`). `faq(path, items)` dla sekcji FAQ.
5. **Hero:** `Reveal trigger="intro"` (odsłania się po preloaderze), ciemne tło `GlowBackdrop`, strefa `data-stickers`.
6. **Sekcje:** `.section` (+ `.tone-dark` naprzemiennie), treść w `Reveal`, linie `Line` / `Fade` z `index`.
7. **Obrazy:** `next/image` z `public/assets/**` (AVIF/WebP włączone), zawsze `alt` 1:1 z legacy.

## Konwencje CSS Modules

- Nazwy klas camelCase (`styles.tileMeta`), bez BEM.
- Tylko tokeny (`var(--…)`), zero surowych kolorów poza tymi, które legacy ma jako stałe (`#101318` na limonce itp.).
- Tonacja przez klasę `.tone-dark` na sekcji, nie przez nadpisywanie kolorów w module.
- Siatka: `grid-template-columns: repeat(12, 1fr); gap: … var(--gap);` albo klasa `.grid-12`. Breakpointy z legacy: 640, 768, 900, 1024 px.
- Zawsze blok `@media (prefers-reduced-motion: reduce)` dla animacji w module.
- Elementy absolutne w gridzie (tło, naklejki) bez `grid-column` (inaczej zawężają containing block).
