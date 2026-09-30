# no-fuss

Strona no-fuss: Magda Nestorowicz (design i produkt) i Kuba Fedoszczak (kod).
Układ i motion wzorowane na haoqi.design, paleta z Figmy no-fuss. Tokeny i zasady: [DESIGN.md](DESIGN.md).

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- CSS Modules + tokeny w CSS custom properties (bez Tailwinda)
- Kroje z repo (`src/app/fonts`, OFL) przez `next/font/local`: TikTok Sans (zmienny, osie `wght` i `opsz`), Geist Mono 400–500; obraz OG czyta ich statyczne instancje TTF
- Lenis (smooth scroll), three.js (sceny 3D, ładowane `next/dynamic` z `ssr: false`)
- Metodologia atomowa: `atoms` → `molecules` → `organisms` → `templates` → `app`
- SEO / AEO: Metadata API, `sitemap.ts`, `robots.ts`, `manifest.ts`, obrazy OG i ikony generowane kodem, JSON-LD (`@graph`), `public/llms.txt`

## Skrypty

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint           # ESLint (eslint-config-next)
pnpm typecheck      # typy (tsc --noEmit)
pnpm build          # build produkcyjny
pnpm start          # serwer produkcyjny po buildzie
```

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local`.

| Zmienna | Opis |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Publiczny adres (canonical, OG, sitemap, JSON-LD). Domena: `https://no-fuss.house` (też fallback w kodzie, gdy zmiennej brak albo ma zły format; wtedy ostrzeżenie w logu). `public/llms.txt` ma adresy wpisane ręcznie, zmienna go nie zmienia. |
| `RESEND_API_KEY` | Klucz [Resend](https://resend.com) dla formularza kontaktu w stopce (Server Action `src/lib/contact/action.ts`). Bez niego formularz pokazuje błąd z adresem e-mail. |
| `CONTACT_FROM` | Nadawca maili z formularza, np. `no-fuss <formularz@no-fuss.house>`; domena musi być zweryfikowana w Resend. Odbiorca to `site.contact.email`, Reply-To = adres z formularza. |

## Struktura

```
src/
  app/                 layout, not-found, sitemap, robots, manifest, OG, ikony
    fonts/             kroje strony (woff2 dla next/font, TTF dla obrazu OG) + licencje OFL
    page.tsx           /  (strona główna)
    o-nas/             /o-nas
    wiedza/            /wiedza, zakładka „Wiedza” (warsztaty, prelekcje, meetupy: nadchodzące i minione)
    ourmoney/ aion-mind/ busy-bee/ automation-house/ otb/ sassy/   case studies (page.tsx [+ page.module.css])
  components/          barrel na warstwę: @/components/atoms | molecules | organisms | templates
    atoms/             Heading, Text, MonoLabel, Tag, Mark, Line, Fade, ScrambleLink, ArrowLink, Button, Logo, Icons,
                       GlowBackdrop, StickerLayer, PhotoPlaceholder, PartnerLogos, VisuallyHidden
    molecules/         NavList, MetaRow, TileCaption, FactRow, CopyEmail, SocialLinks, PhoneFrame,
                       CaseProse, PersonCard, WorkTile, TestimonialCard, ContactCta, ContactForm, EventTile, Tally
    organisms/         chrome (Hud, GridOverlay, Cursor, SmoothScroll, Footer, CookieNotice, Reveal),
                       hero i 3D (HomeHero, HeroScene, NotFoundHero, PageHero), 404 (FellowshipMap), strona główna (+ KnowledgeTeaser),
                       /o-nas, /wiedza (EventsSection), /regulamin i /polityka-prywatnosci (LegalDocument), bloki case study
    templates/         CaseStudyLayout (fakty standardowe, blok CTA; + CaseStudySection: wide / split / lite)
  content/             site.ts (firma, osoby, produkty), routes.ts (lista stron), navigation.ts, types.ts,
                       home.ts + home-jsonld.ts, process.ts („Jak pracujemy”), faq.ts (FAQ strony głównej),
                       about.ts, fellowship.ts (trasa Drużyny na 404), events.ts + events-jsonld.ts (/wiedza i zajawka na /), cases/ (index.ts + jeden plik na case study),
                       legal.ts + terms.ts + privacy-policy.ts (regulamin, polityka prywatności, komunikat o ciasteczkach)
  lib/
    contact/           formularz kontaktu: walidacja i stany (form.ts), Server Action → Resend (action.ts)
    seo/               buildMetadata, JSON-LD, adres strony, znak do ikon
    hooks/             useReducedMotion, usePointerFine, useReveal, useScramble, …
    href.ts            linki wewnętrzne / zewnętrzne / placeholdery
    intro.ts           start wejścia: fonty gotowe → reveal hero
  styles/              tokens.css, globals.css
public/
  assets/              obrazy (kopia legacy/assets)
  three/fonts/         font typeface dla TextGeometry
  llms.txt
docs/COMPONENTS.md     kontrakt komponentów, mapa stron i treści, checklista nowej strony
legacy/                archiwum statycznej strony (HTML v1–v5, assets, stary vercel.json)
```

Kontrakt komponentów, tokeny i checklista dodawania strony: [docs/COMPONENTS.md](docs/COMPONENTS.md).

## Route'y

Jedno źródło prawdy: `src/content/routes.ts`. Stare adresy (`/no-fuss-v5`, `/case-otb-v2.html`…) przekierowują na nowe kodem 308 (stałe, `permanent: true`) (`next.config.ts`).

| Route | Wzorzec w `legacy/` |
|---|---|
| `/` | `no-fuss-v5.html` |
| `/o-nas` | `o-nas-v5.html` |
| `/ourmoney` | `case-ourmoney-v2.html` |
| `/aion-mind` | `case-aion-mind-v1.html` |
| `/busy-bee` | `case-busybee-v3.html` |
| `/automation-house` | `case-automation-house-v1.html` |
| `/otb` | `case-otb-v2.html` |
| `/sassy` | `case-sassy-v2.html` |
| `/wiedza` | — (nowa strona; wydarzenia w `src/content/events.ts`) |
| `/regulamin` | — (nowa strona; treść w `src/content/terms.ts`) |
| `/polityka-prywatnosci` | — (nowa strona; treść w `src/content/privacy-policy.ts`) |
| 404 | `404.html` |

## legacy/

Archiwum statycznej wersji: każda iteracja była osobnym plikiem, poprzednich nie nadpisywaliśmy.
Pliki nie są serwowane przez Next. Podgląd archiwum:

```bash
cd legacy && python3 -m http.server 4173
```

| Plik | Co to jest |
|---|---|
| `no-fuss-v1.html` … `v4` | wcześniejsze strony główne (archiwum) |
| `no-fuss-v5.html` | **wzorzec** strony głównej |
| `o-nas-v1.html` … `v4` | wcześniejsze „O nas” (archiwum) |
| `o-nas-v5.html` | **wzorzec** „O nas”: Magda, Kuba i agenci AI, social media, posty z LinkedIna |
| `case-ourmoney-v2.html` | **wzorzec** case OurMoney (v1 archiwum) |
| `case-aion-mind-v1.html` | **wzorzec** case AION MIND |
| `case-busybee-v3.html` | **wzorzec** case Busy Bee (v1, v2 archiwum) |
| `case-otb-v2.html` | **wzorzec** case OTB (v1 archiwum) |
| `case-sassy-v2.html` | **wzorzec** case Sassy (v1 archiwum) |
| `case-automation-house-v1.html` | **wzorzec** case Automation House |
| `404.html` | **wzorzec** strony błędu |
| `index.html` | stare przekierowanie na v5 |
| `assets/` | realne ekrany (kopia w `public/assets/`) |
| `vercel.json` | stare rewrites (referencja; Next nie potrzebuje `vercel.json`) |

Audyty UX: `.ux/audits/`. Treści w `[nawiasach]` to placeholdery.

## Bezpieczeństwo

Nagłówki w `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`
i `Content-Security-Policy: frame-ancestors 'none'`; bez `X-Powered-By`. Pełne CSP jeszcze nieustawione (na razie tylko
`frame-ancestors`; fonty są self-hostowane przez `next/font`, więc da się je wprowadzić bez wyjątków dla Google).
Rate limit formularza kontaktu to reguła Vercel Firewall na każdy `POST` (poza kodem aplikacji).

## Prywatność

Strona nie ustawia ciasteczek i nie ma analityki. `CookieNotice` (chrome) to informacja, nie prośba o zgodę; jej zamknięcie
zapisuje jeden wpis w `localStorage` (`nf:cookie-notice`). Dodajesz narzędzie, które zapisuje coś w przeglądarce albo wysyła
dane na zewnątrz (analityka, osadzenia): zaktualizuj `src/content/privacy-policy.ts` i `LEGAL_EFFECTIVE_FROM` w `legal.ts`
(komunikat pokaże się wtedy znowu), a dla ciasteczek wymagających zgody potrzebny jest baner zgody zamiast komunikatu.
Adres Magdy (miejsce zamieszkania, art. 5 UŚUDE) jest jeszcze pusty (`address: null` w `legal.ts`); dokumenty pokazują wtedy samo nazwisko. Łańcuch poczty opisany w polityce:
formularz → Resend, `general@no-fuss.house` → Cloudflare Email Routing (MX) → skrzynki Gmail; zmiana dostawcy = zmiana polityki.
