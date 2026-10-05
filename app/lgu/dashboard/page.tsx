import Link from "next/link";
import {
  Siren,
  ClipboardCheck,
  TriangleAlert,
  Megaphone,
  Truck,
  EyeOff,
  Scale,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { disasters } from "@/lib/mock/disasters";
import { needs } from "@/lib/mock/needs";
import { inventory } from "@/lib/mock/inventory";
import { deliveries } from "@/lib/mock/deliveries";
import { campaigns } from "@/lib/mock/campaigns";

const shortages = [
  { item: "First-aid & medicines", need: 2700, onHand: 900, gap: 1800, level: "Critical" },
  { item: "Rice packs (5kg)", need: 4700, onHand: 3200, gap: 1500, level: "High" },
  { item: "Drinking water (6L)", need: 5900, onHand: 5400, gap: 500, level: "High" },
];

// Category comparison, sorted descending by families affected.
const rankedEvents = [...disasters].sort((a, b) => b.affectedFamilies - a.affectedFamilies).slice(0, 4);

const validationQueue = [
  { id: "val-101", item: "Food Packs — Hagonoy", estimate: "650 packs", confidence: "Moderate", status: "Pending validation" },
  { id: "val-102", item: "Drinking water — Calumpit", estimate: "900 bottles", confidence: "High", status: "Pending validation" },
  { id: "val-103", item: "Hygiene kits — San Fernando", estimate: "480 kits", confidence: "Low", status: "Needs re-check" },
];

const pendingDeliveries = deliveries.filter((d) => d.status !== "Verified");
const activeEvents = disasters.filter((d) => d.status === "Active");
const openNeeds = needs.filter((n) => n.remaining > 0).slice(0, 5);
const lowStock = inventory.filter((i) => i.available < 1500);

export default function LguDashboardPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu" }, { label: "Dashboard" }]}
        title="Relief operations dashboard"
        description="Overview for the Malolos Relief Desk."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Events" value={String(activeEvents.length)} sub="2 flooding · 1 lahar flow" icon={Siren} />
        <StatCard label="Open Verified Needs" value="17" sub="Across 6 campaigns" icon={ClipboardCheck} />
        <StatCard label="High-Priority Shortages" value="3" sub="Water, rice, medicines" icon={TriangleAlert} />
        <StatCard label="Pending Validations" value="5" sub="Estimates awaiting approval" icon={EyeOff} />
      </div>

      {/* Validation-before-publication banner */}
      <div className="mt-4 rounded-xl border border-[#d97706]/30 border-l-4 border-l-[#d97706] bg-[#d97706]/8 p-4 sm:p-5">
        <p className="font-display flex items-start gap-2 text-base font-bold text-[#1a2333]">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[#d97706]" aria-hidden />
          Validation before publication — 5 estimates waiting, 2 campaigns blocked from publishing.
        </p>
        <p className="mt-1 pl-7 text-sm text-[#6b7280]">
          Estimates (including AI-assisted ones) never publish automatically. A validator must
          Approve or Adjust each figure first.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 pl-7">
          <Link href="/lgu/validation" className="ugnay-btn ugnay-btn-solid text-xs">
            Open validation queue <ArrowRight className="size-3.5" aria-hidden />
          </Link>
          <Link href="/lgu/campaigns" className="ugnay-btn ugnay-btn-outline text-xs">
            Review blocked campaigns
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {/* Active events */}
        <section className="ugnay-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#1a2333]">Active Events</h2>
            <Link href="/lgu/events" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline">
              All events <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {activeEvents.map((d) => (
              <li key={d.id} className="rounded-lg border border-[#e5e7eb] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#1a2333]">
                    <Link href={`/lgu/events/${d.id}`} className="hover:text-[#084989] hover:underline">
                      {d.name}
                    </Link>
                  </p>
                  <StatusBadge severity={d.severity} showGuidance={false} />
                </div>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {d.municipalities.join(" · ")} — {d.affectedFamilies.toLocaleString()} families ·{" "}
                  {d.evacuationCenters} evac centers
                </p>
              </li>
            ))}
          </ul>
          {/* Chart: families affected */}
          <h3 className="font-display mt-5 text-sm font-bold text-[#1a2333]">Families affected</h3>
          <div className="mt-2 space-y-2.5" role="list" aria-label="Families affected per event, sorted highest to lowest">
            {rankedEvents.map((d, i) => (
              <div
                key={d.id}
                role="listitem"
                tabIndex={0}
                aria-label={`${i + 1} of ${rankedEvents.length}: ${d.name}, ${d.affectedFamilies.toLocaleString()} families affected`}
                className="rounded-lg"
              >
                <div className="flex justify-between gap-2 text-xs text-[#6b7280]">
                  <span className="min-w-0 truncate font-medium">
                    <span aria-hidden className="mr-1.5 inline-block size-2 rounded-sm bg-[#084989] align-baseline" />
                    {i + 1}. {d.name}
                  </span>
                  <span className="shrink-0 font-bold text-[#1a2333] tabular-nums">{d.affectedFamilies.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div
                    aria-hidden
                    className="h-full rounded-full bg-[#084989]"
                    style={{ width: `${Math.round((d.affectedFamilies / 4200) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="sr-only">
            Text summary: Typhoon Maring flooding affects the most families at 4,200, followed by
            Pampanga River overflow at 1,800, Mt. Pinatubo lahar flow at 1,520, and Tarlac flash
            floods at 640.
          </p>
        </section>

        {/* Open verified needs */}
        <section className="ugnay-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#1a2333]">Open Verified Needs</h2>
            <Link href="/lgu/validation" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline">
              Validate <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {openNeeds.map((n) => (
              <li key={n.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#1a2333]">{n.item}</span>
                  <span className="text-xs text-[#6b7280] tabular-nums">
                    {n.secured.toLocaleString()}/{n.required.toLocaleString()} {n.unit}
                  </span>
                </div>
                <ProgressBar value={(n.secured / n.required) * 100} className="mt-1" />
              </li>
            ))}
          </ul>
          <h3 className="font-display mt-5 text-sm font-bold text-[#1a2333]">High-priority shortages</h3>
          <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[300px] text-sm">
            <caption className="sr-only">High-priority shortages sorted by largest gap first</caption>
            <thead>
              <tr className="text-left text-xs text-[#6b7280] uppercase">
                <th scope="col" className="py-1">Item</th>
                <th scope="col" aria-sort="descending" className="py-1 text-right">Gap</th>
                <th scope="col" className="py-1 text-right">Level</th>
              </tr>
            </thead>
            <tbody>
              {shortages.map((s) => (
                <tr key={s.item} className="border-t border-[#e5e7eb]">
                  <th scope="row" className="py-1.5 text-left font-medium">{s.item}</th>
                  <td className="py-1.5 text-right tabular-nums">−{s.gap.toLocaleString()}</td>
                  <td className="py-1.5 text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.level === "Critical" ? "bg-[#c8102e] text-white" : "bg-[#d97706] text-[#1a2333]"}`}
                    >
                      {s.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>

        {/* Campaigns + pending */}
        <section className="space-y-4">
          <div className="ugnay-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-1.5 text-lg font-bold text-[#1a2333]">
                <Megaphone className="size-4 text-[#084989]" aria-hidden /> Campaigns
              </h2>
              <Link href="/lgu/campaigns" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline">
                Manage <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {campaigns.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-[#1a2333]">{c.title}</span>
                    <span className="mt-1 inline-block">
                      <StatusBadge severity={c.severity} showGuidance={false} />
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-[#1a2333] tabular-nums">{c.progress}%</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 rounded-lg bg-[#f6ac21]/15 px-3 py-2 text-xs text-[#1a2333]">
              2 drafts blocked: publish only after validation queue is cleared.
            </p>
          </div>
          <div className="ugnay-card p-5">
            <h2 className="font-display flex items-center gap-1.5 text-lg font-bold text-[#1a2333]">
              <Truck className="size-4 text-[#084989]" /> Pending deliveries
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {pendingDeliveries.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-medium">{d.campaignTitle}</span>
                  <span className="shrink-0 rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold text-[#084989]">
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Bottom row */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">Pending validations</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {validationQueue.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2">
                <span>
                  <span className="block font-medium">{v.item}</span>
                  <span className="text-xs text-[#6b7280]">
                    Est. {v.estimate} · {v.confidence} confidence
                  </span>
                </span>
                <Link href="/lgu/validation" className="inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-[#084989] hover:underline">
                  Review <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="ugnay-card p-5">
          <h2 className="font-display flex items-center gap-1.5 text-lg font-bold text-[#1a2333]">
            <EyeOff className="size-4" /> Unverified reports
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            6 field reports await cross-check. Unverified figures are never shown publicly.
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>• Brgy. S******* — 42 families, photos pending</li>
            <li>• Brgy. B******* — 28 families, duplicate check</li>
            <li>• Brgy. T*********** — 61 families, GPS pending</li>
          </ul>
          <p className="mt-2 text-xs text-[#6b7280]">
            Household identities masked (no full names / addresses) until verified.
          </p>
        </section>
        <section className="ugnay-card border-l-4 border-l-[#c8102e] p-5">
          <h2 className="font-display flex items-center gap-1.5 text-lg font-bold text-[#1a2333]">
            <Scale className="size-4 text-[#c8102e]" /> Reconciliation exceptions
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>• <strong>TX-UGNAY-004826:</strong> pledged ₱25,000 vs received ₱23,000 (−₱2,000 fee variance)</li>
            <li>• <strong>Calumpit water:</strong> dispatched 600 vs received 585 (−15 breakage)</li>
            <li>• <strong>Kalinga match:</strong> ceiling review pending for hygiene kits</li>
          </ul>
          <Link href="/lgu/reconciliation" className="ugnay-btn-link ugnay-btn mt-2 text-sm">
            Open reconciliation <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>

      {/* Low stock table */}
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold text-[#1a2333]">Warehouse snapshot</h2>
        <div className="overflow-x-auto">
        <table className="mt-3 w-full min-w-[560px] text-sm">
          <caption className="sr-only">Warehouse stock snapshot showing on-hand and available units per item</caption>
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th scope="col" className="pb-2">Warehouse</th>
              <th scope="col" className="pb-2">Item</th>
              <th scope="col" className="pb-2 text-right">On hand</th>
              <th scope="col" className="pb-2 text-right">Available</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((i) => (
              <tr key={i.id} className="border-t border-[#e5e7eb]">
                <th scope="row" className="py-2 text-left font-normal">{i.warehouse}</th>
                <td className="py-2 font-medium">{i.item}</td>
                <td className="py-2 text-right tabular-nums">{i.onHand.toLocaleString()}</td>
                <td className="py-2 text-right font-bold text-[#c8102e] tabular-nums">
                  {i.available.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
