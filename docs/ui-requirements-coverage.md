# UGNAY Wireframe Prototype — UI Requirements Coverage

> Generated: Oct 5, 2026 (final integration pass); landing/hero-map update Oct 8, 2026;
> landing reference-copy pass + donate modal + UGNAY wordmark later Oct 8, 2026.
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
| IND-1 Landing hero (headline, CTAs, impact strip, how-it-works, transparency promise, audience entries, trust/fee panels) | `/` (`app/page.tsx`) | `SiteHeader`, `SiteFooter`, `HeroLeafletMap`, `LandingDonate`, `ProgressBar` | Done — reference-copy pass Oct 8: copy/figures follow `public/reference/UGNAY-HERO-LANDING-PAGE.html` verbatim in the Tailwind layout (promise headline + live Leaflet satellite preview with traced municipalities + Demo-data badge, story, 4-question problem block, 3-role connection block, 7-step chain, feature cards, featured campaign with DonationTrace example + static accounting ₱1,284,500/₱620,000/₱664,500, evidence, donate, partners, closing CTA; reference photos in `public/landing/`); brand lockup is logo icon + all-caps gold `UGNAY` |
| IND-2 Needs discovery + filtering (location/category/priority, empty state, links to campaigns) | `/needs` (`app/needs/page.tsx`) | `EmptyState`, `CampaignCard`, `NeedMapPlaceholder` | Done |
| IND-3 Campaign details + need breakdown (progress, severity, validated needs table, completeness, ledger ref, report-concern) | `/campaigns`, `/campaigns/[id]` | `ProgressBar`, `StatusBadge`, `Completeness` (85%), `LedgerRef` | Done — section is labelled “Need breakdown” (sentence case), no PascalCase `NeedBreakdown` component; breakdown is an inline section, not a shared component |
| IND-4 Donation flow + fee breakdown `1000 / 30 / 10 / 1040` (cash/in-kind, mock receipt, trace ID) | `/campaigns/[id]/donate`, landing `LandingDonate`, landing ways-to-help cards, `/donate/pledge` | `feeBreakdownFor()` / `exampleFeeBreakdown` (`lib/mock/donations.ts`), `LedgerRef`, mock session (`lib/session.ts`) | Done — landing `LandingDonate` uses the reference form copy and moves the GCash/Maya/PayPal channel picker (brand logos, `public/payments/*.svg`, Wikimedia Commons, nominative use) into a demo-only modal ending in a Done state; channel recorded on the receipt + tracking inbox. `QuickDonate.tsx` retained but unreferenced. Ways-to-help cards (Donate money / Pledge goods / Offer services / Adopt a community) use reference copy; pledge goods/services require mock sign-in (`/auth?next=/donate/pledge?kind=…`) and `/donate/pledge` gates on it |
| IND-5 Donation trace + timeline (guest tracking by Trace ID, stage trail, evidence links) | `/track` | `TraceTimeline`, `LedgerRef`, `EmptyState` (unknown ID) | Done — canonical trail is `TX-UGNAY-004821` (don-001); `TX-UGNAY-00291` lives on `/ledger` as the technical anchor example |
| IND-6 Donor dashboard / history / receipts | `/account` (`app/account/page.tsx`) | `LedgerRef`, `StatusBadge` | Done |
| IND-7 Impact report (outcomes, trace recap, completeness) | `/account/impact` | `TraceTimeline`, `Completeness` (85%) | Done |
| IND-8 Profile / notifications / privacy (mock toggles, anonymous giving, reconciliation summary) | `/account/profile` | inline mock toggle cards | Done |

## Corporate Workflow Refactored

> Note: The legacy CORP-1 through CORP-7 flow has been refactored to reflect the definitive corporate workflow (see `docs/CORPORATE-WORKFLOW.md`).

| Requirement / User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| **CORP-1 Corporate landing**: Value props, SponsorMatch teaser, register CTAs. | `/corporate` | `ScoreBreakdown`, `StatCard` | Done |
| **CORP-2 Onboarding**: Captures explicit CSR preferences (geography, sector, capacity) to feed the SponsorMatch engine. | `/corporate/onboarding` | TBD | Partial (Mock forms exist, but do not capture actual CSR matching fields). |
| **CORP-3 Dashboard**: Distinguishes verified outcomes from pending pledges. | `/corporate/dashboard` | `StatCard` | Partial (UI exists, but doesn't handle discrepancy states). |
| **CORP-4 SponsorMatch**: Active matchmaking engine ranking eligible campaigns based on CSR profile, plus manual browsing fallback. | `/corporate/opportunities` | `ScoreBreakdown` | Partial (Match score is hardcoded to 84%; logic needs transparent rules-engine implementation). |
| **CORP-5 Contribution Flow**: Submitting In-Kind records a "Proposed Pledge" (Pending Drop-off). Cash triggers pooling process. | `/corporate/contribute` | TBD | Partial (Flow exists, but falsely implies immediate fulfillment instead of pledge). |
| **CORP-6 Discrepancy & Tracking UI**: Handles partial deliveries. UI mechanism for authorized formal variance resolution. | `/corporate/tracking` | `TraceTimeline` | Unverified (Missing discrepancy resolution views). |
| **CORP-7 Tiered Evidence & Reports**: Proportional cash impact (distinguishing Provisional vs Final Reconciled), Public Sponsor Recognition toggles, and LGU-sanitized, PII-free granular evidence. | `/corporate/reports`, `/corporate/settings` | `Completeness` | Unverified (Missing evidence sanitization handoff, provisional/final UI states, and public visibility toggles). |

## LGU Workflow Refactored (RBAC)

> Note: The legacy LGU-1 through LGU-10 linear flow has been refactored. The requirements below reflect the definitive operational workflow (see `docs/LGU-WORKFLOW.md`).

| Requirement / User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| **Role-Specific Permissions**: Navigation and actions adapt to active roles (Campaign Manager, Warehouse, Auditor). | `/lgu`, `/lgu/*` | `LguNav` | Unverified (Requires RBAC backend implementation; UI shell is currently static). |
| **Incident War Room**: Centralized view of identity, population, incident inventory, incoming commitments, and remaining gap. | `/lgu/events/[id]` | `StatusBadge` | Partial (UI exists, but gap math and incoming commitments require integration). |
| **Needs Validation**: Distinguishes "Estimated" vs "Verified" needs. Requires approval before public campaign launch. | `/lgu/validation`, `/lgu/events/[id]` | `StatusBadge` | Partial (Status distinguishing is done; approval pipeline needs backend). |
| **Conditional Fulfillment**: Supports bypassing procurement for in-kind donations. | `/lgu/logistics`, `/lgu/receiving` | TBD | Unverified (Pipeline is currently linearly hardcoded). |
| **Inventory & Commitments Accounting**: Gap calculation prevents double-counting. Separates Proposed from Confirmed commitments. | `/lgu/events/[id]`, `/lgu/receiving` | TBD | Unverified (Math logic requires state/backend). |
| **Partial Deliveries & Discrepancies**: Allows recording damaged/missing goods and handling exceptions without returning damaged goods to inventory. | `/lgu/verification`, `/lgu/receiving` | TBD | Unverified. |
| **Delivery Acknowledgement vs Verification**: Distinct actions for field-level receipt vs desk-level evidence review. | `/lgu/delivery`, `/lgu/verification` | `PageHeader` | Partial (Verification page exists, needs distinct acknowledgement trigger). |
| **Self-Verification Badging**: Explicitly distinguishes `Self-Verified by LGU` vs `Independently Verified`. | `/lgu/verification` | TBD | Unverified. |
| **Corporate Pooling & Transparency**: Batch-level tracking for in-kind; pooled reporting for cash. | `/lgu/transparency`, `/lgu/reports` | `TraceTimeline` | Done. |

## Shared (transparency, ledger, reports, auth, states)

| User Story | Screen | Component | Status |
| --- | --- | --- | --- |
| Transparency (public campaign view, estimated need, trace recap, completeness 85%, ledger refs, reconciliation date) | `/transparency`, `/transparency/[id]` | `TraceTimeline`, `Completeness` (85%), `LedgerRef` | Done |
| Ledger (technical anchor record, `TX-UGNAY-00291`, batch `BUL-FLD-001`, hash `8f7a…91cd`, de-emphasized by design) | `/ledger` | `LedgerRef` | Done |
| Reports (report-family previews, reconciliation export link) | `/reports` | inline preview cards | Done |
| Auth mock (login/signup/forgot/role/org tabs, demo entries → donor/corporate/LGU, no sessions) | `/auth` | `SiteHeader`, `SiteFooter`, `PageHeader` | Done — mock sign-in persists a localStorage session (`lib/session.ts`, `ugnay-session`) and honors `?next=` (same-origin, never back to `/auth`); `/login` persists workspace sessions the same way |
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

- `npx tsc --noEmit` + `npm run build` pass. `npm run lint` reports 5 pre-existing
  `set-state-in-effect` errors in untouched files (`app/track/page.tsx`,
  `FilterDisclosure.tsx`, `LguNav.tsx`, `SiteHeader.tsx`).
- All user-facing copy reads production-real (no demo/sample/mock disclaimers in
  the UI); mock architecture is documented in code comments and
  `CODEBASE-DESIGN-SUMMARY.md` only.
