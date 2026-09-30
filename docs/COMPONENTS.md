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
   Scena ma czekać na start wejścia (fonty gotowe): `window.addEventListener(INTRO_EVENT, …)` albo `isIntroDone()` z `@/lib/intro`.
3. **Copy 1:1 z legacy.** Nie wymyślamy tekstów. Placeholdery `[w nawiasach]` zostają placeholderami.
4. **Design:** zero `border-radius` w UI (wyjątki: [Wyjątki od zero-radius](#wyjątki-od-zero-radius)),
   jeden akcent `var(--accent)` (na jasnym tylko jako tło), kroje tylko `var(--sans)` / `var(--mono)`,
   rozmiary tylko z tokenów `--t-*`, odstępy w wielokrotnościach 8 px.
5. **Props typowane, bez `any`.** Każdy komponent: `Name/Name.tsx` + `Name.module.css` (jeśli ma własne style) + `index.ts`.
6. **Import** z folderu komponentu (`@/components/atoms/Heading`) albo z barrela warstwy (`@/components/atoms`).
   Barrele warstw eksportują wszystkie komponenty; `HeroScene.tsx` celowo nie (tylko `LazyHeroScene`).

## Czego NIE ruszać bez uzgodnienia

- `src/app/layout.tsx` i `src/app/fonts/` (chrome, fonty z repo przez `next/font/local`, kolejność warstw, JSON-LD globalne)
- `src/styles/tokens.css`, `src/styles/globals.css` (kontrakt tokenów i klas globalnych)
- `src/lib/intro.ts`, `src/lib/hooks/*`, `src/lib/seo/*` (kontrakty współdzielone)
- `src/content/routes.ts` — **tylko dopisujemy** nowe route'y, nie zmieniamy istniejących
- organizmy chrome: `Hud`, `GridOverlay`, `Cursor`, `Footer`, `SmoothScroll`

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
| `.line` + `.fade` + `.is-in` | reveal (steruje `Reveal`); stagger przez `style={{ "--i": n }}` |

Warstwy (`z-index`): siatka overlay 1, treść sekcji 2, menu na telefonie (`MobileMenu`) 49, HUD 50, kursor 90, skip link 200.
Pod siatką tylko tła: tło hero (`GlowBackdrop`) 0. Obiekty nad siatką: kanwa `HeroScene` i fallback CSS napisu 2,
naklejki (`StickerLayer`: stopka, 404, hero case study) 2; treść strefy (też 2) leży nad nimi dzięki kolejności w DOM.

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

Portrety przewodników AION MIND są okrągłe w plikach PNG (bez `border-radius`). Ramka `LiveFrame`, pole kuli OTB: 0.

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
Nazwa propa to `variant`, nie `role` (kolizja z atrybutem ARIA). Między `lines` idzie spacja (niewidoczna między blokami `.line`),
więc `textContent` i nazwa dostępna nie sklejają słów; `aria-label` tylko jawnie z propa.

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
Kilka `Line` w jednym elemencie (poza `Heading`) rozdzielaj `{" "}`, inaczej słowa sklejają się w `textContent`.
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
`underline` = link w tekście (podkreślenie 1 px, hover limonkowe tło). Przed strzałką jest twarda spacja, więc glif
nie spada sam do nowej linii. Eksport `LinkText({ text })` służy wartościom-linkom z danych (fakty hero, `SpecList`):
ostatnie słowo (zwykle domena) ze strzałką jest jednym `inline-block`, nie łamie się na dywizie, a gdy jest szersze od
kolumny, może złamać się tylko przed kropką domeny.

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
`aria-disabled="true"` = opacity .6, `cursor: default` i bez uniesienia na hover; `ContactForm` nadpisuje kursor
przycisku wysyłki na `progress`. Hover jest tylko w `@media (hover: hover)`.

### `VisuallyHidden` — server
`<VisuallyHidden as="h2">Realizacje</VisuallyHidden>`, `role?: "status" | "alert"`.

### `SectionLabel` — server
`<h2 className="mono"><SectionLabel label="03.5 / Codzienność" /></h2>`: numer przed „ / ” widoczny, ale `aria-hidden`,
więc nagłówek dla czytnika to sama nazwa („Codzienność”). Separator ma twarde spacje po obu stronach, więc numer nie
odrywa się od nazwy; bez separatora cała etykieta jest nazwą.
Używają go `CaseStudySection` (etykieta `lite` jako `h2`, kicker `wide`/`split`) i `CaseStrip`.

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
`STICKER_ZONE_ATTR`, `STICKER_LAYER_ATTR`.

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
Eksporty: `TigersLogo`, `AutomationHouseLogo`, `BnaLogo`, `InPostLogo`, `CoiLogo` (`PartnerLogoProps` = `SVGProps` bez `children/role/viewBox`),
`PARTNERS: readonly Partner[]` (`{ name, Logo? }`, kolejność z legacy, nowe na końcu: Centralny Ośrodek Informatyki), `PartnerLogo({ partner, className })`.
Każde SVG: `role="img"`, `aria-label` + `<title>`, `fill="currentColor"`, viewBox przycięty do znaku, szerokość z viewBox.
Wysokość optyczna: `calc(var(--logo-size, 28px) * var(--logo-optical))`, gdzie `--logo-optical = (4 / proporcja viewBox)^0.4`
(liczy `LogoSvg`): szeroki napis (Automation House ~9:1) niższy, zwarty znak (InPost ~2:1) wyższy, na oko równe. Rodzic ustawia `--logo-size`.
Bez `Logo` renderuje się nazwa w roli `title` 700 (legacy `.clients__word`).
Klasy `.cls-*` i `id` z oryginalnego InPost usunięte (inline `<style>` w SVG byłby globalny).
```tsx
<PartnerLogo partner={{ name: "Nowy klient" }} />   // tekstowy fallback
<InPostLogo className={styles.logo} />
```

---

## Molekuły (`src/components/molecules`)

Wszystkie są Server Components, poza `CopyEmail` i `ContactForm`.

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
Wiersz pod kaflem: nazwa | rok (+ strzałka reagująca na hover linku-przodka w `@media (hover: hover)` i jego
`:focus-visible`). Z `arrow` rok ze strzałką ma `nowrap` (zawija się tylko nazwa).
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
Accent „Porozmawiajmy →” → `#kontakt` (stopka z formularzem `ContactForm`) i ghost „Umów rozmowę ↗” → `site.contact.calendarUrl` (nowa karta).
Przy `calendarUrl: null` ghosta **nie ma** (sam „Porozmawiajmy →”), bez wyszarzonego placeholdera. `note` dokłada
`site.contact.responseNote` (mono-sm, `--muted`), ale nie gdy to placeholder `[…]`. `index` = `.fade` + `--i` (reveal z rodzicem).
Przyciski zawijają się (odstęp 8 px). Dane tylko z `site.contact`.
```tsx
<ContactCta index={4} />            {/* hero, pod h1 i leadem */}
<ContactCta note />                 {/* pod listą usług, widoczne od razu (bez reveal) */}
{/* case study: blok CTA w `CaseStudyLayout` (ContactCta index={2} note), strony go nie składają */}
<PageHero lines={aboutHero.lines} lead={aboutHero.lead} cta />   {/* /o-nas: ContactCta index={lines.length + 1} pod leadem */}
{/* RolesSplit: <Reveal className={styles.cta}><ContactCta index={0} /></Reveal> pod wierszami */}
```

### `ContactForm` — client
```ts
interface ContactFormProps { className?: string }
const CONTACT_FORM_COPY: { label; fields: { name; email; message }; messagePlaceholder; submit; pending; sent; failed; trap };
```
Formularz kontaktu w stopce (`Footer`, jedyne użycie): imię, e-mail, wiadomość (wszystkie wymagane) → Server Action
`sendContactMessage` z `@/lib/contact/action` podana wprost do `useActionState`. SSR wystawia natywne `action` z ukrytymi
polami `$ACTION_REF_…`, więc wysyłka działa bez JS i przed hydratacją. Akcja na wejściu sprawdza
`formData instanceof FormData`, potem wysyła przez Resend API (`fetch`, bez SDK) na `site.contact.email` z Reply-To =
adres z formularza; temat jest stały („Kontakt ze strony no-fuss”), imię trafia do treści. W logu błędu Resend zostają
tylko status oraz `name` / `message` z JSON-a. Wymaga `RESEND_API_KEY` i `CONTACT_FROM` (README).

Walidacja i limity (`CONTACT_LIMITS`: 120 / 254 / 5000 znaków, te same w `maxLength`) są w
`@/lib/contact/form` (`parseContactForm`, czysty moduł). E-mail jest wyłącznie ASCII (domena IDN jako punycode `xn--`);
przekroczenie 254 znaków daje osobne „Adres e-mail jest za długi”. Z imienia i wiadomości znikają znaki `\p{Cc}` /
`\p{Cf}` poza ZWNJ i ZWJ (m.in. bidi, U+200B i U+FEFF); limity są sprawdzane po oczyszczeniu.

Stany (`ContactFormState`): `idle`; `invalid` (tag błędu pod polem jak `Tag`, limonkowy obrys pola, `aria-invalid` +
`aria-describedby`, fokus na pierwsze błędne pole, wartości wracają przez `defaultValue`, bo React resetuje formularz po
akcji); `failed` (brak konfiguracji, błąd API, timeout 10 s: wartości zostają, w `role="status"` link `mailto:`); `sent`
(pola czyste, „Dzięki, wiadomość doszła. Odpiszemy na …”). Odrzucone wywołanie akcji (429 z Vercel Firewall, brak sieci,
limit body) łapie `ContactFormBoundary` (`catchError` z `next/error`): montuje nową próbę w stanie `failed` z wysłanymi
wartościami, komunikatem w `role="alert"` i fokusem na przycisku wysyłki.

W trakcie wysyłki „Wysyłamy…”, `aria-disabled` (opacity .6, bez uniesienia) i `cursor: progress`; drugi submit blokuje
`onSubmit`. Pułapka na boty to pole `nf_field_2` (`CONTACT_HONEYPOT`; sr-only, `aria-hidden`, `tabIndex={-1}`,
`autoComplete="new-password"`, `data-1p-ignore`, `data-lpignore="true"`, `data-form-type="other"`); wypełnione daje
`sent` bez maila i loguje `[contact] honeypot hit` bez danych. Obok wysyłki ghost „Umów rozmowę ↗” (tylko z
`calendarUrl`), pod spodem `responseNote` (bez placeholdera `[…]`). Pola: obrys 1 px `--ink` 18% (hover 40%, fokus
2 px `--ink`), wypełnienie `--bg` drugim cieniem, karetka w akcencie; od 768 px imię | e-mail w dwóch kolumnach,
wiadomość na całą szerokość (`data-lenis-prevent`, `resize: vertical`). Wymaga ciemnego rodzica z `--bg`.
`next.config.ts`: Server Actions mają `bodySizeLimit: "64kb"`, a każda ścieżka nagłówki `X-Frame-Options: DENY`
i `Content-Security-Policy: frame-ancestors 'none'`.

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
wskaźnik „Zamieszanie” wypełnia się do `--v`, gdy przodek dostanie `is-in`, a `.roles` ma
`align-content: flex-start`. Siatka 6 kolumn: < 900 px wszystko w kolumnie, kadr zdjęcia 3:4 ma `max-height: 60svh`
(`object-fit: cover`, `object-position` z `photo.focus`); 900–1199 px zdjęcie z lewej (2/6); ≥ 1200 px karta pionowa
ze zdjęciem 4:3. `variant="ai"`: ciemny kadr (`--dark`) 16:9 na każdej szerokości, bez kresek placeholdera,
ilustracja w `--accent` (`currentColor`). Hover linków tylko w `@media (hover: hover)`. Karta nie zawiera `Reveal` —
owija ją `TeamSheets`.

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

### `EventTile` — server
```ts
interface EventTileProps { event: KnowledgeEvent; variant: "upcoming" | "past"; className?: string }
```
Kafel wydarzenia (`/wiedza`, zajawka `#wiedza` na `/`): `<article id={event.id}>` (kotwica `/wiedza#<id>`, `@id` w JSON-LD), tytuł `h3` (`--t-title` 700) nazywa kafel.
`upcoming`: kafel `--tile`; wiersz nad datą: `Tag` z formatem po lewej, opcjonalne `logo` (przezroczyste tło, wysokość 40 px, od 1024 px 48 px)
w prawym górnym rogu. Dalej data w `<time>` (dzień w roli display, mono „2026 · SOB · 10:00”; wielodniowe
„17–18.11” i „2026 · WT–ŚR”), opis `--muted`, `dl` mono-sm z `FactRow` („Gdzie” | „Kto” w dwóch kolumnach; „Gdzie” = `host, venue, place`,
bez miasta, gdy `host` już je zawiera), `Button` z `link` (nowa karta, dosunięty do dołu kafla).
`past`: zdjęcie 16:10 (`next/image` albo `PhotoPlaceholder` „Zdjęcie z wydarzenia 16:10”) z tagiem w prawym górnym rogu jak `WorkTile`
i opcjonalnym `logo` w lewym górnym rogu (bez tła, wprost na zdjęciu, 7 px od góry i 10 px od lewej, wysokość 16 px),
`MetaRow` data | gdzie, tytuł, opis, osoby (mono-sm), `ArrowLink` do nagrania / relacji (tylko z prawdziwym `href`). Kafel nie jest linkiem.
Reveal robi rodzic (`className="fade"` w `Reveal as="li"`). `sizes` stałe: zdjęcie minionego — siatka 1 → 2 (640 px) → 3 kolumny (1024 px);
logo — `200px` (górna granica przy stałej wysokości; `.svg` idzie bez optymalizacji).
Hover (`@media (hover: hover)`), bez strzałki i kursora-linku, bo kafel nie jest linkiem: `upcoming` — dzień dostaje limonkowe tło
(`::before`, 12 px z obu stron) i `translateX(12px)`, 0.4 s `--ease`; `past` — zdjęcie / `PhotoPlaceholder` `scale: 1.2` w masce `.media`
(`overflow: hidden`), 2 s `ease-out` (powoli; `--ease` robi większość ruchu na starcie). Z `logo` `.media` dostaje `.shade`: `::after` z cieniem
`inset 0 48px 40px -24px` (czerń 60%) nad zdjęciem, pod logo i tagiem; nie skaluje się. Ten sam stan przy `:has(:focus-visible)` (fokus z klawiatury na `Button` / `ArrowLink` w kaflu;
bez `:focus-within`, żeby tap na dotyku go nie przyklejał). Animowane są dzieci, nie `article` (ma `.fade`). Reduced motion: bez przejść
i bez transformacji, limonka natychmiast.

### Linki-placeholdery

Placeholdery nie są klikalnymi linkami (bez `href="#"`, bez skoku na górę, poza kolejnością Tab). `href: null` w danych →

| Gdzie | Zachowanie |
|---|---|
| `SocialLinks` (stopka, karty osób) | link **pomijany**; bez żadnego prawdziwego → brak `<nav>` (lista równorzędnych profili, brakujący nic nie wnosi) |
| wiersze `FindSection` (`/o-nas#social`, `#posty`) | `<span>` z klasą wiersza, opacity .5, bez hovera, sr-only „(wkrótce)” (układ sekcji zostaje) |
| `EventTile` (`/wiedza`, `/#wiedza`) | nadchodzące: `Button href={null}` (przygaszony, sr-only „(wkrótce)”); minione: link **pomijany** |
| `ContactCta` / `ContactForm` („Umów rozmowę ↗” przy `calendarUrl: null`) | przycisk **pomijany** (w stopce zostaje sam „Wyślij wiadomość →”) |

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
| `isPublishedEvent(e)` | `events.ts` | wydarzenia w JSON-LD (`Event`) i w zajawce `/o-nas#wydarzenia` |

Wyjątek: kafle wydarzeń (`/wiedza` i zajawka `#wiedza` na `/`): placeholdery `[…]` (dziś brak) są tam **widoczne**
(decyzja: układ do przeglądu), ale nie trafiają do JSON-LD ani na `/o-nas`.
Helper dla prawdziwych adresów: `externalLinkProps(href)` z `@/lib/href` (`target="_blank" rel="noopener"`).
`ScrambleLink` i `SmoothScroll` nadal obsługują `aria-disabled="true"` (dla linków spoza danych).

---

## Organizmy (`src/components/organisms`)

### Chrome (`app/layout.tsx`)

Montowany w layoucie. Strony go nie renderują.

| Komponent | Typ | Rola |
|---|---|---|
| `Hud` | client | logo, nav (`<header>`, `<nav aria-label="Główna">`), postęp scrolla. Fokus: biały obrys 2 px (odwraca się w `difference`). Od 768 px linki w wierszu. Poniżej 768 px zamiast nich przycisk „Menu” (`aria-expanded` + `aria-controls`, cel 44 px, dwie kreski 22×2 px → krzyżyk) rozwijający `MobileMenu`; zamyka go przycisk, Escape (fokus wraca na przycisk), klik w link (także logo), zmiana ścieżki, przejście na ≥ 768 px i fokus poza HUD i panelem. Otwarte menu: `data-lenis-prevent` na `<header>`. Bez JS (`@media (scripting: none)`) przycisku nie ma, linki zawijają się w wierszu |
| `MobileMenu` (w `Hud/`) | client (tylko przez `Hud`) | `{ ref?, id, open, items, pathname, onNavigate }`. Pełnoekranowy panel pod HUD (z-index 49, `tone-dark`, `data-lenis-prevent`), sibling `<header>` (poza `mix-blend-mode`). Zamknięty: `visibility: hidden` i kurtyna `clip-path` zwinięta do góry; otwarty (`data-open` + `is-in`): kurtyna zjeżdża 0,7 s, linki (`Line`, rola display wersalikami) i e-mail (`CopyEmail`, `.fade`) wjeżdżają ze staggerem po 150 ms; zamknięcie 0,5 s, reset treści za kurtyną. Wiersze z obrysem 1 px przy dolnej krawędzi, `aria-current` z `getAriaCurrent` + tag „Tu jesteś” (`aria-hidden`). Hover (`hover: hover`) jak FAQ. Scroll strony blokuje `body:has(.menu[data-open])`. Od 768 px `display: none` |
| `GridOverlay` | client | 3 piony + 2 poziomy z krzyżykami, `mix-blend-mode: difference` |
| `Cursor` | client | strzałka (lerp 0.18) + naklejki; tylko `pointer: fine`, off przy reduced motion. Jeden SVG 88 px (punkt wskaźnika w środku), stan w `data-state` bez re-renderów: `arrow`; `link` nad `a[href], button, [role="button"], label, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])` (bez `:disabled`) → limonkowy pierścień; `grab` nad `[data-cursor="grab"]` (ma pierwszeństwo; track `FilmStrip`, kula `DragBall`, naklejka `StickerBoard`) → mała kropka, `data-pressed` przy wciśnięciu ją ściska. `help` nad `[data-cursor="help"]` (`summary` w `FaqSection`) → pełny limonkowy krążek z „?”, przy `details[open]` z „−” (`data-open`, odświeża się przy ruchu); `calendar` nad `[data-cursor="calendar"]` (`Button` „Umów rozmowę ↗” w `ContactCta` i `ContactForm`) → krążek z ikoną kalendarza; wciśnięcie ściska oba do 0.8 jak `link`. Wartości `data-cursor`: `grab` \| `help` \| `calendar`; kolejność detekcji (`closest`): grab → help → calendar → link. Śledzi `pointermove` (działa też przy `preventDefault` na `pointerdown`). Nad `[data-native-cursor]` (żywa ramka `LiveFrame`, ekran `PhoneScroller`) i po wejściu do `iframe` / wyjściu z okna chowa się, zostaje kursor systemowy. Reguła w `globals.css`: `html[data-cursor="on"] :not([data-native-cursor], [data-native-cursor] *) { cursor: none !important }`, więc `cursor:` w modułach nie przebija się; element z `data-native-cursor` musi sam ustawić `cursor` (`auto` albo własny). Ton w `data-tone` (`base` / `accent`): hit-test `elementsFromPoint` przy zmianie celu (`pointermove` / `pointerover`), pierwsze nieprzezroczyste tło na stosie (i `::before` wierzchniego) równe `--accent` → ciemny wariant; `img` / `video` / `canvas` wyżej na stosie → `base`; przeliczany też na `transitionrun` / `transitionend` / `transitioncancel` `background-color` elementów ze stosu i raz po `pointerup` |
| `SmoothScroll` | client | Lenis (lerp 0.1), kotwice, reset przy zmianie route |
| `Footer` | server | `#kontakt` (cel „Porozmawiajmy →”), min. `100svh`, płaskie tło `--hero-sky` (bez smug, `--bg` = `--hero-sky`, `color-scheme: dark`), CTA display z revealem linii; na końcu limonka `Mark` „zamieszania” wjeżdża od prawej do lewej (własny `Reveal` słowa, opóźnienie `--reveal-duration` po jego `is-in`, tło w `::before`, kolor liter gradientem `background-clip: text` na tej samej krawędzi; reduced motion: od razu limonka). `.l3` ma `line-height: calc(1em + var(--gap))` i ujemne marginesy, więc złamane „bez / zamieszania” zachowuje rytm pozostałych linii. Pod nagłówkiem `ContactForm` widoczny od razu (od 768 px od kolumny 3, od 1024 px kolumny 3–10; w nim „Umów rozmowę ↗” i `responseNote`); nagłówek z formularzem stoją na środku wolnego miejsca (`.main`, `flex: 1`), niżej w przepływie wiersz z `CopyEmail` w `<address>` (`font-style: normal`), `SocialLinks` i copyrightem w `<small>` (`font-size: inherit`); jedyna strefa naklejek (`data-stickers`) na stronach treści |
| `Reveal` | client | wrapper `data-reveal` |

### `Reveal` — client
```ts
interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "figure" | "ul" | "ol" | "li" | "p" | "span" | "dl";
  trigger?: "view" | "intro"; // view: IntersectionObserver (0.15, raz); intro: na starcie wejścia (hero)
}
```
```tsx
<Reveal as="section" className="section tone-dark" id="realizacje">
  <MonoLabel className="fade">Produkty i realizacje</MonoLabel>
  <Heading variant="h2" lines={["Co robimy"]} startIndex={1} />
</Reveal>

{/* hero strony głównej (naklejki tylko w stopce i na 404) */}
<Reveal as="section" trigger="intro" id="hero" className="above-grid …">
  <GlowBackdrop />
  <Heading as="h1" variant="display" lines={["Budujemy", "produkty bez", "zamieszania"]} />
</Reveal>
```

### `SmoothScroll` / `useLenis`
`useLenis(): Lenis | null` (client) i `getLenis()` (poza Reactem). Zawsze obsłuż `null` (reduced motion).
Kontener z własnym scrollem (np. przewijany telefon) oznacz `data-lenis-prevent`.
Kotwice na tej samej stronie (także bez Lenis przy reduced motion) ustawiają najpierw `#hash` przez `history.pushState`
(żeby „Wstecz” wracało do pozycji sprzed kliknięcia), potem przewijają i przenoszą fokus na cel (bez `tabindex` dostaje
`tabindex="-1"`). `popstate` ustawia flagę back/forward tylko przy zmianie ścieżki.

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
| `HomeHero/HomeHeroStage.tsx` | client | kanwa na całe hero + pusta ramka `.band` (`frame`: od 768 px pas między h1 a leadem z CTA; na telefonie miejsce na fallback CSS), sloty na serwerową treść (`headline` = h1 + lead + `ContactCta`, `sceneLabel`) |
| `NotFoundHero/` | server + `NotFoundStage` (client) | hero 404, bez propsów; ghost „Droga do Mordoru ↓” do `#mordor` |
| `FellowshipMap/` | server + `FellowshipBoard` (client) | sekcja `#mordor` pod hero 404: mapa trasy Drużyny Pierścienia (SVG, nie scena 3D); dane `content/fellowship.ts` (mile od Hobbitonu), rysunek `geography.ts`, czas i rzutowanie `route.ts` |

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
  frame?: RefObject<HTMLElement | null>; // od 768 px: napis na środku ramki, wysokość do fit.heightDesktop × ramka
  onReady?: () => void;         // pierwsza klatka z literami narysowana (hero `/`: start układania)
  onUnsupported?: () => void;   // brak WebGL albo fontu → rodzic pokazuje fallback CSS
}
interface SceneFit { widthDesktop; widthMobile; heightDesktop?; maxScale; offsetYDesktop; offsetYMobile } // próg 768 px
```

| | widthDesktop | widthMobile | heightDesktop | maxScale | offsetYDesktop | offsetYMobile | start fuss |
|---|---|---|---|---|---|---|---|
| hero `/` | 0.62 | 0.86 | 1 (ramki) | 1.4 | 0 (bez ramki) | 0.12 | 1 → 0 po intro (reduced motion: 0) |
| 404 | 0.5 | 0.7 | — | 1.0 | 0.1 | 0.16 | 1 |

```tsx
"use client";
// hero `/`: start z chaosu (reduced motion: 0), układanie 1 → 0 w 1600 ms (ease-in-out) po `onReady` i intro + INTRO_REVEAL_DELAY_MS
const [fuss] = useState(() => createFussStore(prefersReducedMotion ? 0 : 1));
const band = useRef<HTMLDivElement>(null); // <div ref={band} className={styles.band} /> w siatce hero
<LazyHeroScene text="no–fuss" fuss={fuss} frame={band} onReady={() => setSceneReady(true)} onUnsupported={() => setUnsupported(true)} />
// 404: useState(() => createFussStore(1)), przycisk „Posprzątaj” woła fuss.set(0)
```
Rodzic kanwy musi mieć `position: relative` (kanwa: `absolute; inset: 0; z-index: 2`, nad siatką overlay). Jedna scena na stronę.

#### Decyzje sceny
- **Start:** scena powstaje od razu po hydratacji, bez wejścia `opacity`. Litery startują w pozie
  startowego zamieszania (`scatterBody` z `physics.ts`: ta sama poza, do której ciągnie `stepWorld` przy stałym `f`), więc przy
  `f = 1` od pierwszej klatki są rozrzucone, zamiast rozlatywać się z napisu.
- **LCP:** h1 i copy renderuje serwer; three.js jest w osobnym chunku ładowanym po hydratacji.
- **Sklep → scena:** mutowalny sklep; scena czyta `fuss.get()` w każdym kroku. Wygładzanie w scenie (lerp 0.12 na krok, jak legacy).
  404: „Posprzątaj” ustawia 0 od razu, licznik 1100 ms. Hero `/` (`HomeHeroStage`): po `onReady` i intro, z opóźnieniem
  `INTRO_REVEAL_DELAY_MS` (razem z reveal h1), sklep schodzi 1 → 0 w 1600 ms (ease-in-out, rAF): litery z chaosu układają się
  w napis. To samo przy nawigacji klienckiej na `/` (intro już było, start po `onReady`).
- **Pętla:** działa tylko gdy kanwa jest w viewporcie (`IntersectionObserver`) i karta widoczna (`visibilitychange`);
  po wznowieniu akumulator jest zerowany (bez skoku). `ResizeObserver` na kanwie i ramce (`frame`); pixel ratio ≤ 2.
- **Ramka (`frame`, hero `/` od 768 px):** kanwa zostaje na całe hero (odepchnięte litery nie ucinają się), a `fitScene`
  mierzy ramkę (`getBoundingClientRect`) i ustawia środek grupy na środku ramki, skalę do min(62% szerokości kanwy,
  wysokość ramki / wysokość napisu). Wysokość napisu = glify + `baseW · sin(TILT_Z)` (przechył 0.06 podnosi prawy koniec),
  więc rogi napisu mijają h1 (z lewej u góry) i lead (z prawej u dołu). Ramka o wysokości 0 = zwykłe `offsetYDesktop`.
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
- **Reduced motion (jak legacy):** bez drgań, obrotu, „oddechu” i odpychania; rozrzut ze sklepu (404) zostaje. Hero `/` bez układania:
  sklep od 0, napis ułożony od pierwszej klatki.
- **Fallback:** wyjątek WebGL albo błąd fontu → napis CSS z gradientem (legacy `.hero__fallback`).
- **Ekspozycja 0.8:** legacy ustawiał 1.15, ale `applyTheme()` natychmiast nadpisywał na 0.8 (efektywnie 0.8).
- **Środowisko (r160 → r186):** legacy wołał `new RoomEnvironment()` bez renderera, co w r160 dawało światło główne 5
  zamiast 900 (ciemny pokój, jasne panele → kontrastowe odbicia). r186 ma zawsze 900 i pokój przesunięty o y −3.5,
  więc używamy kopii z r160 (`LegacyRoomEnvironment`).
- **Sprzątanie:** geometrie, materiał, env map, PMREM, `RoomEnvironment`, renderer, obserwatory, listenery. Font cache'owany w module.
- **Warstwy:** tło `z-index: 0` pod siatką (1); kanwa, ramka `.band` (z fallbackiem CSS) i treść `z-index: 2` nad siatką,
  bo napis 3D to obiekt, nie tło (legacy: kanwa −1, linie siatki przecinały litery). Treść nad kanwą przez kolejność w DOM
  (kanwa pierwsza w `HomeHeroStage`).
- **Dostępność:** kanwa `aria-hidden`; na `/` `VisuallyHidden` „W tle trójwymiarowy napis no–fuss.” (nowe zdanie);
  na 404 `h1.sr-only` 1:1 z legacy, tekst `aria-live="polite"`. „Wróć na stronę główną →” (accent) widoczny od początku,
  obok „Posprzątaj ↓” (ghost) i „Realizacje”; po „Posprzątaj” przycisk znika, a fokus idzie na „Wróć na stronę główną →”.
- **Nagłówki `/`:** jedyny `h1` to hasło. Rola „Design & Development”, dwa akapity, suwak „Zamieszanie” i naklejki
  z legacy usunięte (odciążenie pierwszego ekranu); kto co robi w duecie mówi podpis zdjęcia w `AboutSection`.
- **Hero `/` pod usługi:** telefon (< 768 px): h1, lead (`hero.lead` z `home.ts`, `--t-lead`) i `ContactCta` dosunięte do dołu
  pierwszego ekranu (wiersz siatki min. `100svh − 2 × --section-y`), napis 3D nad nimi (`offsetYMobile`). Od 768 px po
  przekątnej: siatka `auto / minmax(120px, 1fr) / auto`, `.headline` ma `display: contents`, h1 w wierszu 1 (1/span 8,
  lewy górny róg), ramka `.band` w wierszu 2 (1/-1), lead z CTA (`.aside`) w wierszu 3 (7/-1, od 1024 px 9/span 4,
  prawy dolny róg). Hero ma `min-height`, nie stałą wysokość (treść nie jest obcinana), kanwa wypełnia całe hero.
- **Metadane 404:** `app/not-found.tsx` eksportuje `metadata = { title: "404", description: "404: tej strony nie ma.", robots: null }`:
  template z layoutu daje „404 — no-fuss”, `robots: null` kasuje odziedziczone `index, follow`, więc zostaje
  jeden tag `noindex` wstawiany przez Next przy 404. Docs Next 16 opisują `metadata` tylko dla `global-not-found.js`, ale resolver
  16.3 czyta `metadata` z `not-found` (sprawdzić przy aktualizacji Next). React `<title>` nie wystarcza, bo tytuł z layoutu stoi
  w `<head>` pierwszy.

---

### Strona główna

Źródło: `legacy/no-fuss-v5.html` (+ nowe sekcje „Jak pracujemy” i FAQ spoza legacy). Server Components. Reveal tylko na
nagłówkach sekcji, linii statementu „O nas”, nagłówku stopki i kaflach (realizacje, wiedza); wiersze list, akapity, kroki,
logotypy i CTA pod listami są widoczne od razu. Liczników przy nagłówkach i numerów wierszy nie ma (numery tylko w krokach procesu,
poza licznikiem realizacji „01–06” — liczba kafli).
Sekcje z legacy są bez propsów (dane z `src/content/home.ts`); `ProcessSection` i `FaqSection` dostają dane z propsów
(`src/content/process.ts`, `src/content/faq.ts`) w `app/page.tsx`.
Kolejność pod klientów usługowych (zmiana wobec legacy): `HomeHero` → `ServicesList` → `ProcessSection` → `WorkGrid` →
`AboutSection` → `KnowledgeTeaser #wiedza` → `TestimonialsSection` → `FaqSection` → stopka (layout). Strona ma `revalidate = 3600`
(kafle zajawki zależą od dzisiejszej daty).

| Komponent | Sekcja (kotwica) | Tonacja | Nagłówek | Reveal |
|---|---|---|---|---|
| `HomeHero` | `section#hero` | ciemna | `h1` display | `trigger="intro"` |
| `ServicesList` | `section#uslugi` | jasna | `h2` mono „Co robimy”, usługi w `h3` (bez numerów; `no` tylko jako id w JSON-LD) | nagłówek; wiersze `li` (hover: limonka + wcięcie 12 px) i `ContactCta note` pod listą (od 1024 px od kolumny 4) bez reveal |
| `ProcessSection` | `section#proces.tone-light` | jasna | `h2` mono „Jak pracujemy”, kroki w `h3` | nagłówek; kroki (kolumny z kreską 1 px, numer mono, subgrid wyrównuje wiersze, hover: limonka + wcięcie 12 px + numer w tle, zapętlony przebieg 01 → 04 w widoku) bez reveal |
| `WorkGrid` | `section#realizacje.tone-dark` | ciemna | `h2` mono „Produkty i realizacje” (licznik „01–06”) | nagłówek + każdy kafel osobno (`li`) |
| `AboutSection` | `section#o-nas`, siatka 12 | jasna | `h2` sr-only „O nas” | cała sekcja; statement liniami 0–1; `figure`: portrety Magdy i Kuby obok siebie (3:4, `personCards[id].photo` z `about.ts`, te same co na `/o-nas`; bez zdjęcia `PhotoPlaceholder` z imieniem) z podpisem „kto co robi” pod każdym (mono-sm z `people`, te same dwie kolumny); drugi statement i logotypy bez reveal |
| `KnowledgeTeaser` | `section#wiedza.tone-dark` | ciemna | mono „Wiedza” + `h2` w roli h2 „Przekazujemy wiedzę dalej”, „Zobacz wszystko →” (`/wiedza`) | nagłówek + każdy kafel osobno (`li`); **zwraca `null`** bez wydarzeń |
| `TestimonialsSection` | `section#opinie.tone-dark` | ciemna | `h2` mono „Co mówią klienci” | nagłówek + każdy `figure`; **zwraca `null`**, gdy `publishedTestimonials()` jest puste (teraz: same placeholdery) |
| `FaqSection` | `section#faq.tone-light` | jasna | `h2` mono „Częste pytania”, pytania w `h3` w `summary` (bez numerów) | nagłówek; wiersze i zdanie pod listą (bez `ContactCta`, zaraz niżej jest stopka) bez reveal; **zwraca `null`** przy pustej liście |
| `Footer` (layout) | `footer#kontakt` | ciemna | display CTA | `Reveal` (linie nagłówka) |

Rytm tonacji: nie da się przeplatać wszystkich par. Usługi i proces są obie jasne (proces między jasnymi usługami
a ciemnymi realizacjami, każda tonacja da dwie takie same obok siebie); proces odróżnia układ: cztery kolumny zamiast wierszy.
„Wiedza” (ciemna) rozdziela jasne „O nas” i FAQ. Gdy pojawią się opinie (ciemne), staną obok ciemnej „Wiedzy”: wtedy do decyzji,
czy przenieść zajawkę albo zmienić jej tonację.

Wszystkie sekcje mają `aria-labelledby`. Jedyny `h1` jest w `HomeHero`.

Siatka realizacji (od 1024 px, 1:1 z legacy): `xl` 5/span 8 · `l` span 5, `l + l` 7/span 5 · `m` 6/span 3, `m + m` 10/span 3 ·
`s` span 3, `s.off` 5/span 3, `s.off2` 9/span 3. 768–1023 px: `xl` 5/span 8, pozostałe span 6 (dwie równe kolumny);
gdy pierwszy kafel to `xl`, a ostatni jest na parzystej pozycji, ostatni zajmuje pełny rząd
(`.grid > .xl:first-child ~ li:last-child:nth-child(even)`). `WorkGrid.tsx` liczy identyczny `fullOnTablet` i wtedy
podaje `SIZES_TABLET_FULL`, więc regułę układu i `sizes` trzeba zmieniać razem. Poniżej 768 px wszystko 1/-1.
Odstęp 56 px pion / 8 px poziom.
Kafle: OurMoney `xl` · AION MIND + Busy Bee `l + l` · OTB + Automation House `m + m` · Sassy `s` na końcu (tag „Eksperyment” z case'u).
Opinie (od 900 px): 1/span 7, 8/span 5, 4/span 6. Usługi (od 1024 px): nazwa 4/span 4, opis 9/span 4; niżej jedna pod drugą.
O nas: portrety z podpisem (telefon: maks. 340 px) 1/span 4 + tekst 6/span 7 (640 px), 1/span 3 + 5/span 8 (1024 px).
Logotypy: pętla `MarqueeLoop` (40 s na pół toru, ok. 40 px/s, krawędzie wygaszone maską 40 px), każdy znak w polu wysokości 48 px
(środek w pionie), odstęp 48 px (`padding-right`, także po ostatnim znaku kopii), `--logo-size: 24px`, od 768 px 28 px.
W torze `max-width: none` na logo (`100%` z `PartnerLogo` zwija SVG do zera w kontenerze o szerokości z treści).
Proces: kolumny 1 → 2 (640 px) → 4 (1024 px). FAQ jak usługi (od 1024 px): pytanie 4/span 8, „+” w 12, odpowiedź 4/span 7.
Wiedza: kafle 1 kolumna → 2 (640 px) → 3 (1024 px), odstęp 56 px pion / 16 px poziom (`--event-gap`); od 768 px „Zobacz wszystko →” po prawej, na linii dołu `h2`.

`ServicesList`: hover wiersza tylko w CSS (`@media (hover: hover)`): `.item:hover` ustawia tło `--accent`, kolor `--on-accent`
i `--muted: #3F4A12`, a `.name` / `.desc` dostają `translateX(12px)` (0.4 s `--ease`). `.name` / `.desc` mają tam stały
`padding-right: 24px` (zapas na przesunięcie, tekst nie wychodzi poza limonkę). Wiersze nie są fokusowalne (brak linków),
więc nie ma stanu fokusu. Przy reduced motion wcięcie 12 px zostaje, tylko bez animacji.

#### `KnowledgeTeaser` — server
```ts
interface KnowledgeTeaserProps {
  id: string; label: string; title: string;  // kotwica, etykieta mono, `h2` (`${id}-heading`)
  more: { label: string; href: string };     // „Zobacz wszystko →” do `/wiedza`
  items: readonly TeaserEvent[];             // `teaserEvents(events, todayIso(), 3)`: najbliższe nadchodzące + najnowsze minione
  tone?: "light" | "dark";                   // domyślnie dark
  className?: string;
}
```
Kafle `EventTile` w wariancie z danych (`upcoming` / `past`), tylko wydarzenia z `featured: true` (`teaserEvents`). Placeholdery widoczne jak na `/wiedza`. Brak minionych → dopełniają dalsze nadchodzące.

#### `ProcessSection` — client
```ts
interface ProcessSectionProps {
  id: string;                     // kotwica; nagłówek dostaje `${id}-heading` (aria-labelledby)
  label: string;
  steps: readonly { no: string; title: string; text: string }[];   // ProcessSectionStep z @/content/process
  tone?: "light" | "dark";        // domyślnie light
  className?: string;
}
```
Ogólny proces współpracy (strona główna). Kroki jako lekkie kolumny jak `FactRow`: kreska 1 px (`--ink` 18%) nad krokiem,
numer mono `--muted` (`aria-hidden`, kolejność niesie `<ol>`), tytuł `h3` w roli title, opis `--muted`. Bez kafli i bez reveal.
Kroki w `<ol>`: każdy `li` zajmuje 3 wiersze siatki (`grid-template-rows: subgrid`), więc numer, tytuł i opis stoją w rzędzie w jednej linii
(1 → 2 → 4 kolumny). Padding kroku `16px 24px 16px 0` na każdym urządzeniu: 24 px z prawej to zapas na przesunięcie
(podświetlenie nie zmienia łamania tekstu); tło `background-clip: padding-box` (kreska 1 px zostaje nad limonką).
Hover tylko w `@media (hover: hover)`: `--accent`, tekst `--on-accent`, `--muted: #3F4A12`, dzieci `translateX(12px)`, 0.4 s `--ease`.
Na limonce (hover i `.active`) w tle pojawia się duży numer kroku (`.ghost`, `aria-hidden`): prawy dolny róg, ucięty krawędzią,
700 `clamp(7rem, 11vw, 11rem)`, kolor `--on-accent` 8%; wjeżdża 16 px z dołu z fade, 0.6 s. Leży pod treścią (`li` ma `isolation: isolate`,
`overflow: hidden`, numer `z-index: -1`).
Przebieg (`useSweep` z `loop`): gdy lista jest w widoku (IO, `rootMargin` −40% od dołu), kroki podświetlają się po kolei w pętli
(`.active`: to samo co hover, także na dotyku): start po 300 ms, 1400 ms na krok (cykl 5,6 s); po wyjściu z widoku gaśnie, po powrocie rusza od 01.
Hover na kroku ma pierwszeństwo (`:has()`). Bez przycisku pauzy (decyzja projektowa): cykl 5,6 s przekracza próg WCAG 2.2.2.
Nic nie jest fokusowalne (bez tabindex, bez `data-cursor`). Reduced motion: bez przebiegu (hook sprawdza preferencję przy każdym starcie),
wcięcie 12 px i numer w tle na hover bez animacji.
Nie myl z `ProcessSteps` (case Automation House: 5 kroków, nazwa kroku to przycisk rozwijający opis, `aria-expanded`).
```tsx
<ProcessSection id="proces" label={processSection.label} steps={processSection.steps} />
```

#### `FaqSection` — server
```ts
interface FaqSectionProps {
  id: string;                     // kotwica; nagłówek `${id}-heading`
  label: string;
  items: readonly FaqItem[];      // już przefiltrowane: publishedFaq()
  more?: FaqMore;                 // { before; link: { label; href }; after? }, bez własnego CTA
  tone?: "light" | "dark";
  className?: string;
}
```
Natywne `<details>/<summary>` (zero JS, Tab + Enter/Spacja): pytanie w `h3` (`--t-title`), bez numeru i licznika,
„+” w mono obracany do „×” przy `[open]` (off przy reduced motion). Wiersze z obrysem 1 px (`--ink` 18%) jak w `ServicesList`,
hover tylko w `@media (hover: hover)`: `--accent`, `--on-accent`, `--muted: #3F4A12`, pytanie `translateX(var(--indent))` (12 px, od 1024 px 6 px), „+” `translate: -12px 0` (osobno od `transform`, który niesie obrót), stały `padding-right: 24px` pytania jako zapas, 0.4 s `--ease`; fokus: obrys 2 px `--ink`; reduced motion: wcięcie bez animacji. Bez reveal (tylko nagłówek sekcji).
Pytania z placeholderem `[…]` odfiltrowuje `publishedFaq()` (i w UI, i w JSON-LD `FAQPage`).
`more` składa zdanie z `before`, linku `ArrowLink` (`underline`, bez strzałki) i opcjonalnego `after`; „na rozmowie”
prowadzi do `#kontakt`, więc `SmoothScroll` przewija i przenosi fokus na stopkę.

---

### Podstrona `/o-nas`

Źródło: `legacy/o-nas-v5.html`. Kolejność: `PageHero` → `TeamSheets` → `Marquee` → `RolesSplit` → `FindSection #social` →
`FindSection #posty` → `FindSection #wydarzenia` (zajawka `/wiedza`) → `StickerBoard #play`. Klienckie są tylko `Reveal`, `CopyEmail`, `ScrambleLink` (w `SocialLinks`) i `DragSticker`.
CTA kontaktu: w `PageHero` (`cta`) i na końcu `RolesSplit`.

#### `PageHero` — server
```ts
interface PageHeroProps { lines: readonly string[]; lead: string; cta?: boolean /* ContactCta pod leadem */ }
```
Jasne hero podstron `/o-nas` i `/wiedza` (legacy `.team-hero`): `Reveal trigger="intro"`, `<h1>` display w liniach
(`max-width: 12ch`, `min-width: min-content`; `.line` ma `padding-inline-end: 0.04em`, więc najdłuższe słowo i ostatnia
litera nie są ucinane) i lead statement (`--muted`, `max-width: 30ch`). Od 1024 px h1 zajmuje 1/span 7, a lead
8/span 5 i jest dosunięty do dołu.
`cta` (domyślnie bez): `ContactCta` pod leadem, stagger po leadzie; od 1024 px w kolumnie 8/span 5. Włączone na `/o-nas`, na `/wiedza` bez.
```tsx
<PageHero lines={aboutHero.lines} lead={aboutHero.lead} cta />
```

#### `TeamSheets` / `RolesSplit` / `StickerBoard` — server, bez propsów
- `TeamSheets` (legacy `.sheets`): ciemny pas (`--dark`), karty `--shade-900`: Magda i Kuba z `people`, trzecia karta agentów AI. Każda karta w osobnym `Reveal`.
  Poniżej 900 px jest jedna kolumna, a kadry portretów 3:4 mają `max-height: 60svh`; `object-fit: cover` i
  `object-position` biorą punkt twarzy z `photo.focus`. Od 900 px `.cell` i karta (`className`) to subgrid wierszy
  `.sheets`: 900–1199 px dwie kolumny i układ poziomy (`span 5`), przy czym trzecia karta zajmuje cały ostatni rząd;
  od 1200 px trzy pionowe karty (`span 6`) ze zdjęciem 4:3. Karty w rzędzie mają zdjęcia, role, bio, fakty i linki na
  tej samej wysokości mimo różnej liczby linii w nazwie.
  Zdjęcie: gdy `personCards[id].photo` istnieje (Magda i Kuba), `next/image` z klasą `.photo`
  (`sizes="(min-width: 1200px) 33vw, (min-width: 900px) 17vw, 100vw"`, bez `priority`); inaczej `PhotoPlaceholder`
  z `photoLabel`. Agenci AI: `PhotoPlaceholder` 16:9 na każdej szerokości, z robotem (`AgentIllustration`,
  `currentColor`), wygląd z `variant="ai"`. Hover linków jest tylko w `@media (hover: hover)`.
- `RolesSplit` („Kto co robi”): każdy wiersz to `Reveal` ze `style={{ "--v": "92%" }}`; romb (18 px, obrót 45°) jedzie od 50% do `--v`
  po `is-in`. Legenda z `people[].givenName`. Nagłówek to `<h2>` w mono.
  Pod wierszami `ContactCta` w osobnym `Reveal` (`margin-top: 48px`); wiersze są w wrapperze `div`, żeby `.row:last-child` dawał dolną linię.
- `StickerBoard` (`#play`): cała sekcja to `Reveal as="section"`. 6 naklejek z `STICKERS`, każda to `DragSticker`
  z `index` (0–4, przycięty modulo) dla fade-in stagger. Pozycje startowe w `stickerPlay.spots`: `landscape` z legacy (od 768 px w poziomie)
  i `portrait` (telefon, tablet w pionie: rogi i szew zdjęć); CSS przycina je do planszy, a w pionie skaluje bok (`--s`, px bez jednostki)
  z szerokością ekranu. Naklejki to dekoracja: `aria-hidden`, poza kolejnością Tab (decyzja właściciela,
  audyt 2026-09-26), przeciąganie tylko wskaźnikiem i palcem. Zdjęcia z `people` + `personCards[id].photo`: `next/image`
  (3:4 `cover`, `object-position` z `photo.focus`, `draggable={false}`, `pointer-events: none`; naklejki `z-index: 3` nad nim); bez zdjęcia `PhotoPlaceholder` z imieniem (Kuba limonkowy);
  blok zdjęć ma `.fade`.

#### `Marquee` / `MarqueeLoop` — server (Reveal + CSS)
```ts
interface MarqueeProps { items: readonly string[]; copies?: number /* 4 */; className?: string }
interface MarqueeLoopProps { children: ReactNode; copies?: number /* 4 */; className?: string }
```
`MarqueeLoop`: sama pętla. `copies` kopii `children` w rzędzie, tor jedzie liniowo o połowę (`translate -50%`), tempo z `--marquee-duration`
(domyślnie 22 s; ustawia je klasa okna). Połowa toru musi być szersza niż okno (stąd 4 kopie). Pierwsza kopia czytelna, kolejne `aria-hidden`.
Stoi przy reduced motion. Używają jej `Marquee` i logotypy partnerów w `AboutSection`.
`Marquee`: limonkowy pasek (legacy `.marquee`, h2 wersalikami, „✦” zawsze `aria-hidden`), 22 s.
Cały pasek jest w `Reveal` z `.fade` (fade-in on-scroll); pętla używa `translate`, reveal używa `transform`, więc się nie gryzą.
```tsx
<Marquee items={marqueeItems} />
<MarqueeLoop className={styles.clientsMarquee}><ul aria-labelledby={id}>…</ul></MarqueeLoop>
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
Legacy `.find`: nagłówek (sticky ≥ 1024 px) + lista wierszy. Hover (`@media (hover: hover)`) i `:focus-visible`
dają limonkowe tło (`--muted: #3F4A12`) oraz przesuwają tytuł o 12 px przez `translateX` bez reflow; e-mail
(`findCopyClassName`) dostaje `text-indent: 12px`. Wiersz (`FindItem`) ma tytuł, opcjonalny `kicker` (linia mono nad
tytułem, `--muted`) i `meta` po prawej bez łamania i kurczenia (`white-space: nowrap`, `flex-shrink: 0`;
`metaMono` → mono 12 px). Strzałki jadą do środka wiersza: zewnętrzne i „⧉” `translate(-8px, -4px)`, wewnętrzne
„→” `translateX(-8px)`.
Linki zewnętrzne przez `externalLinkProps` (nowa karta), wewnętrzne (`/…`) przez `next/link` w tej samej karcie
(placeholdery: [Linki-placeholdery](#linki-placeholdery)).
```tsx
<FindSection {...findUs} tone={posts ? "light" : "dark"}
  extra={<CopyEmail email={site.contact.email} className={findCopyClassName} />} />
{posts ? <FindSection {...posts} tone="dark" /> : null}
<FindSection {...publishedEventsTeaser(todayIso())} tone="light" />
```
`#wydarzenia` (`publishedEventsTeaser` z `about.ts`) jest zawsze jasne: do 3 najbliższych wydarzeń bez `[…]`
(wiersz: kicker „17–18.11.2026 · Katowice” nad tytułem, „→” po prawej → `/wiedza#<id>`) + „Wszystkie wydarzenia →”
(`/wiedza`). `#posty` jest ciemne; `#social` ciemne bez postów, jasne z postami. Strona ma `revalidate = 3600`.

#### `DragSticker` — client
```ts
interface DragStickerProps {
  svg: string; landscapeSpot: readonly [number, number]; portraitSpot: readonly [number, number]; // [left %, top %]
  size: number; rotate: number; // size: bok w px w poziomie (w pionie skalowany z szerokością ekranu)
  index?: number; // stagger fade-in reveal (`.fade` + `--i`); wołający przycina (np. modulo 5)
}
```
- Pointer Events z `setPointerCapture` (mysz, dotyk, pióro); `touch-action: none` na naklejce, `pan-y` na sekcji.
- Bez klawiatury i bez roli: `aria-hidden="true"`, brak `tabIndex` (Tab nie skacze po planszy).
- Pozycja żyje w DOM (`left/top` w px), bez re-renderu na ruch. Reduced motion: bez przejść `scale`/`rotate`.
- Sekcja nie ma `data-stickers`, więc naklejki spod kursora tu nie działają.

---

### Podstrona `/wiedza`

Zakładka „Wiedza” (nowa strona, bez wzorca w legacy): „Przekazujemy wiedzę dalej”, minione i nadchodzące warsztaty, prelekcje, meetupy.
Kolejność: `PageHero` → `EventsSection #nadchodzace` (ciemna) → `EventsSection #minione` (jasna) → stopka.
Dane z `src/content/events.ts`; podział `splitEvents(events, todayIso())`: ostatni dzień (`endDate ?? date`, `YYYY-MM-DD`) ≥ dziś
(Europe/Warsaw) → nadchodzące (najbliższe pierwsze), reszta → minione (najnowsze pierwsze). `revalidate = 3600`: kafel sam przechodzi
do minionych po swoim ostatnim dniu.

#### `EventsSection` — server
```ts
interface EventsSectionProps {
  id: string; label: string;                 // nagłówek `h2` mono `${id}-heading`, licznik „01–0N” z długości listy
  events: readonly KnowledgeEvent[];         // posortowane przez splitEvents
  variant: "upcoming" | "past";              // upcoming: 1 → 2 kolumny (768 px), gap 16 (`--event-gap`); past: 1 → 2 (640) → 3 (1024), gap 56/16
  empty?: string;                            // zdanie zamiast kafli; bez niego pusta sekcja zwraca null
  footer?: ReactNode;                        // pod listą (lead), np. „Organizujesz wydarzenie? Zaproś nas →” (#kontakt)
  tone?: "light" | "dark"; className?: string;
}
```
Każdy kafel w osobnym `Reveal as="li"`. Nadchodzące zawsze się renderują (`empty`: „Na razie nic nie planujemy.”), minione znikają bez danych.

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
| `ProcessSteps` | client | `.steps` | AH |
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
Sekcja pełnej szerokości: wiersz mono (etykieta `<h2>` przez `SectionLabel`: numer `aria-hidden`, nagłówek = nazwa; `aside` po prawej, 48 px odstępu), `Reveal` tylko na nagłówku,
`children` (zwykle organizm z własnym `Reveal`) pod spodem.
```tsx
<CaseStrip label="05 / W liczbach" aside="Stan: wrzesień 2026"><CaseNumbers items={ourmoneyNumbers} /></CaseStrip>
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
Komponent renderuje wszystko, co dostanie: strona podaje `publishedNumbers(items)` (bez `[…]`) i pomija cały
`CaseStrip`, gdy zostaje mniej niż `MIN_CASE_NUMBERS`. Poniżej 900 px są dwie kolumny, a przy nieparzystej liczbie
ostatni kafel zajmuje pełną szerokość. Od 900 px `grid-auto-flow: column` + `grid-auto-columns: minmax(0, 1fr)` daje
tyle równych kolumn, ile jest kafli. `CountUp` animuje 0 → `end` po wejściu w viewport (0.6); SSR i czytniki
dostają `end`, reduced motion = bez animacji.

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
`RolePath` ma jedną kolumnę poniżej 900 px i dwie od 900 px, tak jak sąsiednie sekcje `/aion-mind`.

#### `JournalScreen` — client
```ts
interface JournalScreenProps { className?: string }
```
Rekonstrukcja ekranu Dziennika AION MIND (maj 2026) w `PhoneFrame`. Dane i arytmetyka dat w `journal.ts`, bez `toLocale*` (brak rozjazdu SSR/klient).
- Kalendarz: `role="grid"` → `row` → `columnheader` / `gridcell` (`aria-selected`) z przyciskiem dnia.
- Klawiatura: roving tabindex; ←/→ ±1 dzień, ↑/↓ ±7, Home/End tydzień (z Ctrl: siatka), Enter/Spacja/klik → „Tydzień N” (ISO 8601) w `aria-live`.
- Karty podsumowań: `aria-pressed`, komunikat w `role="status"` (toast 1,6 s).
- Toast: blokiem zawierającym jest ekran (`.jr` ma `position: relative`), `max-width: calc(100% - 8px)`, dłuższy komunikat łamie się (`text-wrap: balance`).
- Paleta, zaokrąglenia i małe rozmiary px to ekran aplikacji (stałe z legacy, zmienne `--jr-*`), krój `var(--sans)`.

#### `LiveFrame` — client
```ts
interface LiveFrameProps {
  src: string; title: string; urlLabel: string;   // urlLabel: sam host, np. „www.busybeefilm.pl”
  poster: Required<CaseStudyImage>;
  loadLabel?: string;        // domyślnie „Otwórz na żywo ↗”
  loadAriaLabel?: string;    // „Załaduj żywą stronę <host>”
  className?: string;
}
```
Limonkowa scena z ramką przeglądarki, własny `Reveal`; stawiaj zaraz pod hero. Okno `.viewport` ma `role="group"`
i `aria-label={title}`. `iframe` 1440×900 jest skalowany (`ResizeObserver`, `--s = szerokość / 1440`), ma
`loading="lazy"`, `referrerPolicy="no-referrer"` i `sandbox="allow-scripts allow-same-origin"`. Pasek adresu
(mono 12 px, `--t-mono-sm`) to link do strony w nowej karcie na całą wysokość paska 48 px.
Ramka nigdy nie ładuje się sama: poster pozostaje nieprzyciemniony, bez nakładki na całość, a przycisk
„Otwórz na żywo ↗” / „Załaduj” leży w prawym dolnym rogu i tylko on ładuje `iframe`. Ma min. 48 px; na telefonie
`right` / `bottom: 8px`, padding 12/16. Hover (`@media (hover: hover)`) unosi go o 2 px jak `Button`, a
`:focus-visible` daje obrys accent z ciemną obwódką.
Poniżej 768 px przycisk jest linkiem do strony w nowej karcie (zamiast ramki w skali ~0,25). SSR renderuje poster
z przyciskiem, tryb ustala się po hydratacji. Po załadowaniu fokus trafia z `preventScroll` na okno
(`tabIndex={-1}`), które dostaje obrys 2 px `--accent` z offsetem 2 px w ciemnej obwódce ramki. Żywa ramka ma
`data-native-cursor` (kursor systemowy, patrz `Cursor`).
```tsx
<LiveFrame {...otbLive} />
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
Pionowe kółko i pionowy swipe nad taśmą przewijają stronę (`overscroll-behavior-y: auto` nadpisuje `contain` z `[data-lenis-prevent]`), w poziomie `contain`.

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
`touch-action: none` tylko na kuli. Korzeń to `<figure>` (tu trafia `className`); podpis `caption` jako `TileCaption` pod polem,
nie na nim (paleta pola nie daje stałego kontrastu).

#### `ToySwitcher` — client
```ts
interface ToySwitcherProps { toys: readonly { name: string; tag: string; caption: string; image: Required<CaseStudyImage> }[]; ariaLabel: string; className?: string }
```
Wzorzec ARIA tabs: w DOM `tablist` (vertical) + `tab` z roving tabindex przed jednym `tabpanel` (`<figure>` z
`TileCaption`); ↑ ↓ ← → Home End. Poniżej 1024 px podgląd jest wizualnie nad listą (`order: -1`), bez zmiany DOM.
Aktywny wiersz ma `justify-content: flex-start`: strzałka i nazwa zaczynają się z lewej, a tag idzie w prawo przez
`margin-left: auto`. Przenikanie obrazów 0.5 s (bez przy reduced motion), hover tylko w `@media (hover: hover)`.

#### `SpecList` — server
```ts
interface SpecListProps { items: readonly { term: string; value: string; chip?: string; href?: string }[]; variant?: "rows" | "tiles"; className?: string }
```
`<dl>` z `FactRow`. `rows` = legacy `.spec` (wielkie wiersze), `tiles` = legacy `.facts` (Sassy). Stagger przez
`nth-child`; musi być w `Reveal`. Linki w `rows` dostają ten sam efekt przy `:focus-visible` oraz hoverze wewnątrz
`@media (hover: hover)`; ich wartość składa `LinkText`, więc domena nie łamie się na dywizie i strzałka nie zostaje sama.
`rows`: poniżej 768 px jedna kolumna (termin nad wartością, odstęp 8 px), 768–1023 px
`minmax(0,1fr) minmax(0,2fr)`, od 1024 px `minmax(0,4fr) minmax(0,8fr)`; długie wartości i linki łamią się
(`overflow-wrap: break-word`).

#### `ProcessSteps` — client
```ts
interface ProcessStepsProps { steps: readonly { title: string; text: string }[]; ariaLabel?: string; className?: string }
```
`<ol>` z licznikiem 01–05; nazwa kroku w `h3`, w niej `<button aria-expanded aria-controls>` (klikalny cały kafel przez `::after`,
obrys fokusu 2 px `--on-accent` na kaflu). Enter / Spacja / klik rozwija opis `<p>` (jeden krok naraz); zwinięty opis ma `visibility: hidden`
(poza drzewem dostępności). Hover myszą podgląda opis jak dawniej. Bez hovera (`useMediaQuery("(hover: hover)", true)` = false):
bez przycisków, `h3` z samą nazwą, opisy widoczne od razu (serwer renderuje przyciski, CSS `hover: none` pokazuje opisy przed hydratacją).
Po wejściu w widok (`useSweep`: IO, `rootMargin` −40% od dołu, raz) kroki podświetlają się po kolei (`.active`: limonka jak hover, opis zwinięty,
bo rozwinięcie podnosi rząd): start po 600 ms, 700 ms na krok, potem wszystkie gasną (≈ 3,5 s, poniżej progu WCAG 2.2.2).
Hover / fokus na kroku mają pierwszeństwo (`:has()`), off przy reduced motion.

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
    ownership: CaseOwnership;               // wymagane; przy employment termin roli to „Rola”
    facts: readonly CaseStudyFact[];        // dodatkowe fakty po standardowych
    datePublished?: string;
  };
  children: ReactNode;
  cta?: { tone?: "light" | "dark" /* domyślnie dark */; title?: string; text?: string };
  next?: { href: string; title: string; arrow?: "→" | "↗" };
}
const CASE_SUMMARY_TERMS: { role: "Rola no-fuss"; roleEmployment: "Rola"; scope: "Zakres"; time: "Czas"; client: "Klient"; result: "Wynik" };
const CASE_CTA_COPY: { title: "Chcesz podobny projekt?"; text: "Opowiedz, co chcesz zbudować, a powiemy, od czego zacząć." };
function caseHeroFacts(summary: CaseStudySummary, facts: readonly CaseStudyFact[], ownership: CaseOwnership): CaseStudyFact[];
type CaseStudySectionProps =
  | { label: string; tone?: "light" | "dark"; id?; className?; layout?: "wide"; children: ReactNode }
  | { label: string; tone?: "light" | "dark"; id?; className?; layout: "split"; text: ReactNode; visual: ReactNode; flip?: boolean }
  | { label: string; tone?: "light" | "dark"; id?; className?; layout: "lite"; hint?: ReactNode; hintTouch?: ReactNode; bleed?: boolean; children: ReactNode };
```
Hero: kicker to `<p class="mono">` z chipem „Case study”, tytuł `h1` mega, lead statement, fakty w `<dl>` (`FactRow`, mono-sm).

**Fakty hero** (`caseHeroFacts`): najpierw standardowe z `summary` w stałej kolejności. Dla `ownership: "own"` /
`"client"` pierwszy termin to „Rola no-fuss”; dla `ownership: "employment"` (AION MIND, Automation House) „Rola”.
Dalej: „Zakres” → „Czas” → „Klient” (jeśli `client`) → „Wynik” (jeśli `result`, może mieć `href`), potem `facts`.
Wiersz z `facts` o terminie standardowym jest pomijany. Brak danych = brak wiersza, nigdy placeholder. Wartość roli
mówi uczciwie, co zrobiło studio albo osoba na etacie, z nazwiskami osób spoza no-fuss (Busy Bee: kod Michał
Gabryelewicz; OTB: design z Piotrem Chuchłą; AION MIND: „— (etat Magdy, nie projekt no-fuss)”; Automation House:
„Kod: Kuba (etat w Automation House), design: Magda”, bez „Klient”, bo to pracodawca Kuby). „Wynik” tylko jako fakt.

**Blok CTA** (zawsze, przed „Następny projekt”): `Reveal as="section"` z `aria-labelledby`, klasa `section` + `tone-dark`
przy `cta.tone: "dark"`. Nagłówek `h2` w roli h2 („Chcesz podobny projekt?”, `--i:0`), jedno zdanie w roli lead
(`--muted`, `--i:1`), `ContactCta index={2} note` („Porozmawiajmy →” do `#kontakt` w stopce z layoutu, więc kotwica
działa na każdej stronie). `cta.tone` ustawiaj **przeciwnie do ostatniej sekcji** case'u (szablon nie zna tonu `children`).
Rytm tonów idzie od hero do stopki: `/ourmoney` od `03.5` ma jasne `03.5`, ciemne `04`, jasne `05`, ciemne `06`, jasne
`07` i ciemne CTA. `/otb`, `/busy-bee` i `/automation-house` mają `01` ciemne, `02` jasne, `03` ciemne, `04` jasne
i CTA ciemne.

**Następny projekt**: `NextTitle` trzyma ostatnie słowo + twardą spację + strzałkę w `.nextLast` z `nowrap`, więc
strzałka nie zostaje sama. Tytuł ma `--t-mega`, ale do 479 px przechodzi na `--t-display` (40 px), żeby
„AUTOMATION” i „OURMONEY →” nie wychodziły poza `.line`.

| `layout` | Legacy | Układ |
|---|---|---|
| `wide` (domyślnie) | `.cs-block` + `.cs-wide` | etykieta mono (`MonoLabel` z `SectionLabel`: numer `aria-hidden`, kolumny 1–2), treść w kolumnach 3–12 od 1024 px |
| `split` | `.cs-block` + `.cs-txt` / `.cs-vis` | tekst sticky (3–6) + wizualizacja (8–12); `flip` zamienia strony |
| `lite` | `.lite` / `.cs-lite` | wiersz mono: etykieta jako `<h2>` (`--i:0`, `SectionLabel`: nagłówek dla czytnika to sama nazwa, numer `aria-hidden`), `hint` po prawej (`--i:1`); `hintTouch` zastępuje `hint` przy `@media (hover: none)` (sam CSS), np. AH: `hint="Rebranding · najedź na krok" hintTouch="Rebranding"`; pod spodem treść na pełną szerokość, odstęp 24 px; `bleed` = treść od krawędzi do krawędzi (nagłówek z gutterem) |

Wariant `lite` (case studies stron): treść w środku daj w `<Fade index={2}>`. `.cs-lite` (OTB, Sassy) ma 32 px odstępu:
strony nadpisują klasą `section.csLite` w `page.module.css`.
```tsx
<CaseStudyLayout
  hero={{ kicker: otb.kicker, title: otb.title, summary: otb.summary, ownership: otb.ownership, facts: otb.facts, datePublished: otb.datePublished }}
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
| `/` | `app/page.tsx` | `no-fuss-v5` | `HomeHero` → `ServicesList` → `ProcessSection #proces` → `WorkGrid` → `AboutSection` → `KnowledgeTeaser #wiedza` → `TestimonialsSection` (ukryta bez opinii) → `FaqSection #faq`; `revalidate = 3600` | `homeGraphNodes()`: `ItemList #realizacje`, `OfferCatalog #uslugi`, `Review` (tylko nie-placeholdery, teraz 0), `FAQPage #faq` (`publishedFaq()`) |
| `/o-nas` | `app/o-nas/page.tsx` | `o-nas-v5` | `PageHero` → `TeamSheets` → `Marquee` → `RolesSplit` → `FindSection` ×3 (`#wydarzenia`: zajawka `/wiedza`) → `StickerBoard`; `revalidate = 3600` | `BreadcrumbList` + `AboutPage #webpage` (`mainEntity` → Organization, `mentions` → Person) |
| `/wiedza` | `app/wiedza/page.tsx` | — (nowa) | `PageHero` → `EventsSection #nadchodzace` → `EventsSection #minione`; `revalidate = 3600` | `BreadcrumbList` + `CollectionPage #webpage` (`hasPart` → `Event`) + `Event` na wydarzenie bez `[…]` z miejscem albo online (`performer` → Person, `organizer` = `host`) |
| `/ourmoney` | `app/ourmoney/` | `case-ourmoney-v2` | `CaseStage` phones, wide/split, `SplitCalculator`, `CaseScreens`, `CaseNumbers`, `TechStack` | `BreadcrumbList` + `CreativeWork` (`about` → app) + `SoftwareApplication` (`FinanceApplication`, oferty 24,99 / 249,99 PLN) |
| `/aion-mind` | `app/aion-mind/` | `case-aion-mind-v1` | `CaseStage` image, `JournalScreen`, `GuideCards`, `RolePath`, `CaseNumbers` | jak wyżej, `LifestyleApplication`, `installUrl` = sklepy, `contributor` = Magda, `publisher` = `Organization` AION MIND z `employee` = Magda (etat, nie produkt no-fuss) |
| `/busy-bee` | `app/busy-bee/page.tsx` | `case-busybee-v3` | `LiveFrame` → lite: `CaseStory`, `FilmStrip` (podpis: reklamy Busy Bee dla ich klientów), `PhoneScroller`, `SpecList` | `BreadcrumbList` + `CreativeWork` (`about.url` = żywa strona) + `WebSite` klienta |
| `/automation-house` | `app/automation-house/page.tsx` | `case-automation-house-v1` | `LiveFrame` → lite: `CaseStory`, `ProcessSteps`, `PhoneScroller`, `SpecList` (termin „Firma”, nie „Klient”) | `BreadcrumbList` + `CreativeWork` (`about.url` = żywa strona, `contributor` = Kuba i Magda) + `WebSite` z `publisher` = `Organization` Automation House by Tigers z `employee` = Kuba (etat, nie klient no-fuss); bez `SoftwareApplication` |
| `/otb` | `app/otb/` | `case-otb-v2` | `LiveFrame` → lite: `CaseStory`, `DragBall`, `PhoneScroller`, `SpecList` | jak Busy Bee |
| `/sassy` | `app/sassy/` | `case-sassy-v2` | `LiveFrame` → lite: `CaseStory`, `ToySwitcher`, 2 × `PhoneFrame`, `SpecList tiles` | jak Busy Bee, `WebSite.author` = Magda |
| 404 | `app/not-found.tsx` | `404` | `NotFoundHero`, `FellowshipMap` | — |

Każdy case kończy się blokiem CTA z szablonu, potem „Następny projekt”.
Metadane case studies: `buildMetadata({ path, type: "article", description: caseDescription(c), images: [cover] })`.
`caseDescription` zwraca `CaseStudy.description` (do 155 znaków: co zrobiło no-fuss i dla kogo); tytuł bez zmian z `routes.ts`. `images` na poziomie strony wygrywa z `app/opengraph-image.tsx`. FAQ: tylko strona główna (`FAQPage` z `faq("/", …)` w `homeGraphNodes()`, `@id` = `/#faq`).

## Treść (`src/content`)

| Plik | Co |
|---|---|
| `site.ts` | `site` (w tym `contact: SiteContact` = `{ email, calendarUrl, responseNote }`, `homeTitle` = tytuł `/`, `brandTitle` = podpis OG i nazwa w manifeście, `description`), `people`, `products` (tylko produkty własne no-fuss: OurMoney; AION MIND to etat Magdy, adres w `cases/aion-mind.ts`), `isPlaceholder()` |
| `routes.ts` | `routes` (`source: null` = strona bez wzorca w legacy, np. `/wiedza`), `caseOrder`, `getRoute`, `getNextCase`, `getNavSection` |
| `navigation.ts` | `mainNav` (Usługi, Realizacje, O nas, Wiedza, Kontakt): od 768 px w wierszu HUD, niżej w `MobileMenu` |
| `types.ts` | typy współdzielone (`CaseStudy`, `CaseStudySummary`, `CaseStudyStory`, `SocialLink`, `Person`…) |
| `home.ts` | `hero` (lead, akapit o duecie), `about`, `work` (kafle), `servicesSection`, `testimonialsSection`, `publishedTestimonials()`; typy `WorkTile`, `SizedImage` (portrety w `#o-nas` biorą się z `personCards` w `about.ts`) |
| `home-jsonld.ts` | węzły JSON-LD strony głównej (`workItemList`, `servicesCatalog`, `reviews`, `faqPage`). W `workItemList` `creator` = no-fuss zawsze (ten sam `@id` co `CreativeWork` na stronie case'u); `employment` (AION MIND, Automation House) dokłada `contributor` = Person z `employer.employee`, a `about` → `SoftwareApplication` (`softwareAppId`) tylko przy `softwareApp: true` (AION MIND; `publisher` = pracodawca jest na stronie case'u). Bez flagi `about` nie powstaje, więc nie ma wiszącego `@id` |
| `events.ts` | treść `/wiedza`: `eventsHero`, `eventsDescription`, `upcomingSection`, `pastSection`, `knowledgeTeaser` (zajawka na `/`), `events` (`KnowledgeEvent`: `id`, `title`, `format`, `date` `YYYY-MM-DD` (minione bez znanego dnia: `YYYY-MM` → „06.2026”), `endDate?` (wielodniowe), `time?`, `host?`, `place?` (miasto), `venue?` (obiekt, np. „PGE Narodowy”), `online?`, `people`, `text?`, `link?`, `logo?` (jasne, bez tła; nadchodzące: róg kafla, minione: róg zdjęcia), `photo?` (minione), `featured?` (zajawka na `/`)), `todayIso()` (Europe/Warsaw), `splitEvents()`, `teaserEvents()`, `isPublishedEvent()`, `eventDate()`, `eventPeople()`. Bez `host` / `place` / `text`: „Gdzie” z tego, co jest (pusty wiersz się nie renderuje), bez opisu. Łącznik, przy którym tytuł nie może się łamać: `WJ` (word joiner) po nim, JSON-LD go usuwa |
| `events-jsonld.ts` | `eventsGraphNodes()`: `CollectionPage` + `Event` (tylko `isPublishedEvent` z `place` albo `online`: stacjonarne bez miejsca zostają tylko w UI, bo Google wymaga `location`; `endDate` u wielodniowych, `image` z `photo`, `Place.name` = `venue ?? place`, bez `host` bez `organizer`, bez `text` bez `description`) |
| `process.ts` | `processSection` (label, 4 kroki `ProcessSectionStep`) dla `ProcessSection` |
| `faq.ts` | `faqSection` (label, `more`, pytania `FaqItem`), `publishedFaq()` (bez placeholderów `[…]`) |
| `about.ts` | treść `/o-nas` (`aboutHero`, `personCards`, `aiCard`, `marqueeItems`, `rolesSplit`, `findUs`, `linkedinPosts`, `eventsTeaser` + `publishedEventsTeaser(today)`); opcjonalne `personCards[id].photo` (`AboutPhoto`: `src`, `width`, `height`, `alt`, `focus` = `object-position` twarzy we wszystkich kadrach: źródło 1:1, więc `x` działa w kadrach 3:4, `y` w 4:3), dziś Magda i Kuba (`/assets/team/magda.avif`, `kuba-v2.avif`, 1254×1254; podmiana zdjęcia = nowa nazwa pliku, bo `/_next/image` i CDN cache'ują po `src`), trafia też do `image` w JSON-LD `Person` |
| `cases/index.ts` | `cases` (6 × `CaseStudy` w kolejności `caseOrder`), `getCase(path)`, `CasePath`, `caseDescription(c)` |
| `cases/<slug>.ts` | `CaseStudy` + dane bloków (`*Live`, `*Phone`, `*Spec`, `*Next`, obrazy, liczby…) |

Nowe pola `CaseStudy` (wymagane, poza `story`):
```ts
interface CaseStudySummary {            // fakty standardowe hero, kolejność stała
  role: string;                         // wartość pierwszego faktu; termin „Rola no-fuss”, przy employment „Rola”
  scope: string;                        // „Zakres”
  time: string;                         // „Czas”, z kickera legacy: „06.2025”, „01.2025 → teraz”
  client?: string;                      // „Klient” + branża; brak = wiersz pominięty
  result?: { value: string; href?: string }; // „Wynik”: tylko fakt (działająca strona)
}
interface CaseStudyStory { problemTerm: "Problem" | "Zadanie"; problem: string; done: string; effect: string }
type CaseOwnership = "own" | "client" | "employment"; // own: OurMoney, Sassy; client: Busy Bee, OTB; employment: AION MIND (Magda), Automation House (Kuba)
interface CaseEmployer { name: string; url: string; employee: Person["id"] } // tylko przy "employment"
interface CaseStudy { …; ownership: CaseOwnership; employer?: CaseEmployer; softwareApp?: true /* strona case'u ma węzeł SoftwareApplication (#app) */; summary: CaseStudySummary; facts: readonly CaseStudyFact[] /* dodatkowe */; story?: CaseStudyStory; description: string }
```
Zasada: tylko fakty z `legacy/case-*.html` i repo. Bez danych (wynik, kod OTB) pole zostaje puste i nic się nie renderuje.
| `cases/software-app.ts` | `softwareApplication()`, `softwareAppId()` — węzeł `SoftwareApplication` |

Kafle `work.tiles` są wyprowadzone z `cases` (`tileLabel` → `title`, `title` → `name`, `years`, `kind`, `cover`):
w `home.ts` zostaje tylko układ (`size`, `offset`, `square`, `screens`) i okładka OurMoney (inny `alt` niż w case'ie).
Kolejność kafli jest z legacy (inna niż `caseOrder`), poza Sassy przeniesionym na koniec.
Wymiary obrazów to realne piksele (`sips`); helper `img()` w plikach case'ów
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
| `useIntroDone` | `() => boolean` | start wejścia: fonty gotowe (najpóźniej 300 ms po załadowaniu JS), reduced motion od razu |
| `useReveal` | `(target: RefObject<T \| null> \| T \| null, { trigger?: "view" \| "intro" }) => boolean` | `true` → dodaj `is-in` |
| `useScramble` | `(text: string, { disabled?, duration? }) => { text, scramble, cancel, isScrambling }` | stan w React, bez mutacji DOM |
| `useSweep` | `(target: RefObject<Element \| null>, count: number, { stepMs, delayMs, loop? }) => number \| null` | przebieg po wejściu w widok (IO −40% od dołu): indeksy `0…count − 1` co `stepMs`, potem `null`; `loop`: w kółko, tylko w widoku (po wyjściu gaśnie, po powrocie od `0`); off przy reduced motion (`ProcessSection` z `loop`, `ProcessSteps` raz) |
| `useViewportSize` | `() => { width, height } \| null` | `null` na serwerze |

Poza Reactem: `@/lib/intro` → `isIntroDone()`, `subscribeIntro(fn)`, zdarzenie `INTRO_EVENT` na `window`.

---

## Nowa strona: checklista

1. **Route:** dopisz wpis do `src/content/routes.ts` (`path`, `title` bez sufiksu, mówiący, czym jest strona,
   `kind`, `section`, `legacy` — stare pliki do przekierowań 308, `source` (`null` bez wzorca), `lastModified`, `changeFrequency`, `priority`).
   Sitemap i redirecty zaktualizują się same. Dopisz stronę do `public/llms.txt`.
   Case study: `CaseStudy` w `src/content/cases/<slug>.ts` (z `summary`, `description`, dla stron WWW też `story`),
   wpis w `caseOrder` i w `byPath` w `src/content/cases/index.ts`.
2. **Plik:** `src/app/<slug>/page.tsx` (Server Component).
3. **Metadane:**
   ```ts
   import { buildMetadata } from "@/lib/seo/metadata";
   export const metadata = buildMetadata({ path: "/otb", type: "article" });
   ```
   Tytuł z `routes.ts` + template „%s — no-fuss” (z sufiksem do ~60 znaków, tytuł mówi, czym jest strona).
   Wyjątek: `/` (tytuł `null` w routes) dostaje `site.homeTitle` jako `absolute`, opis `site.description`. Canonical, OG, Twitter, robots składa helper.
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
5. **Hero:** `Reveal trigger="intro"` (odsłania się na starcie wejścia), ciemne tło `GlowBackdrop`. Naklejki (`data-stickers`) tylko
   w stopce i na 404: w hero z obiektem 3D to drugi głośny element.
6. **Sekcje:** `.section` (+ `.tone-dark` naprzemiennie), reveal (`Reveal` + `Line` / `Fade` z `index`) tylko na nagłówku sekcji
   i kaflach; wiersze list, akapity i CTA widoczne od razu.
7. **Obrazy:** `next/image` z `public/assets/**` (AVIF/WebP włączone), zawsze `alt` 1:1 z legacy.

## Konwencje CSS Modules

- Nazwy klas camelCase (`styles.tileMeta`), bez BEM.
- Tylko tokeny (`var(--…)`), zero surowych kolorów poza tymi, które legacy ma jako stałe (`#101318` na limonce itp.).
- Tonacja przez klasę `.tone-dark` na sekcji, nie przez nadpisywanie kolorów w module.
- Siatka: `grid-template-columns: repeat(12, 1fr); gap: … var(--gap);` albo klasa `.grid-12`. Breakpointy z legacy: 640, 768, 900, 1024 px.
- Zawsze blok `@media (prefers-reduced-motion: reduce)` dla animacji w module.
- Każdy `:hover` w `@media (hover: hover)` (tap na dotyku go nie przykleja); `:focus-visible` poza tym blokiem,
  z tym samym efektem, jeśli element jest fokusowalny.
- Elementy absolutne w gridzie (tło, naklejki) bez `grid-column` (inaczej zawężają containing block).
