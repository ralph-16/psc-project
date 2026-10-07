"use client";

import { mockDate, mockPeso, type MockTotals } from "@/lib/mock/totals";
import { cn } from "@/lib/utils";
import { useT } from "./lang";

interface Props {
  variant: "hero" | "card" | "full" | "strip";
  totals: MockTotals;
  campaignTitle?: string;
  statusBadge?: string;
  inkindReceived?: number;
  className?: string;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1">
      <dt className="text-sm text-[#6b7280]">{label}</dt>
      <dd
        className={cn(
          "ugnay-peso text-sm tabular-nums",
          strong
            ? "font-display text-base font-bold text-[#1a2333]"
            : "font-semibold text-[#1a2333]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * ONE reusable Donation Total component (MOCK DATA — static demo figures).
 * C = confirmed, A = allocated, U = utilized, R = C - U.
 */
export default function DonationTotalPanel({
  variant,
  totals,
  campaignTitle,
  statusBadge,
  inkindReceived,
  className,
}: Props) {
  const tt = useT();

  if (variant === "strip") {
    return (
      <div aria-live="polite" className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}>
        <div>
          <p className="text-xs text-[#6b7280]">{tt("totals.confirmed")}</p>
          <p className="font-display ugnay-peso text-xl font-bold text-[#084989] tabular-nums">
            {mockPeso(totals.confirmed)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#6b7280]">Delivered value</p>
          <p className="font-display ugnay-peso text-xl font-bold text-[#1a2333] tabular-nums">
            {mockPeso(totals.utilized)}
          </p>
        </div>
        <p className="text-xs text-[#6b7280]">Updated {mockDate(totals.updatedAt)}</p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div aria-live="polite" className={className}>
        <div className="flex items-center justify-between gap-2">
          <p className="font-display ugnay-peso text-lg font-bold text-[#084989] tabular-nums">
            {mockPeso(totals.confirmed)}
          </p>
          {statusBadge && (
            <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0e6e4e]">
              {statusBadge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-[#6b7280]">
          {tt("totals.confirmed").toLowerCase()} · updated {mockDate(totals.updatedAt).toLowerCase()}
        </p>
      </div>
    );
  }

  if (variant === "hero") {
    const base = totals.confirmed + totals.remaining;
    const pct = base > 0 ? Math.min(100, Math.round((totals.confirmed / base) * 100)) : 0;
    return (
      <section aria-label="Donation total" aria-live="polite" className={cn("ugnay-card p-5", className)}>
        <p className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
          {campaignTitle ?? "Featured campaign"}
        </p>
        <p className="font-display ugnay-peso mt-1 text-3xl font-bold text-[#084989] tabular-nums sm:text-4xl">
          {mockPeso(totals.confirmed)}
        </p>
        <p className="mt-1 text-sm text-[#6b7280]">
          {tt("totals.confirmed")} ·{" "}
          <strong className="font-semibold text-[#1a2333]">
            {mockPeso(totals.remaining)} {tt("totals.remaining")}
          </strong>
        </p>
        <div
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#f3f3f3]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Funding progress"
        >
          <div className="h-full rounded-full bg-[#084989]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6b7280]">
          {typeof inkindReceived === "number" && (
            <span>{inkindReceived.toLocaleString("en-PH")} in-kind items received</span>
          )}
          <span>Updated {mockDate(totals.updatedAt)}</span>
          {totals.lastReconciliation && (
            <span>Last reconciliation {mockDate(totals.lastReconciliation)}</span>
          )}
        </div>
      </section>
    );
  }

  // full
  return (
    <section aria-label="Donation total" className={cn("ugnay-card p-5", className)}>
      <h2 className="font-display text-lg font-bold text-[#1a2333]">Donation total</h2>
      {totals.exception && (
        <p
          role="alert"
          className="mt-2 rounded-xl border border-[#c8102e] bg-[#c8102e]/5 px-3 py-2 text-sm font-semibold text-[#c8102e]"
        >
          Exception under review — figures violate U ≤ A ≤ C and are being reconciled.
        </p>
      )}
      <dl aria-live="polite" className="mt-2 divide-y divide-[#e5e7eb]">
        <Row label="Confirmed cash received" value={mockPeso(totals.confirmed)} strong />
        <Row label="Allocated" value={mockPeso(totals.allocated)} />
        <Row label="Utilized / disbursed" value={mockPeso(totals.utilized)} />
        <Row label="Remaining funds" value={mockPeso(totals.remaining)} strong />
        <Row label="Unallocated" value={mockPeso(totals.unallocated)} />
        <Row label="Allocated, not yet utilized" value={mockPeso(totals.allocatedNotUtilized)} />
        {totals.pledged > 0 && (
          <Row label="Pledged — not yet received" value={mockPeso(totals.pledged)} />
        )}
      </dl>
      {totals.reconciliationNote && (
        <p className="mt-2 text-sm text-[#6b7280]">{totals.reconciliationNote}</p>
      )}
      <p className="mt-3 text-xs text-[#6b7280]">
        Updated {mockDate(totals.updatedAt)}
        {totals.lastReconciliation
          ? ` · Last reconciliation ${mockDate(totals.lastReconciliation)}`
          : " · Not yet reconciled"}
      </p>
    </section>
  );
}
