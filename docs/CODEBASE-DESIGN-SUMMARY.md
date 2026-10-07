# Ugnay — Codebase & Design Summary

> Generated: Oct 7, 2026. Source of truth is the code itself; paths below are relative to repo root.

## 1. What this project is

**Ugnay** is a Next.js wireframe prototype for a donation-transparency platform
(LGU relief campaigns in Region 3, Philippines). It demonstrates the full
donor → campaign → trace → LGU-operations journey with **static mock data only**.
There is no backend, auth session, payment, blockchain, AI, or map API key —
everything reads from `lib/mock/*`, and every money figure is labeled demo/mock
in the UI.

## 2. Tech stack

| Layer | Choice | Version / notes |
| --- | --- | --- |
| Framework | Next.js (App Router, Turbopack) | `next@16.3.8`, `next.config.ts` is near-empty |
| UI runtime | React | `react@19.2.8` |
| Styling | Tailwind CSS v4 + shadcn | `tailwindcss@4`, `@tailwindcss/postcss`, `tw-animate-css`, `shadcn@4.21.1`; theme via CSS vars in `app/globals.css` |
| Primitives | Base UI, class-variance-authority | `@base-ui/react`, `class-variance-authority`, `cn` |
| Icons | Lucide | `lucide-react` |
| Map | Leaflet + React-Leaflet | `leaflet@1.9.4`, `react-leaflet@5.0.0`, `@types/leaflet` (dev) |
| Fonts | `next/font` (Geist) | wired in `app/layout.tsx` |
| Language | TypeScript (strict) | `strict: true`, `resolveJsonModule: true`, path alias `@/* → ./*` |
| Lint / verify | ESLint + tsc + Next build | `npm run lint`, `npx tsc --noEmit`, `npm run build` |

## 3. Directory map

```
app/                  Routes (App Router). layout.tsx, page.tsx (landing),
                      globals.css, loading.tsx, error.tsx, not-found.tsx
  campaigns/          Public campaign directory + [id] detail + [id]/donate + [id]/report
  needs/              Needs discovery + filtering
  map/                Satellite needs map (see §7)
  track/ trace/[id]/  Guest donation tracking + stage timeline
  transparency/       Public campaign transparency views (+ [id])
  ledger/ reports/    Technical ledger anchor + report previews
  account/            Donor dashboard, impact, profile
  auth/ login/        Mock auth (tabs, demo entries, no sessions)
  corporate/          Corporate shell: landing, register, onboarding, dashboard,
                      opportunities (+[id]), contribute, tracking, evidence,
                      reports, analytics, team, billing, settings
  lgu/                LGU workspace (own shell): dashboard, events (+[id]),
                      population, inventory, forecast, validation, campaigns
                      (+new), sponsors, donations, receiving, allocation,
                      logistics, delivery, verification, transparency,
                      reconciliation, reports, audit, settings
  how-it-works/ plans/ request-demo/ donate/pledge/ sponsors/
components/
  ugnay/              Domain components (the real design system in practice)
  ui/                 shadcn primitive(s) — currently just `button.tsx`
lib/
  mock/               All data: campaigns, needs, donations, trace, totals,
                      matches, sponsors, deliveries, disasters, inventory,
                      reports, audit, strings (+ index.ts barrel)
  utils.ts            `cn()` helper
public/
  geo/municipalities.geojson   OSM municipality boundaries for the map
  ugnay-logo.svg / ugnay-logo-text.png, favicon/icon via app/
docs/
  ui-requirements-coverage.md  Story-ID → screen → component coverage matrix
  CODEBASE-DESIGN-SUMMARY.md   This file
```

## 4. Routes & shells (three audiences, three shells)

- **Public / donor** (`/`, `/campaigns`, `/needs`, `/map`, `/track`, `/transparency`,
  `/ledger`, `/reports`, `/account/*`): shared `SiteHeader` (sticky, `z-40`, hamburger
  drawer `z-50`) + `SiteFooter` + `MobileTabBar`. See `components/ugnay/SiteHeader.tsx`.
- **Corporate** (`/corporate/*`): `app/corporate/layout.tsx` wraps the public
  header/footer plus a corporate sub-nav (`CorporateNav`).
- **LGU** (`/lgu/*`): deliberately distinct workspace shell (dark top bar, sidebar
  sections Operate/Publish/Fulfill/Assure, own prototype footer in `app/lgu/layout.tsx`).
  `/lgu` itself is a shell-less standalone login → `/lgu/dashboard`.
- **Global states**: `app/loading.tsx` (skeletons via `LoadingState`), `app/not-found.tsx`
  + `EmptyState`, `app/error.tsx`.

## 5. Data layer: mock-only by design

- All reads come from `lib/mock/*`. Canonical example: `lib/mock/campaigns.ts`
  exports `Severity` (`Critical | High | Elevated | Moderate`), `SEVERITY_ACTION`,
  the `Campaign` interface (identity + geo + `required/secured/remaining/progress`,
  `families`, transparency peso fields, permit/administrator provenance), a `build()`
  helper that derives `remaining/progress/status`, the `campaigns` array, and
  `getCampaign(idOrSlug)` (routes accept both id and slug).
- Spec-anchored constants live in mocks and are asserted in docs: fee
  `₱1,000 + ₱30 + ₱10 = ₱1,040` (`lib/mock/donations.ts`), SponsorMatch `84%`
  (`lib/mock/matches.ts`), completeness `85%`, ledger `TX-UGNAY-00291`, forecast
  `1,250 + 300 − 250 − 50 = 650`, receiving `2,000 / 1,850 / −150`, reconciliation
  `250k / 230k / 210k / 195k / 35k`.
- Privacy rule: community-level data only — masked aggregates (`H-****`), no
  beneficiary PII, no donor contacts, stated on `/map` and LGU population screens.

## 6. Design system

- **Brand tokens** (`app/globals.css:61`): `--ugnay-navy #084989`, `--ugnay-crimson
  #c8102e`, `--ugnay-gold #f6ac21`, page `#f3f3f3`, card `#ffffff`, ink `#1a2333`,
  slate `#6b7280`, border `#e5e7eb`, green `#1b9c6e`, orange `#d97706`, trust
  `#0b4a9c`, card radius `12px`. Exposed to Tailwind via `@theme inline`
  (`--color-ugnay-*`). shadcn vars are brand-mapped (do not remove).
- **Fixed light theme** — no dark-mode toggle in this prototype.
- **Signature utilities**: `.ugnay-card` (white, 12px radius), `.ugnay-btn` variants
  (`-solid`, `-outline`, `-link`; pill CTAs, `touch-action: manipulation`, press
  feedback), `.ugnay-break` (reflow long trace IDs/URLs), `.ugnay-peso`.
- **Severity language** (`StatusBadge.tsx` + `SEVERITY_ACTION`): Critical = Immediate
  aid (crimson), High = Within 24h (orange), Elevated = Replenishment (gold/dark),
  Moderate = Monitoring (trust blue). Used identically in badges, map polygons,
  and legends.
- **Shared components** (`components/ugnay/`): `PageHeader` (breadcrumb + title),
  `CampaignCard`, `CampaignDirectory` (filtering), `QuickDonate`, `DonationTotalPanel`,
  `ProgressBar`, `Completeness` (85%), `LedgerRef`, `TraceTimeline`, `ScoreBreakdown`,
  `StatCard`, `LedgerBar`, `EmptyState`, `FilterDisclosure`, `PrintButton`,
  `VerifyDocButton`, `HeroCopy`, `BrandMark`, `lang` (`LangToggle`), `form-feedback`.
- **Mobile (360–390px)**: bottom tab-bar offset with safe-area padding, `scroll-padding`,
  16px minimum on form controls (no iOS auto-zoom), `overflow-x: clip` on body (keeps
  `position: sticky` working), 44px minimum touch targets on links/buttons.
- **Accessibility**: `id="main"` landmark, aria labels on maps/legends/loading states,
  focus-visible outlines (including `.leaflet-container`), Escape-to-close + focus
  management in the header drawer.

## 7. Needs map (`/map`) — current implementation

- **Page** (`app/map/page.tsx`): server component. Computes tracked-needs counts from
  `campaigns × needs` (critical = <50% secured), renders `PageHeader`, the map, and an
  "Areas on this map" card list (municipality, barangay, households, severity, link).
  The old low-bandwidth needs `<table>` was removed; the card list is the accessible
  equivalent.
- **Map** (`components/ugnay/NeedMap.tsx`, client): React-Leaflet over **Esri World
  Imagery** satellite tiles + Esri `World_Boundaries_and_Places` reference overlay
  (place labels), both with attribution. Six real municipality polygons from
  `public/geo/municipalities.geojson` (OSM via Nominatim, © OpenStreetMap contributors
  ODbL) are traced and filled by worst active severity per municipality
  (Hagonoy Critical, Calumpit High, Santa Maria Elevated, Concepción Elevated,
  Sta. Rosa Moderate, San Fernando Critical). Each polygon has a permanent
  white-halo label (`.municipality-label` in `globals.css`) and a popup listing that
  municipality's campaigns with households + `% secured` and links.
- **Interaction**: drag + touch-zoom + +/- buttons; `scrollWheelZoom` and
  `doubleClickZoom` disabled (no scroll trap); `minZoom 8 / maxZoom 16`, hard
  `maxBounds` around Central Luzon, `fitBounds(...pad(0.25))` on load; skeleton while
  fetching boundaries, error state linking to `/campaigns`.
- **SSR pattern** (`NeedMapDynamic.tsx`): Next 16 forbids `ssr: false` in Server
  Components, so the page imports a small client wrapper that does the
  `next/dynamic(..., { ssr: false })` of the Leaflet component. Leaflet CSS is imported
  inside the client component. Map wrapper is `z-0` so it stays under the sticky
  header (`z-40`) and drawer (`z-50`).
- **Superseded**: `NeedMapPlaceholder.tsx` (stylized non-geographic SVG blobs) is no
  longer referenced by any route; `docs/ui-requirements-coverage.md` still names it
  and is therefore stale on that one point.

## 8. Conventions & gotchas for future edits

1. Mock data is the API — add campaigns/needs in `lib/mock/*`, never fetch.
2. Municipality names must match exactly between `campaigns.ts` and
   `municipalities.geojson` properties (note the alias: mock uses **"Sta. Rosa"**,
   Nominatim returns "Santa Rosa" — the geo file already normalizes this).
3. New Leaflet code must live behind the `NeedMapDynamic` client boundary.
4. Keep severity colors/actions in one place: `SEVERITY_ACTION` + `StatusBadge`;
   `NeedMap.tsx` mirrors colors in `SEVERITY_COLOR` — update both if rebranding.
5. Keep mock disclaimers ("Demo figures", "mock data only", "no real payments").
6. Keep masked-PII rule on any LGU/population/trace surface.
7. Verify with: `npx tsc --noEmit`, `npx eslint <touched-files>`, `npm run build`,
   plus `npm run dev` + 200-check on touched routes and `/geo/municipalities.geojson`.

## 9. Status

Build passes (`tsc` + `eslint` clean, `npm run build` succeeds, `/map` and GeoJSON
serve 200). Open items: delete or archive `NeedMapPlaceholder.tsx` (+ update the
coverage doc's map references), and consider a legend/list refresh if new
municipalities are added to mocks without matching GeoJSON features.
