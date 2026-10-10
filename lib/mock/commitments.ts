/**
 * Corporate ↔ LGU commitment ledger (CORPORATE-WORKFLOW §§2–3, 5;
 * LGU-WORKFLOW §4). In-kind pledges are Proposed Commitments until confirmed;
 * only confirmed quantities reduce the relief gap, and physical receipt moves
 * quantities from Confirmed Incoming into Available Inventory (never counted
 * twice). Cash follows the same states; restricted cash bypasses pooling.
 */

export type CommitmentState =
  | "proposed"
  | "confirmed"
  | "partially-received"
  | "received"
  | "cancelled";

export interface CommitmentEvent {
  at: string;
  actor: string;
  action: string;
  detail?: string;
}

export interface VarianceResolution {
  resolvedBy: string;
  resolvedAt: string;
  /** Quantity formally written off or waived (0 when fully delivered later). */
  writtenOff: number;
  reason: string;
  sponsorAcknowledged: boolean;
}

export interface Commitment {
  id: string;
  sponsorId: string;
  sponsorName: string;
  campaignId: string;
  campaignTitle: string;
  kind: "inkind" | "cash";
  item: string;
  unit: string;
  /** Original promise — never mutated; history preserves it. */
  pledged: number;
  /** Verified physical receipt so far. */
  received: number;
  state: CommitmentState;
  expectedDate: string;
  /** Restricted funds bypass automatic pooling and track individually. */
  restricted?: boolean;
  resolution?: VarianceResolution;
  ledgerRef: string;
  history: CommitmentEvent[];
}

export const commitments: Commitment[] = [
  {
    id: "cm-001",
    sponsorId: "spn-005",
    sponsorName: "Kalinga Foundation",
    campaignId: "cmp-hagonoy",
    campaignTitle: "Hagonoy Flood Relief",
    kind: "inkind",
    item: "Hygiene kits",
    unit: "kits",
    pledged: 5000,
    received: 4500,
    state: "partially-received",
    expectedDate: "2026-10-02",
    ledgerRef: "TX-UGNAY-004821",
    history: [
      { at: "2026-09-24T09:00:00+08:00", actor: "Kalinga Foundation", action: "Pledge submitted", detail: "5,000 kits proposed." },
      { at: "2026-09-25T14:20:00+08:00", actor: "Bulacan PDRRMO", action: "Commitment confirmed", detail: "Accepted into incoming pipeline." },
      { at: "2026-10-01T16:40:00+08:00", actor: "Malolos warehouse", action: "Partial receipt logged", detail: "4,500 kits received; 500 outstanding." },
    ],
  },
  {
    id: "cm-002",
    sponsorId: "spn-001",
    sponsorName: "Central Luzon Foods Inc.",
    campaignId: "cmp-calumpit",
    campaignTitle: "Calumpit River Flooding",
    kind: "inkind",
    item: "Drinking water (6L)",
    unit: "bottles",
    pledged: 1200,
    received: 1200,
    state: "received",
    expectedDate: "2026-10-03",
    ledgerRef: "TX-UGNAY-004824",
    history: [
      { at: "2026-09-28T10:00:00+08:00", actor: "Central Luzon Foods Inc.", action: "Pledge submitted", detail: "1,200 bottles proposed." },
      { at: "2026-09-29T09:15:00+08:00", actor: "Bulacan PDRRMO", action: "Commitment confirmed" },
      { at: "2026-10-03T11:05:00+08:00", actor: "Calumpit forward post", action: "Receipt logged", detail: "Full receipt, sealed." },
    ],
  },
  {
    id: "cm-003",
    sponsorId: "spn-002",
    sponsorName: "Pampanga Builders Group",
    campaignId: "cmp-calumpit",
    campaignTitle: "Calumpit River Flooding",
    kind: "inkind",
    item: "Sleeping mats",
    unit: "pcs",
    pledged: 800,
    received: 785,
    state: "partially-received",
    expectedDate: "2026-10-04",
    ledgerRef: "TX-UGNAY-004826",
    history: [
      { at: "2026-09-30T13:00:00+08:00", actor: "Pampanga Builders Group", action: "Pledge submitted", detail: "800 mats proposed." },
      { at: "2026-10-01T08:40:00+08:00", actor: "Bulacan PDRRMO", action: "Commitment confirmed" },
      { at: "2026-10-04T15:20:00+08:00", actor: "Calumpit forward post", action: "Partial receipt logged", detail: "785 mats received; 15 water-damaged in transit." },
    ],
  },
  {
    id: "cm-004",
    sponsorId: "spn-005",
    sponsorName: "Kalinga Foundation",
    campaignId: "cmp-hagonoy",
    campaignTitle: "Hagonoy Flood Relief",
    kind: "cash",
    item: "Restricted tranche — WASH only",
    unit: "pesos",
    pledged: 150000,
    received: 150000,
    state: "received",
    expectedDate: "2026-09-20",
    restricted: true,
    ledgerRef: "TX-UGNAY-004790",
    history: [
      { at: "2026-09-18T09:00:00+08:00", actor: "Kalinga Foundation", action: "Restricted cash committed", detail: "WASH-only restriction; bypasses pooling." },
      { at: "2026-09-20T10:30:00+08:00", actor: "Provincial Treasury", action: "Receipt confirmed", detail: "Tracked individually per agreement." },
    ],
  },
  {
    id: "cm-005",
    sponsorId: "spn-002",
    sponsorName: "Pampanga Builders Group",
    campaignId: "cmp-san-fernando",
    campaignTitle: "San Fernando Lahar Response",
    kind: "inkind",
    item: "Family tents",
    unit: "sets",
    pledged: 300,
    received: 0,
    state: "proposed",
    expectedDate: "2026-10-12",
    ledgerRef: "TX-UGNAY-004831",
    history: [
      { at: "2026-10-06T09:00:00+08:00", actor: "Pampanga Builders Group", action: "Pledge submitted", detail: "300 tent sets proposed; awaiting LGU confirmation." },
    ],
  },
];

/** LocalStorage inbox for pledges created in-session via corporate contribute. */
export const CORPORATE_COMMITMENTS_KEY = "ugnay-commitments";

/** Quantities that reduce the relief gap: confirmed but not yet received. */
export function confirmedIncoming(list: Commitment[]): number {
  return list
    .filter((c) => c.kind === "inkind" && (c.state === "confirmed" || c.state === "partially-received"))
    .reduce((sum, c) => sum + Math.max(0, c.pledged - c.received), 0);
}

/** Remaining Gap = Required − Available Physical Stock − Confirmed Incoming. */
export function remainingGap(required: number, available: number, incoming: number): number {
  return Math.max(0, required - available - incoming);
}

export function isOverdue(c: Commitment, nowIso?: string): boolean {
  if (c.state === "received" || c.state === "cancelled") return false;
  const now = (nowIso ?? new Date().toISOString()).slice(0, 10);
  return c.expectedDate < now;
}

export function commitmentsForCampaign(campaignId: string): Commitment[] {
  return commitments.filter((c) => c.campaignId === campaignId);
}

export function outstandingOf(c: Commitment): number {
  return Math.max(0, c.pledged - c.received);
}

/**
 * Pure transfer-on-receipt: returns the updated record with receipt applied.
 * Moving received units out of Confirmed Incoming keeps gap math exact.
 */
export function applyReceipt(
  c: Commitment,
  qty: number,
  actor: string,
  atIso?: string,
): Commitment {
  const received = Math.min(c.pledged, c.received + Math.max(0, qty));
  const state: CommitmentState =
    received >= c.pledged ? "received" : received > 0 ? "partially-received" : c.state;
  return {
    ...c,
    received,
    state,
    history: [
      ...c.history,
      {
        at: atIso ?? new Date().toISOString(),
        actor,
        action: state === "received" ? "Receipt logged" : "Partial receipt logged",
        detail: `${received.toLocaleString("en-PH")} of ${c.pledged.toLocaleString("en-PH")} ${c.unit} received.`,
      },
    ],
  };
}
