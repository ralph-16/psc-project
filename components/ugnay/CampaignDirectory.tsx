"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import DonationTotalPanel from "./DonationTotalPanel";
import EmptyState from "./EmptyState";
import FilterDisclosure from "./FilterDisclosure";
import type { Campaign } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { mockTotalsFor } from "@/lib/mock/totals";
import { cn } from "@/lib/utils";

const ALL = "All";
type SortKey = "priority" | "unmet" | "recent";
const SEVERITY_RANK: Record<string, number> = { Critical: 0, High: 1, Elevated: 2, Moderate: 3 };

function uniq(values: string[]): string[] {
  return [ALL, ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))];
}

/** Interactive DON-2 directory leaf (client). Page shell stays a Server Component. */
export default function CampaignDirectory({ campaigns }: { campaigns: Campaign[] }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(ALL);
  const [disaster, setDisaster] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [dtype, setDtype] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("priority");

  const options = useMemo(() => {
    const allNeeds = campaigns.flatMap((c) => needsForCampaign(c.id));
    return {
      locations: uniq(campaigns.map((c) => `${c.municipality}, ${c.province}`)),
      disasters: uniq(campaigns.map((c) => c.disaster)),
      categories: uniq(allNeeds.map((n) => n.category)),
      dtypes: uniq(campaigns.flatMap((c) => c.donationTypes ?? ["cash"])),
      priorities: uniq(campaigns.map((c) => c.severity)),
      statuses: uniq(campaigns.map((c) => c.status ?? "Active")),
    };
  }, [campaigns]);

  const suggestions = useMemo(() => {
    const open = campaigns.filter(
      (c) => c.status !== "Closed" && c.status !== "Fulfilled" && c.progress < 100,
    );
    return [...open]
      .sort((a, b) => b.remaining - a.remaining || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
      .slice(0, 2);
  }, [campaigns]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = campaigns.filter((c) => {
      const cStatus = c.status ?? "Active";
      if (cStatus === "Draft") return false;
      if (location !== ALL && `${c.municipality}, ${c.province}` !== location) return false;
      if (disaster !== ALL && c.disaster !== disaster) return false;
      if (dtype !== ALL && !(c.donationTypes ?? ["cash"]).includes(dtype)) return false;
      if (priority !== ALL && c.severity !== priority) return false;
      if (status !== ALL && cStatus !== status) return false;
      if (category !== ALL) {
        const cats = needsForCampaign(c.id).map((n) => n.category);
        if (!cats.includes(category)) return false;
      }
      if (q) {
        const hay =
          `${c.title} ${c.municipality} ${c.barangay} ${c.province} ${c.disaster}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sort === "priority") sorted.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
    if (sort === "unmet") sorted.sort((a, b) => b.remaining - a.remaining);
    if (sort === "recent") sorted.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    const fulfilled = (c: Campaign) => c.status === "Fulfilled" || c.progress >= 100;
    sorted.sort((a, b) => Number(fulfilled(a)) - Number(fulfilled(b)));
    return sorted;
  }, [campaigns, search, location, disaster, category, dtype, priority, status, sort]);

  const dirty =
    search !== "" || location !== ALL || disaster !== ALL || category !== ALL ||
    dtype !== ALL || priority !== ALL || status !== ALL;
  function reset() {
    setSearch("");
    setLocation(ALL);
    setDisaster(ALL);
    setCategory(ALL);
    setDtype(ALL);
    setPriority(ALL);
    setStatus(ALL);
  }

  const selectClass =
    "min-h-[44px] rounded-full border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#1a2333]";

  return (
    <div>
      <FilterDisclosure label="Filters" resultText={`Showing ${filtered.length} of ${campaigns.length}`}>
        <div className="flex flex-col gap-3">
          <label className="flex min-h-[44px] flex-1 items-center gap-2 rounded-xl border border-[#e5e7eb] px-3 py-2">
            <Search className="size-4 shrink-0 text-[#6b7280]" aria-hidden />
            <span className="sr-only">Search campaigns</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, place, or disaster…"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b7280]/70"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-xs font-semibold text-[#084989] hover:underline"
              >
                Clear
              </button>
            )}
          </label>
          {/* Wrapping chip row: labels never clip on narrow screens. */}
          <div className="flex flex-wrap gap-2">
            {([
              ["Location", location, setLocation, options.locations],
              ["Disaster", disaster, setDisaster, options.disasters],
              ["Need category", category, setCategory, options.categories],
              ["Donation type", dtype, setDtype, options.dtypes],
              ["Priority", priority, setPriority, options.priorities],
              ["Status", status, setStatus, options.statuses],
            ] as const).map(([label, value, set, opts]) => (
              <label key={label} className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                {label}
                <select value={value} onChange={(e) => set(e.target.value)} className={selectClass}>
                  {opts.map((o) => (
                    <option key={o} value={o}>{o === ALL ? "All" : o}</option>
                  ))}
                </select>
              </label>
            ))}
            <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
                <option value="priority">Priority</option>
                <option value="unmet">Most unmet need</option>
                <option value="recent">Most recent</option>
              </select>
            </label>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
          Showing {filtered.length} of {campaigns.length} campaigns.
          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="ml-2 inline-flex min-h-[44px] items-center font-semibold text-[#084989] hover:underline"
            >
              Reset filters
            </button>
          )}
        </p>
      </FilterDisclosure>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No campaigns match those filters"
            description="Try a different keyword, or reset the filters to see all verified appeals."
            actionLabel="View all campaigns"
            actionHref="/campaigns"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const fulfilled = c.status === "Fulfilled" || c.progress >= 100;
            const topNeeds = [...needsForCampaign(c.id)]
              .sort((a, b) => b.remaining - a.remaining)
              .slice(0, 3)
              .map((n) => n.item);
            return (
              <article key={c.id} className={cn("ugnay-card flex flex-col p-5", fulfilled && "opacity-75")}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[#c8102e] px-2.5 py-1 text-[11px] font-semibold text-white">
                    {c.severity} need
                  </span>
                  <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0e6e4e]">
                    {c.status}
                  </span>
                  {fulfilled && (
                    <span className="rounded-full bg-[#084989]/5 px-2.5 py-1 text-[11px] font-semibold text-[#084989]">
                      Fully funded
                    </span>
                  )}
                  {c.permitNo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#084989]/5 px-2.5 py-1 text-[11px] font-semibold text-[#084989]">
                      <ShieldCheck className="size-3" aria-hidden /> Permit {c.permitNo}
                    </span>
                  )}
                </div>
                <h2 className="font-display mt-2 text-lg leading-snug font-bold text-[#1a2333]">
                  <Link href={`/campaigns/${c.slug}`} className="hover:text-[#084989] hover:underline">
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#6b7280]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {c.barangay}, {c.municipality}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Users className="size-3.5" aria-hidden />
                    {c.families.toLocaleString("en-PH")} households
                  </span>
                </p>
                <p className="mt-1 text-[12.5px] text-[#6b7280]">
                  Needs: {topNeeds.join(", ") || "—"} · Target {c.targetDate ?? "—"}
                </p>
                <p className="text-[12.5px] text-[#6b7280]">Validated by {c.validatingOrg ?? "local DRRM office"}</p>
                <div className="mt-3">
                  <DonationTotalPanel variant="card" totals={mockTotalsFor(c)} statusBadge={c.status} />
                </div>
                {fulfilled && suggestions.length > 0 && (
                  <p className="mt-2 rounded-xl bg-[#f3f3f3] px-3 py-2 text-xs text-[#6b7280]">
                    Fully funded — consider{" "}
                    {suggestions.map((s, i) => (
                      <span key={s.id}>
                        {i > 0 && " or "}
                        <Link href={`/campaigns/${s.slug}`} className="font-semibold text-[#084989] hover:underline">
                          {s.title}
                        </Link>
                      </span>
                    ))}{" "}
                    instead.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link
                    href={`/campaigns/${c.slug}`}
                    className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-[#084989] hover:underline hover:underline-offset-4"
                  >
                    View
                  </Link>
                  <Link href={`/campaigns/${c.slug}/donate`} className="ugnay-btn ugnay-btn-solid ugnay-btn-sm">
                    Donate Now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-center text-sm text-[#6b7280]">
        Looking for a specific donation instead?{" "}
        <Link href="/track" className="inline-flex min-h-[44px] items-center font-semibold text-[#084989] hover:underline">
          Track it by ID <ArrowRight className="inline size-4" aria-hidden />
        </Link>
      </p>
    </div>
  );
}
