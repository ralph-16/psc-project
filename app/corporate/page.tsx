import Link from "next/link";
import { ArrowRight, Building2, FileText, HeartHandshake, ShieldCheck } from "lucide-react";
import { sponsorMatches } from "@/lib/mock/matches";
import { sponsors } from "@/lib/mock/sponsors";
import PageHeader from "@/components/ugnay/PageHeader";
import ScoreBreakdown from "@/components/ugnay/ScoreBreakdown";
import StatCard from "@/components/ugnay/StatCard";

/** Corporate landing: value props, SponsorMatch teaser, CTAs. */
export default function CorporateLandingPage() {
  const teaser = sponsorMatches[0];
  const totalPledged = sponsors
    .filter((s) => s.type === "Corporate")
    .reduce((sum, s) => sum + s.contribution, 0);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Corporate" }]}
        title="Corporate giving, fully traceable"
        description="Match verified relief needs, track every peso to delivery, and export audit-ready CSR evidence."
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/corporate/dashboard" className="ugnay-btn ugnay-btn-solid">
          Open dashboard <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/corporate/opportunities" className="ugnay-btn ugnay-btn-outline">
          Browse opportunities
        </Link>
        <Link href="/corporate/register" className="ugnay-btn ugnay-btn-outline">
          Register company
        </Link>
      </div>

      {/* Value props */}
      <section aria-label="Value propositions" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ugnay-card p-5">
          <HeartHandshake className="size-6 text-[#084989]" aria-hidden />
          <h2 className="font-display mt-3 text-base font-bold text-[#1a2333]">Needs-based matching</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            SponsorMatch ranks verified LGU needs by severity and fit — never pay-to-rank.
          </p>
        </div>
        <div className="ugnay-card p-5">
          <ShieldCheck className="size-6 text-[#1b9c6e]" aria-hidden />
          <h2 className="font-display mt-3 text-base font-bold text-[#1a2333]">Peso-to-delivery trace</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Follow each tranche from pledge to verified handover with ledger references.
          </p>
        </div>
        <div className="ugnay-card p-5">
          <FileText className="size-6 text-[#084989]" aria-hidden />
          <h2 className="font-display mt-3 text-base font-bold text-[#1a2333]">CSR-ready reports</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            One-click CSR previews with outcomes, SDG tags, and completeness scores.
          </p>
        </div>
        <div className="ugnay-card p-5">
          <Building2 className="size-6 text-[#d97706]" aria-hidden />
          <h2 className="font-display mt-3 text-base font-bold text-[#1a2333]">Team & billing controls</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Roles, approvals, and invoices built for corporate finance workflows.
          </p>
        </div>
      </section>

      {/* SponsorMatch teaser */}
      <section aria-label="SponsorMatch teaser" className="mt-8 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1a2333]">Featured SponsorMatch</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            {teaser.sponsorName} × {teaser.campaignTitle} at {teaser.percent}% completion.
          </p>
          <ScoreBreakdown match={teaser} defaultOpen className="mt-4" />
        </div>
        <div className="flex flex-col gap-4">
          <StatCard
            label="Corporate pledged"
            value={`₱${totalPledged.toLocaleString("en-PH")}`}
            sub={`${sponsors.filter((s) => s.type === "Corporate").length} corporate sponsors on Ugnay`}
          />
          <div className="ugnay-card p-5">
            <h3 className="font-display text-base font-bold text-[#1a2333]">How it works</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#1a2333]">
              <li>Register your company and set giving focus areas.</li>
              <li>Browse explainable opportunities ranked by verified need.</li>
              <li>Contribute cash or in-kind tranches with full tracking.</li>
              <li>Track delivery and export CSR evidence with ledger references.</li>
            </ol>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/corporate/register" className="ugnay-btn ugnay-btn-solid">
                Start registration <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/corporate/opportunities" className="ugnay-btn ugnay-btn-outline">
                See matches
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
