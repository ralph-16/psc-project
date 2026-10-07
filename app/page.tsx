import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  HandHeart,
  HeartHandshake,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import QuickDonate from "@/components/ugnay/QuickDonate";
import DonationTotalPanel from "@/components/ugnay/DonationTotalPanel";
import { HeroCopy } from "@/components/ugnay/HeroCopy";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { mockPeso, mockTotalsFor } from "@/lib/mock/totals";

const CHAIN = [
  { stage: "NEED", text: "Barangay needs recorded with sources." },
  { stage: "APPEAL", text: "Validators approve shortages before anything goes public." },
  { stage: "DONATION", text: "Cash moves via authorized providers — never through UGNAY." },
  { stage: "ALLOCATION", text: "Confirmed funds assigned with a named approver." },
  { stage: "DELIVERY", text: "Dispatches carry receiving reports and timestamps." },
  { stage: "VERIFICATION", text: "Validators close the loop with evidence." },
  { stage: "IMPACT", text: "Final reports reconcile every peso, publicly." },
];

export default function Home() {
  const featured = getCampaign("bulacan-flood-relief") ?? campaigns[0];
  const totals = mockTotalsFor(featured);
  const featuredCards = campaigns.filter((c) => c.featured).slice(0, 6);
  const cashCampaigns = campaigns.filter((c) => (c.donationTypes ?? ["cash"]).includes("cash"));

  const live = campaigns.filter((c) => c.status !== "Closed" && c.status !== "Draft");
  const strip = {
    active: live.length,
    communities: Array.from(new Set(live.map((c) => c.municipality))).length,
    confirmed: live.reduce((s, c) => s + (c.confirmedCash ?? 0), 0),
    delivered: live.reduce((s, c) => s + (c.utilizedCash ?? 0), 0),
  };

  const food = needsForCampaign(featured.id).find((n) => n.category === "Food");
  const answers = [
    {
      q: "What is needed?",
      a: food
        ? `${food.remaining.toLocaleString("en-PH")} ${food.unit} of ${food.item} · ${featured.families.toLocaleString("en-PH")} households.`
        : `Verified relief items for ${featured.families.toLocaleString("en-PH")} households.`,
    },
    {
      q: "Where?",
      a: `${featured.barangay}, ${featured.municipality} — validated by ${featured.validatingOrg ?? "the local DRRM office"}.`,
    },
    {
      q: "What remains unmet?",
      a: `${mockPeso(totals.remaining)} of confirmed funds unutilized.`,
    },
    {
      q: "What happened to every donation?",
      a: `${mockPeso(totals.utilized)} traced to delivery, with receipts.`,
    },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="bg-white" aria-label="UGNAY introduction">
          <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6">
            <HeroCopy />
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start">
              <QuickDonate campaigns={cashCampaigns} defaultId={featured.id} />
              <div className="space-y-4">
                <DonationTotalPanel
                  variant="hero"
                  totals={totals}
                  campaignTitle={featured.title}
                  inkindReceived={2150}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link href="/campaigns" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                    View Active Campaigns
                  </Link>
                  <Link href="/track" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                    Track My Donation
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-5 inline-flex flex-wrap items-center gap-1.5 text-xs text-[#6b7280]">
              <BadgeCheck className="size-3.5 text-[#1b9c6e]" aria-hidden />
              Validated by {featured.validatingOrg} · Permit {featured.permitNo} · Funds
              administered by {featured.fundAdministrator} · Demo figures, mock data only
            </p>
          </div>
        </section>

        {/* Four questions */}
        <section aria-label="UGNAY answers" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {answers.map((x) => (
              <div key={x.q} className="ugnay-card p-4">
                <dt className="text-xs font-bold tracking-wider text-[#084989] uppercase">{x.q}</dt>
                <dd className="mt-1 text-sm text-[#1a2333]">{x.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Platform strip */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section aria-label="Platform-wide impact" aria-live="polite" className="ugnay-card p-5">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="font-display text-2xl font-bold text-[#084989] tabular-nums">{strip.active}</p>
                <p className="text-xs text-[#6b7280]">active verified campaigns</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[#084989] tabular-nums">{strip.communities}</p>
                <p className="text-xs text-[#6b7280]">communities served</p>
              </div>
              <div>
                <p className="font-display ugnay-peso text-2xl font-bold text-[#084989] tabular-nums">
                  {mockPeso(strip.confirmed)}
                </p>
                <p className="text-xs text-[#6b7280]">confirmed cash received</p>
              </div>
              <div>
                <p className="font-display ugnay-peso text-2xl font-bold text-[#084989] tabular-nums">
                  {mockPeso(strip.delivered)}
                </p>
                <p className="text-xs text-[#6b7280]">value delivered</p>
              </div>
            </div>
          </section>
        </div>

        {/* Featured campaigns */}
        <section aria-label="Active campaigns" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">
                Active verified campaigns
              </h2>
              <p className="mt-1 max-w-xl text-base text-[#6b7280]">
                Human-validated appeals with a public money trail.
              </p>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
            >
              View all campaigns <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredCards.map((c) => (
              <article key={c.id} className="ugnay-card flex flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#c8102e] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {c.severity} need
                  </span>
                  <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0e6e4e]">
                    {c.status}
                  </span>
                  {c.permitNo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#084989]/5 px-2.5 py-1 text-[11px] font-semibold text-[#084989]">
                      <ShieldCheck className="size-3" aria-hidden /> Permitted
                    </span>
                  )}
                </div>
                <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">
                  <Link href={`/campaigns/${c.slug}`} className="hover:text-[#084989] hover:underline">
                    {c.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-[#6b7280]">
                  {c.families.toLocaleString("en-PH")} affected households · {c.municipality},{" "}
                  {c.province} · Target {c.targetDate}
                </p>
                <div className="mt-3">
                  <DonationTotalPanel variant="card" totals={mockTotalsFor(c)} statusBadge={c.status} />
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Link href={`/campaigns/${c.slug}`} className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                    View campaign
                  </Link>
                  <Link href={`/campaigns/${c.slug}/donate`} className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
                    Donate <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#6b7280]">
            Where did past gifts go?{" "}
            <Link href="/campaigns/bulacan-typhoon-recovery" className="font-semibold text-[#084989] hover:underline">
              Closed campaigns and final reports
            </Link>
            .
          </p>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-label="How UGNAY works" className="border-y border-[#e5e7eb] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">How it works</h2>
            <p className="mt-1 max-w-2xl text-base text-[#6b7280]">
              Seven steps, one public record.{" "}
              <Link href="/how-it-works" className="font-semibold text-[#084989] hover:underline">
                Full explanation
              </Link>
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHAIN.map((s, i) => (
                <li key={s.stage} className="ugnay-card p-4">
                  <p className="font-display text-xs font-bold tracking-widest text-[#084989] uppercase">
                    {i + 1} · {s.stage}
                  </p>
                  <p className="mt-1 text-sm text-[#1a2333]">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-[12px] border border-[#f6ac21] bg-[#f6ac21]/10 px-4 py-3 text-sm text-[#1a2333]">
              <strong className="font-semibold">Good to know:</strong> the ledger is a
              tamper-evident record of the trail — it does not replace photo evidence, signed
              receipts, or field verification, and it never holds personal data.
            </p>
          </div>
        </section>

        {/* Audience entries */}
        <section aria-label="Who UGNAY is for" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">Who is UGNAY for?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="ugnay-card flex flex-col p-5">
              <HeartHandshake className="size-6 text-[#084989]" aria-hidden />
              <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">I want to help</h3>
              <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                Give in under a minute — no account, fully traceable.
              </p>
              <Link href="/campaigns" className="ugnay-btn ugnay-btn-solid mt-4 w-full sm:w-auto sm:self-start">
                Start giving <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
            <article className="ugnay-card flex flex-col p-5">
              <Landmark className="size-6 text-[#084989]" aria-hidden />
              <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">We need help</h3>
              <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                LGU / DRRM Office — publish verified needs, run relief transparently.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link href="/plans" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Plans &amp; pricing
                </Link>
                <Link href="/request-demo" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Request a demo
                </Link>
                <Link href="/auth" className="ugnay-btn ugnay-btn-link w-full sm:w-auto">
                  Log in
                </Link>
              </div>
            </article>
            <article className="ugnay-card flex flex-col p-5">
              <Building2 className="size-6 text-[#084989]" aria-hidden />
              <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">We can help</h3>
              <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                NGOs and sponsors — back verified gaps, document your impact.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link href="/plans" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Plans &amp; pricing
                </Link>
                <Link href="/corporate/register" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Sponsor registration
                </Link>
                <Link href="/auth" className="ugnay-btn ugnay-btn-link w-full sm:w-auto">
                  Log in
                </Link>
              </div>
            </article>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-[#6b7280]">
            <HandHeart className="size-4" aria-hidden />
            A sponsor? Your NGO/LGU partner records your pledge — no workspace needed.
          </p>
        </section>

        {/* Trust strip */}
        <section aria-label="Trust and data" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="ugnay-card p-5">
              <h3 className="font-display text-base font-bold text-[#1a2333]">Permitted appeals</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Monetary campaigns need a permit, an issuer, and a named fund administrator.
              </p>
            </div>
            <div className="ugnay-card p-5">
              <h3 className="font-display text-base font-bold text-[#1a2333]">UGNAY never holds relief funds</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Cash flows through authorized providers. UGNAY keeps the tracking layer only.
              </p>
            </div>
            <div className="ugnay-card p-5">
              <h3 className="font-display text-base font-bold text-[#1a2333]">Data Privacy Act-aware</h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Community-level data only. No beneficiary identities, no donor contacts — ever.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
