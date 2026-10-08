# UGNAY Wireframe Prototype — UI Requirements Coverage

> Generated: Oct 5, 2026 (final integration pass); landing/hero-map update Oct 8, 2026.
> Scope: wireframe prototype only. All data is static mock (`lib/mock/*`); no backend, auth,
> payments, blockchain anchoring, AI service, or map API.

## Assumptions (no User Stories file was attached)

- Story IDs (IND-1…IND-8, CORP-1…CORP-7, LGU-1…LGU-10) are mapped from the prompt spec
  §§17–23 plus the branding doc, not from a separate User Stories file.
- Canonical mock figures asserted in the spec are treated as acceptance anchors:
  fee `₱1,000 + ₱30 + ₱10 = ₱1,040` · SponsorMatch `84%` · completeness `85%` ·
  ledger `TX-UGNAY-00291` · forecast `1,250 + 300 − 250 − 50 = 650` ·
  receiving `2,000 / 1,850 / −150` · reconciliation `250k / 230k / 210k / 195k / 35k`.
- Campaign slug is `hagonoy-flood-relief` (human-readable slug), **not** `bul-fld-001`
  (which survives only as a mock batch code on `/ledger`). Detail/donate routes resolve
  both id and slug via `getCampaign()`.
- Light fixed theme (no dark-mode toggle in this prototype).
- Status values: **Done** = screen + named component/figure present; **Partial** = screen
  exists but a spec element is simplified or missing (noted).

## Status legend

| Status | Meaning |
| --- | --- |
| Done | Screen exists, spec figure/component verified in code |
| Partial | Screen exists, minor spec element simplified or missing (see note) |

---

## Individual donor (IND-1 … IND-8)

| User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| IND-1 Landing hero (headline, CTAs, impact strip, how-it-works, transparency promise, audience entries, trust/fee panels) | `/` (`app/page.tsx`) | `SiteHeader`, `SiteFooter`, `HeroLeafletMap`, `QuickDonate`, `ProgressBar` | Done — restructured Oct 8: promise headline + live Leaflet satellite preview with traced municipalities, story, 4-question problem block, 3-role connection block, 7-step chain, feature cards (Verified Needs / DonationTrace / Transparency / SponsorMatch / Forecast Map), featured campaign with DonationTrace example + accounting, evidence, donate, partners, closing CTA; live mock figures throughout |
| IND-2 Needs discovery + filtering (location/category/priority, empty state, links to campaigns) | `/needs` (`app/needs/page.tsx`) | `EmptyState`, `CampaignCard`, `NeedMapPlaceholder` | Done |
| IND-3 Campaign details + need breakdown (progress, severity, validated needs table, completeness, ledger ref, report-concern) | `/campaigns`, `/campaigns/[id]` | `ProgressBar`, `StatusBadge`, `Completeness` (85%), `LedgerRef` | Done — section is labelled “Need breakdown” (sentence case), no PascalCase `NeedBreakdown` component; breakdown is an inline section, not a shared component |
| IND-4 Donation flow + fee breakdown `1000 / 30 / 10 / 1040` (cash/in-kind, mock receipt, trace ID) | `/campaigns/[id]/donate` | `feeBreakdownFor()` / `exampleFeeBreakdown` (`lib/mock/donations.ts`), `LedgerRef` | Done |
| IND-5 Donation trace + timeline (guest tracking by Trace ID, stage trail, evidence links) | `/track` | `TraceTimeline`, `LedgerRef`, `EmptyState` (unknown ID) | Done — canonical trail is `TX-UGNAY-004821` (don-001); `TX-UGNAY-00291` lives on `/ledger` as the technical anchor example |
| IND-6 Donor dashboard / history / receipts | `/account` (`app/account/page.tsx`) | `LedgerRef`, `StatusBadge` | Done |
| IND-7 Impact report (outcomes, trace recap, completeness) | `/account/impact` | `TraceTimeline`, `Completeness` (85%) | Done |
| IND-8 Profile / notifications / privacy (mock toggles, anonymous giving, reconciliation summary) | `/account/profile` | inline mock toggle cards | Done |

## Corporate (CORP-1 … CORP-7)

| User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| CORP-1 Corporate landing (value props, SponsorMatch teaser, register/browse CTAs) | `/corporate` (`app/corporate/page.tsx`) | `ScoreBreakdown`, `StatCard`, `PageHeader` | Done |
| CORP-2 Register / onboarding (company form, giving-focus setup, visual steps) | `/corporate/register`, `/corporate/onboarding` | inline mock forms | Done |
| CORP-3 Corporate dashboard (matches, tranches, completeness nudge) | `/corporate/dashboard` | `StatCard` (84% top fit, 85% completeness cap) | Done |
| CORP-4 Opportunities + SponsorMatch detail (`84%`, ScoreBreakdown “why this match”) | `/corporate/opportunities`, `/corporate/opportunities/[id]` | `ScoreBreakdown`, `ProgressBar`, `LedgerRef` | Done — canonical 84% match is `sponsorMatches[0]` (`lib/mock/matches.ts`) |
| CORP-5 Contribution flow (cash/in-kind tranches, 3 visual steps, nothing charged) | `/corporate/contribute` | inline mock stepper | Done |
| CORP-6 Tracking + evidence (tranche trail, delivery proof, completeness 85%) | `/corporate/tracking`, `/corporate/evidence` | `TraceTimeline`, `Completeness` | Done |
| CORP-7 CSR report + analytics / team / billing / settings | `/corporate/reports`, `/corporate/analytics`, `/corporate/team`, `/corporate/billing`, `/corporate/settings` | `Completeness` (reports), `StatCard` (analytics 84%) | Done |

## LGU (LGU-1 … LGU-10)

| User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| LGU-1 Portal login (mock credentials, role select, → dashboard) | `/lgu` (`app/lgu/page.tsx`, standalone login, no workspace shell — by design) | inline mock form | Done |
| LGU-2 Dashboard (desk overview, exceptions, reconciliation link) | `/lgu/dashboard` | `StatCard`, `StatusBadge` | Done |
| LGU-3 Active events + event detail (masked barangays) | `/lgu/events`, `/lgu/events/[id]` | `StatusBadge` | Done |
| LGU-4 Affected population, masked (cluster aggregates, `H-****`, no PII) | `/lgu/population` | inline masked table | Done |
| LGU-5 Inventory (stock by category/warehouse) | `/lgu/inventory` | inline mock table | Done |
| LGU-6 Forecast `1250 + 300 − 250 − 50 = 650` (AI-assisted, human sign-off) | `/lgu/forecast` | inline forecast cards | Done — formula rendered verbatim in explanation string |
| LGU-7 Validation queue (Estimated ≠ Validated, approve/reject, masked) | `/lgu/validation` | inline validator inbox | Done — “⚠ Estimated ≠ Validated” banner verified |
| LGU-8 Campaign lifecycle (draft → pending validation → pending approval → published; new-campaign form) | `/lgu/campaigns`, `/lgu/campaigns/new` | `StatusBadge` | Done |
| LGU-9 Sponsors + donations (incl. fee line `₱1,000 + ₱30 + ₱10 = ₱1,040`) | `/lgu/sponsors`, `/lgu/donations` | inline tables | Done |
| LGU-10 Receiving `2000 / 1850 / −150` → allocation wizard → logistics → delivery → verification → transparency preview → reconciliation `250k / 230k / 210k / 195k / 35k` → reports → audit → settings | `/lgu/receiving`, `/lgu/allocation`, `/lgu/logistics`, `/lgu/delivery`, `/lgu/verification`, `/lgu/transparency`, `/lgu/reconciliation`, `/lgu/reports`, `/lgu/audit`, `/lgu/settings` | `PageHeader` throughout; receiving variance + reconciliation peso-flow bars | Done |

## Shared (transparency, ledger, reports, auth, states)

| User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| Transparency (public campaign view, estimated need, trace recap, completeness 85%, ledger refs, reconciliation date) | `/transparency`, `/transparency/[id]` | `TraceTimeline`, `Completeness` (85%), `LedgerRef` | Done |
| Ledger (technical anchor record, `TX-UGNAY-00291`, batch `BUL-FLD-001`, hash `8f7a…91cd`, de-emphasized by design) | `/ledger` | `LedgerRef` | Done |
| Reports (report-family previews, reconciliation export link) | `/reports` | inline preview cards | Done |
| Auth mock (login/signup/forgot/role/org tabs, demo entries → donor/corporate/LGU, no sessions) | `/auth` | `SiteHeader`, `SiteFooter`, `PageHeader` | Done |
| Global states (loading skeletons, 404, error boundary) | `app/loading.tsx`, `app/not-found.tsx`, `app/error.tsx` | `LoadingState`, `EmptyState` | Done |

---

## Consistency pass (this integration)

- **Shells:** public + corporate routes use shared `SiteHeader`/`SiteFooter`
  (`app/corporate/layout.tsx` wraps them + corporate sub-nav). LGU uses a distinct
  workspace shell by design (dark top bar, sidebar sections Operate/Publish/Fulfill/Assure,
  own prototype footer in `app/lgu/layout.tsx`) — documented here instead of unified.
- **Landing CTAs verified real:** `/campaigns/hagonoy-flood-relief/donate`,
  `/needs`, `/track`, `/corporate`, `/lgu`, `/campaigns`, `/account/profile` — all resolve.
- **`/lgu` login** is intentionally shell-less (standalone sign-in → `/lgu/dashboard`).
- **No dead spec figures:** every numeric anchor above was grep-verified in its screen/mock.
- **Known simplifications (accepted for wireframe):** `NeedBreakdown`/`FeeBreakdown` are
  inline sections + `lib/mock` helpers, not standalone shared components (unlike
  `TraceTimeline`, `ScoreBreakdown`, `Completeness`, `LedgerRef`, which are shared under
  `components/ugnay/`); full map is `NeedMap` (Leaflet + Esri tiles), landing preview
  is `HeroLeafletMap` (live Leaflet satellite + traced boundaries); uploads/exports
  are visual-only.

## Build

- `npx tsc --noEmit` + `npm run build` — see integration report for result.
- Mock-only disclaimer present on landing (“Prototype · mock data only — no real payments”),
  auth (“no real accounts”), LGU shell (“Mock UI only”), donate (“No real payment”).
