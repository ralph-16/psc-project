"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter, Search } from "lucide-react";
import { campaigns } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { sponsorMatches } from "@/lib/mock/matches";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import EmptyState from "@/components/ugnay/EmptyState";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Critical", "High", "Food fit", "Water fit", "Logistics fit"];

function matchesFilter(campaignId: string, filter: string) {
  if (filter === "All") return true;
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (filter === "Critical" || filter === "High") return campaign?.severity === filter;
  const needs = needsForCampaign(campaignId);
  if (filter === "Food fit") return needs.some((n) => n.category === "Food");
  if (filter === "Water fit") return needs.some((n) => n.category === "Water");
  if (filter === "Logistics fit")
    return needs.some((n) => n.category === "Shelter" || n.category === "Non-food");
  return true;
}

export default function CorporateOpportunitiesPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      if (!matchesFilter(campaign.id, active)) return false;
      if (q) {
        const hay = `${campaign.title} ${campaign.municipality} ${campaign.barangay} ${campaign.province} ${campaign.disaster}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [active, search]);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Opportunities" }]}
        title="Matching opportunities"
        description="Ranked by verified need severity, category fit, and delivery readiness — never pay-to-rank."
      />

      <div className="ugnay-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#e5e7eb] px-3 py-2 focus-within:border-[#084989] focus-within:ring-2 focus-within:ring-[#084989]/25">
          <Search className="size-4 shrink-0 text-[#6b7280]" aria-hidden />
          <span className="sr-only">Search opportunities</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search municipality, barangay, or need…"
            className="w-full bg-transparent text-sm text-[#1a2333] outline-none placeholder:text-[#6b7280]/70"
          />
        </label>
        <p className="hidden items-center gap-1 text-sm text-[#6b7280] lg:flex">
          <Filter className="size-4" aria-hidden /> Filters:
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Severity filters">
          {FILTERS.map((filter) => {
            const on = active === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={on}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                  on
                    ? "bg-[#084989] text-white"
                    : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
        Showing {filtered.length} of {campaigns.length} opportunities.
        {(search || active !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActive("All");
            }}
            className="ml-2 font-semibold text-[#084989] hover:underline"
          >
            Reset
          </button>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No opportunities match those filters"
            description="Try clearing the search or choosing a different fit filter."
            actionLabel="View all opportunities"
            actionHref="/corporate/opportunities"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((campaign) => {
            const match = sponsorMatches.find((m) => m.campaignId === campaign.id);
            const detailId = match?.id ?? campaign.id;
            return (
              <article key={campaign.id} className="ugnay-card flex flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge severity={campaign.severity} showGuidance={false} />
                  {match && (
                    <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-xs font-bold text-[#1b9c6e] tabular-nums">
                      {match.percent}% fit
                    </span>
                  )}
                </div>
                <h2 className="font-display mt-3 text-lg font-bold text-[#1a2333]">{campaign.title}</h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  {campaign.barangay}, {campaign.municipality}, {campaign.province}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-[#1a2333]">{campaign.description}</p>
                <ProgressBar value={match?.percent ?? campaign.progress} showLabel className="mt-3" />
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <p className="text-xs text-[#6b7280]">
                    {campaign.secured.toLocaleString("en-PH")} of {campaign.required.toLocaleString("en-PH")} packs secured
                  </p>
                  <Link
                    href={`/corporate/opportunities/${detailId}`}
                    className="ugnay-btn ugnay-btn-link shrink-0 !text-xs"
                  >
                    View match <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
