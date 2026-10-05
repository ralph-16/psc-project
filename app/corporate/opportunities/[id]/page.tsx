import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Users } from "lucide-react";
import { campaigns } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { sponsorMatches } from "@/lib/mock/matches";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import ScoreBreakdown from "@/components/ugnay/ScoreBreakdown";
import StatusBadge from "@/components/ugnay/StatusBadge";
import LedgerRef from "@/components/ugnay/LedgerRef";

export function generateStaticParams() {
  const matchIds = sponsorMatches.map((m) => ({ id: m.id }));
  const campaignIds = campaigns.map((c) => ({ id: c.id }));
  return [...matchIds, ...campaignIds];
}

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CorporateOpportunityDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const match = sponsorMatches.find((m) => m.id === id);
  const campaign = campaigns.find((c) => c.id === (match?.campaignId ?? id));

  if (!campaign) notFound();

  const needs = needsForCampaign(campaign.id);
  const fit = match?.percent ?? campaign.progress;

  return (
    <div>
      <Link href="/corporate/opportunities" className="ugnay-btn-link ugnay-btn mb-4 text-sm">
        <ArrowLeft className="size-4" aria-hidden /> Back to board
      </Link>
      <PageHeader
        breadcrumb={[
          { label: "Corporate", href: "/corporate" },
          { label: "Opportunities", href: "/corporate/opportunities" },
          { label: campaign.title },
        ]}
        title={campaign.title}
        description={campaign.description}
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div className="ugnay-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge severity={campaign.severity} />
              <span className="rounded-full bg-[#1b9c6e]/10 px-3 py-1 text-xs font-bold text-[#1b9c6e] tabular-nums">
                {fit}% match fit
              </span>
            </div>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b7280]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" aria-hidden />
                {campaign.barangay}, {campaign.municipality}, {campaign.province}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-4" aria-hidden />
                {campaign.families.toLocaleString("en-PH")} families
              </span>
            </p>
            <ProgressBar value={fit} showLabel className="mt-4" />
            <p className="mt-2 text-sm text-[#6b7280]">
              {campaign.secured.toLocaleString("en-PH")} of {campaign.required.toLocaleString("en-PH")} packs
              secured · {campaign.disaster}
            </p>
          </div>

          {match ? (
            <ScoreBreakdown match={match} defaultOpen />
          ) : (
            <div className="ugnay-card p-5">
              <h2 className="font-display text-base font-bold text-[#1a2333]">Why this match?</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                No sponsor tranche is attached yet — ranking is computed from verified need
                severity and delivery readiness, never pay-to-rank.
              </p>
            </div>
          )}

          <div className="ugnay-card p-5">
            <h2 className="font-display text-base font-bold text-[#1a2333]">Open needs</h2>
            <ul className="mt-3 divide-y divide-[#e5e7eb]">
              {needs.map((need) => (
                <li key={need.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-medium text-[#1a2333]">
                    {need.item}
                    <span className="ml-2 text-xs text-[#6b7280]">{need.category}</span>
                  </span>
                  <span className="shrink-0 text-[#6b7280] tabular-nums">
                    <span className="font-display font-bold text-[#1a2333]">{need.remaining.toLocaleString("en-PH")}</span>{" "}
                    {need.unit} left
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="ugnay-card p-5">
            <h2 className="font-display text-base font-bold text-[#1a2333]">Contribute to this match</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Cash or in-kind tranches with ledger references and CSR evidence.
            </p>
            <div className="mt-4 space-y-2.5">
              <Link href="/corporate/contribute" className="ugnay-btn ugnay-btn-solid w-full">
                Contribute <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/corporate/tracking" className="ugnay-btn ugnay-btn-outline w-full">
                Track tranches
              </Link>
            </div>
          </div>
          <LedgerRef value="TX-UGNAY-004815" />
        </aside>
      </div>
    </div>
  );
}
