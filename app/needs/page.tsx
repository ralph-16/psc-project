"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import CampaignCard from "@/components/ugnay/CampaignCard";
import EmptyState from "@/components/ugnay/EmptyState";
import { campaigns } from "@/lib/mock/campaigns";
import { needs } from "@/lib/mock/needs";

const FULFILLED = [
  {
    title: "Malolos Evacuation Center restock",
    text: "1,200 family packs delivered and verified Sep 28, 2026.",
    href: "/campaigns/sta-rosa-monitoring",
  },
  {
    title: "Paombong drinking-water run",
    text: "800 water bottles delivered and verified Sep 25, 2026.",
    href: "/campaigns/calumpit-river-flooding",
  },
];

const REDIRECTED = [
  {
    title: "Surplus sleeping mats → Concepcion",
    text: "150 mats redirected from Sta. Rosa standby to Concepcion replenishment, Oct 2, 2026.",
    href: "/campaigns/concepcion-relief-drive",
  },
];

export default function NeedsPage() {
  const locations = useMemo(
    () => Array.from(new Set(campaigns.map((c) => `${c.municipality}, ${c.province}`))).sort(),
    [],
  );
  const categories = useMemo(() => Array.from(new Set(needs.map((n) => n.category))).sort(), []);
  const priorities = ["Critical", "High", "Elevated", "Moderate"];

  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const filtered = campaigns.filter((c) => {
    const loc = `${c.municipality}, ${c.province}`;
    if (location !== "All" && loc !== location) return false;
    if (priority !== "All" && c.severity !== priority) return false;
    if (category !== "All") {
      const has = needs.some((n) => n.campaignId === c.id && n.category === category);
      if (!has) return false;
    }
    return true;
  });

  const selectClass =
    "w-full rounded-full border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#1a2333]";

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Needs" }]}
          title="Active verified needs"
          description="Filter by location, category, or priority. Every listing links to a campaign with full evidence."
        />

        {/* Filters */}
        <section aria-label="Filters" className="ugnay-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Location
              </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={selectClass}
              >
                <option value="All">All locations</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option value="All">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={selectClass}
              >
                <option value="All">All priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
            Showing {filtered.length} of {campaigns.length} active campaigns.
          </p>
        </section>

        {/* Results */}
        <section aria-label="Results" className="mt-6">
          {filtered.length === 0 ? (
            <EmptyState
              title="No needs match those filters"
              description="Try widening the location or clearing the category filter."
              actionLabel="View all campaigns"
              actionHref="/campaigns"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </section>

        {/* Fulfilled */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">Recently fulfilled</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Closed needs stay visible so the record stays complete.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FULFILLED.map((f) => (
              <article key={f.title} className="ugnay-card p-5">
                <h3 className="font-display text-base font-bold text-[#1a2333]">{f.title}</h3>
                <p className="mt-1 text-sm text-[#6b7280]">{f.text}</p>
                <Link href={f.href} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4">
                  View record <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Redirected */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">Redirected surplus</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            When a need closes early, surplus moves to the next verified need — publicly logged.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {REDIRECTED.map((r) => (
              <article key={r.title} className="ugnay-card p-5">
                <h3 className="font-display text-base font-bold text-[#1a2333]">{r.title}</h3>
                <p className="mt-1 text-sm text-[#6b7280]">{r.text}</p>
                <Link href={r.href} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4">
                  View record <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
