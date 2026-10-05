import Link from "next/link";
import { ArrowRight, CircleAlert, HandCoins, HeartHandshake, Package, ReceiptText } from "lucide-react";
import { campaigns } from "@/lib/mock/campaigns";
import { donations } from "@/lib/mock/donations";
import { sponsorMatches } from "@/lib/mock/matches";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";

const PIPELINE = [
  { stage: "Pledged", count: 6, amount: "₱132,700" },
  { stage: "Confirmed", count: 4, amount: "₱81,500" },
  { stage: "Allocated", count: 3, amount: "₱56,200" },
  { stage: "Delivered", count: 2, amount: "₱31,000" },
];

const EXCEPTIONS = [
  {
    title: "Tranche 3 needs approval",
    detail: "₱50,000 matching tranche for Hagonoy Flood Relief is waiting on finance approval .",
    action: { label: "Review", href: "/corporate/contribute" },
  },
  {
    title: "Evidence missing for 1 delivery",
    detail: "Calumpit dispatch photo not yet uploaded — CSR completeness is capped at 85% .",
    action: { label: "Open evidence", href: "/corporate/evidence" },
  },
  {
    title: "Match window closing",
    detail: "Kalinga Foundation 84% match completes in 3 days — 16 water bottles still unmatched .",
    action: { label: "View match", href: "/corporate/opportunities/match-001" },
  },
];

/** Corporate dashboard: stats, pipeline, exceptions. */
export default function CorporateDashboardPage() {
  const featured = campaigns.filter((c) => c.featured);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Dashboard" }]}
        title="Kalinga Foundation workspace"
        description="Contributions, pipeline, and matches at a glance."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/corporate/contribute" className="ugnay-btn ugnay-btn-solid">
          New contribution <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/corporate/opportunities" className="ugnay-btn ugnay-btn-outline">
          Find matches
        </Link>
        <Link href="/corporate/reports" className="ugnay-btn ugnay-btn-link">
          CSR report <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <section aria-label="Portfolio stats" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total contributed" value="₱500,000" sub="6 campaigns" icon={HandCoins} />
        <StatCard label="Goods mobilized" value="12,480" sub="packs delivered" icon={Package} />
        <StatCard label="Active matches" value="2" sub="84% top fit" icon={HeartHandshake} />
        <StatCard label="Ledger refs" value={String(donations.length)} sub="all trails sealed" icon={ReceiptText} />
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Pipeline */}
        <section aria-label="Contribution pipeline" className="ugnay-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#1a2333]">Contribution pipeline</h2>
            <Link href="/corporate/tracking" className="ugnay-btn-link ugnay-btn text-sm">
              Track all <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ol className="mt-4 space-y-4">
            {PIPELINE.map((row, i) => (
              <li key={row.stage}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-sm">
                  <span className="font-medium text-[#1a2333]">
                    {i + 1}. {row.stage}
                    <span className="ml-2 text-[#6b7280]">{row.count} tranches</span>
                  </span>
                  <span className="font-display font-bold tabular-nums">{row.amount}</span>
                </div>
                <ProgressBar value={100 - i * 22} className="mt-1.5" />
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-[#6b7280]">
            SponsorMatch ranking is needs-based and explainable — never pay-to-rank.
          </p>
        </section>

        {/* Exceptions */}
        <section aria-label="Exceptions" className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">Needs attention</h2>
          <ul className="mt-4 space-y-4">
            {EXCEPTIONS.map((item) => (
              <li key={item.title} className="rounded-xl border border-[#e5e7eb] p-3.5">
                <p className="flex items-start gap-2 text-sm font-semibold text-[#1a2333]">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#d97706]" aria-hidden />
                  {item.title}
                </p>
                <p className="mt-1 pl-6 text-sm text-[#6b7280]">{item.detail}</p>
                <Link href={item.action.href} className="ugnay-btn-link ugnay-btn mt-1 pl-6 text-sm">
                  {item.action.label} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Featured matches */}
      <section aria-label="Featured matches" className="mt-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">Top matches for you</h2>
          <Link href="/corporate/opportunities" className="ugnay-btn-link ugnay-btn text-sm">
            View board <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {featured.map((campaign) => {
            const match = sponsorMatches.find((m) => m.campaignId === campaign.id);
            return (
              <article key={campaign.id} className="ugnay-card p-5">
                <StatusBadge severity={campaign.severity} showGuidance={false} />
                <h3 className="font-display mt-2 text-base font-bold text-[#1a2333]">{campaign.title}</h3>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  {campaign.barangay}, {campaign.municipality} · {campaign.families.toLocaleString("en-PH")} families
                </p>
                <ProgressBar value={match?.percent ?? campaign.progress} showLabel className="mt-4" />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-[#6b7280]">
                    {match ? `${match.percent}% match fit` : `${campaign.progress}% secured`}
                  </p>
                  <Link
                    href={`/corporate/opportunities/${match?.id ?? campaign.id}`}
                    className="ugnay-btn ugnay-btn-solid !px-4 !py-2 text-xs"
                  >
                    Open match <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
