"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import CampaignCard from "@/components/ugnay/CampaignCard";
import EmptyState from "@/components/ugnay/EmptyState";
import { campaigns } from "@/lib/mock/campaigns";

const SEVERITIES = ["All", "Critical", "High", "Elevated", "Moderate"];

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [sort, setSort] = useState<"progress" | "families" | "recent">("progress");

  const provinces = useMemo(
    () => ["All", ...Array.from(new Set(campaigns.map((c) => c.province))).sort()],
    [],
  );
  const [province, setProvince] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = campaigns.filter((c) => {
      if (severity !== "All" && c.severity !== severity) return false;
      if (province !== "All" && c.province !== province) return false;
      if (q) {
        const hay = `${c.title} ${c.municipality} ${c.barangay} ${c.province} ${c.disaster}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sort === "progress") sorted.sort((a, b) => b.progress - a.progress);
    if (sort === "families") sorted.sort((a, b) => b.families - a.families);
    return sorted;
  }, [search, severity, province, sort]);

  const featured = filtered.filter((c) => c.featured);
  const rest = filtered.filter((c) => !c.featured);

  const selectClass =
    "rounded-full border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#1a2333]";

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Campaigns" }]}
          title="Verified campaigns"
          description="Every campaign is a validated appeal with a public trail. Pick one to see needs, deliveries, and evidence."
        />

        <section aria-label="Filters" className="ugnay-card p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#e5e7eb] px-3 py-2">
              <Search className="size-4 shrink-0 text-[#6b7280]" aria-hidden />
              <span className="sr-only">Search campaigns</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search municipality, barangay, or need…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b7280]/70"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-semibold text-[#084989] hover:underline"
                >
                  Clear
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                Severity
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectClass}>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s === "All" ? "All severities" : s}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                Province
                <select value={province} onChange={(e) => setProvince(e.target.value)} className={selectClass}>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p === "All" ? "All provinces" : p}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selectClass}>
                  <option value="progress">Progress</option>
                  <option value="families">Families</option>
                  <option value="recent">Featured first</option>
                </select>
              </label>
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
            Showing {filtered.length} of {campaigns.length} campaigns.
            {(search || severity !== "All" || province !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSeverity("All");
                  setProvince("All");
                }}
                className="ml-2 font-semibold text-[#084989] hover:underline"
              >
                Reset filters
              </button>
            )}
          </p>
        </section>

        {filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No campaigns match those filters"
              description="Try a different keyword, or clear the severity and province filters."
              actionLabel="View all campaigns"
              actionHref="/campaigns"
            />
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section aria-label="Featured" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {featured.map((c) => (
                    <CampaignCard key={c.id} campaign={c} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            <section aria-label="All campaigns" className="mt-8">
              <h2 className="font-display text-xl font-bold text-[#1a2333]">All campaigns</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(sort === "recent" ? filtered.filter((c) => !c.featured) : rest).map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
                {sort === "recent" && featured.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>
          </>
        )}

        <p className="mt-8 text-center text-sm text-[#6b7280]">
          Looking for a specific donation instead?{" "}
          <Link href="/track" className="font-semibold text-[#084989] hover:underline">
            Track it by ID <ArrowRight className="inline size-4" aria-hidden />
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
