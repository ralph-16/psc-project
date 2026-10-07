import type { Campaign } from "./campaigns";

/**
 * MOCK aggregation for the DonationTotalPanel (static demo figures only).
 * Definitions: C = confirmedCash; A = allocatedCash; U = utilizedCash;
 * R = C - U. Invariant U <= A <= C — violations flag an exception badge.
 */
export interface MockTotals {
  confirmed: number;
  allocated: number;
  utilized: number;
  remaining: number;
  unallocated: number;
  allocatedNotUtilized: number;
  pledged: number;
  exception: boolean;
  lastReconciliation: string | null;
  reconciliationNote: string | null;
  updatedAt: string;
}

export function mockTotalsFor(c: Campaign): MockTotals {
  const confirmed = c.confirmedCash ?? 0;
  const allocated = c.allocatedCash ?? 0;
  const utilized = c.utilizedCash ?? 0;
  return {
    confirmed,
    allocated,
    utilized,
    remaining: confirmed - utilized,
    unallocated: confirmed - allocated,
    allocatedNotUtilized: allocated - utilized,
    pledged: 0,
    exception: utilized > allocated || allocated > confirmed,
    lastReconciliation: c.lastReconciliation ?? null,
    reconciliationNote: c.reconciliationNote ?? null,
    updatedAt: c.updatedAt,
  };
}

/** Format whole pesos as ₱1,284,500. */
export function mockPeso(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}₱${Math.abs(Math.round(n)).toLocaleString("en-PH")}`;
}

/** "Oct 5, 2026" style date for static mock timestamps (deterministic). */
export function mockDate(iso: string): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/**
 * "Oct 3, 9:12 AM" style datetime via pure string slicing — byte-identical on
 * server and client. NEVER use Date.toLocaleString in a render path: Node and
 * browser ICU versions format differently and break hydration.
 */
export function mockDateTime(iso: string): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return iso;
  const hour = Number(m[4]);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${h12}:${m[5]} ${ampm}`;
}
