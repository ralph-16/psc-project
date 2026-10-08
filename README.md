# UGNAY — Every Need Verified, Every Peso Traced

Next.js wireframe prototype for a donation-transparency platform: LGU relief
campaigns in Region 3, Philippines. Donors give toward verified disaster needs,
then trace the money from pledge → allocation → delivery → verification on
public, tamper-evident records.

Static mock data only (`lib/mock/*`) — no backend, auth sessions, payments,
blockchain, AI, or map API keys.

## What it can do

**Donors (public routes)**
- Landing (`/`) — promise headline, live Leaflet satellite forecast map with
  severity-traced municipalities, story/problem/chain/feature sections, featured
  Bulacan campaign with DonationTrace example + accounting, donate card with a
  preview → payment-method modal → Done flow (GCash/Maya/PayPal, demo-only,
  issues a traceable ID), partners, closing CTA.
- Campaigns (`/campaigns`, `/campaigns/[id]`) — directory + detail with need
  breakdown, completeness, ledger refs; donate flow with fee breakdown
  (`₱1,000 + ₱30 + ₱10 = ₱1,040`) and mock receipt.
- Needs (`/needs`) — discovery + filtering with empty states.
- Map (`/map`) — satellite needs map over real OSM municipality boundaries,
  severity fills, per-area campaign popups.
- Track (`/track`, `/trace/[id]`) — guest donation tracking by Trace ID with a
  stage timeline and evidence links.
- Transparency (`/transparency`) + Ledger (`/ledger`) — public records and the
  technical anchor view; Reports (`/reports`) for export previews.
- Account (`/account/*`) — donor dashboard, impact recap, profile with mock
  toggles and anonymous giving.

**Corporate (`/corporate/*`)** — landing, registration/onboarding, dashboard,
opportunities with SponsorMatch scoring (84% top fit + why-this-match),
contribution stepper, tracking/evidence, reports, analytics, team, billing,
settings.

**LGU (`/lgu/*`)** — standalone login into an operations workspace: dashboard,
events, masked population (`H-****`, no PII), inventory, AI-assisted forecast
with human sign-off, validation queue, campaign lifecycle, sponsors/donations,
receiving → allocation → logistics → delivery → verification → transparency →
reconciliation → reports → audit → settings.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Verify

```bash
npx tsc --noEmit
npm run build
```

(`npm run lint` currently reports 5 pre-existing `set-state-in-effect` errors in
untouched files; see `docs/CODEBASE-DESIGN-SUMMARY.md` §9.)

## Docs

- `docs/CODEBASE-DESIGN-SUMMARY.md` — stack, directory map, design system, maps.
- `docs/ui-requirements-coverage.md` — story-ID → screen → component matrix.
- `public/reference/` — landing-page reference HTML (untracked working file).
