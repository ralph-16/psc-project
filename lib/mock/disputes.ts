/**
 * Disputes & chargebacks (donor workflow §§5, 10). A dispute never rewrites
 * history: the trace timeline keeps every event and adds dispute states.
 * Financial issues route to the fund administrator / gateway (UGNAY holds no
 * money and cannot refund); tracking errors route to UGNAY support. Every
 * report gets a reference ID; reports persist to a local inbox for the demo.
 */

export type DisputeCategory = "payment" | "tracking";
export type DisputeStatus = "submitted" | "under-review" | "resolved";

export interface Dispute {
  id: string;
  traceId: string;
  ledgerRef?: string;
  category: DisputeCategory;
  detail: string;
  status: DisputeStatus;
  at: string;
}

export const DISPUTES_KEY = "ugnay-disputes";

export const DISPUTE_ROUTING: Record<
  DisputeCategory,
  { label: string; contact: string; note: string }
> = {
  payment: {
    label: "Fund administrator / payment provider",
    contact: "Bulacan Provincial Treasury (Trust Fund) · treasury@bulacan.gov.ph",
    note: "UGNAY is a transparency engine, not a fund holder — it cannot promise or process refunds. Only the fund administrator or gateway can move money.",
  },
  tracking: {
    label: "UGNAY support",
    contact: "support@ugnay.ph",
    note: "For trail errors, missing receipts, or wrong campaign attribution on an otherwise settled payment.",
  },
};

export const seedDisputes: Dispute[] = [
  {
    id: "DSP-1042",
    traceId: "UGN-7751",
    ledgerRef: "TX-UGNAY-004833",
    category: "payment",
    detail: "Possible duplicate charge — donor sees two debits for one pledge.",
    status: "under-review",
    at: "2026-10-04T10:20:00+08:00",
  },
];

export function newDisputeId() {
  return "DSP-" + Math.floor(1000 + Math.random() * 9000);
}

export function readDisputeInbox(): Dispute[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(DISPUTES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function fileDispute(d: Omit<Dispute, "id" | "at" | "status">): Dispute {
  const record: Dispute = {
    ...d,
    id: newDisputeId(),
    status: "submitted",
    at: new Date().toISOString(),
  };
  try {
    const list = readDisputeInbox();
    list.push(record);
    window.localStorage.setItem(DISPUTES_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — reference still issued */
  }
  return record;
}

export function disputesForTrace(traceId: string): Dispute[] {
  const norm = traceId.trim().toUpperCase();
  return [
    ...seedDisputes.filter((d) => d.traceId.toUpperCase() === norm),
    ...readDisputeInbox().filter((d) => d.traceId.toUpperCase() === norm),
  ];
}
