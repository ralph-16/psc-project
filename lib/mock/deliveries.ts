export type DeliveryStatus = "Preparing" | "InTransit" | "Delivered" | "Verified";

export interface Delivery {
  id: string;
  campaignId: string;
  campaignTitle: string;
  items: string;
  destination: string;
  driver: string;
  vehicle: string;
  status: DeliveryStatus;
  eta: string;
  ledgerRef: string;
  /* --- Workflow attestation (LGU-WORKFLOW §§6–7; all optional, additive) --- */
  /** Staff identity that dispatched this batch (self-verify hard block). */
  dispatchedBy: string;
  /** Field-level acknowledgement by the receiving party. */
  acknowledgedBy?: string;
  acknowledgedQty?: number;
  acknowledgedAt?: string;
  /** Peso estimate of the batch (HIGH_VALUE_THRESHOLD gate). */
  valueEstimate?: number;
  /** Desk-level verification; absent = pending. */
  verification?: {
    type: "independent" | "lgu-self";
    by: string;
    at: string;
    note?: string;
  };
  /** Damaged/missing units moved to write-off/quarantine (never inventory). */
  writeOff?: { qty: number; reason: string; by: string }[];
  /** Fulfillment path (LGU-WORKFLOW §5): direct skips procurement. */
  path?: "direct" | "stock" | "procurement";
}

export const deliveries: Delivery[] = [
  { id: "del-001", campaignId: "cmp-hagonoy", campaignTitle: "Hagonoy Flood Relief", items: "400 rice packs + 400 water bottles", destination: "Brgy. San Roque, Hagonoy", driver: "R. Aquino", vehicle: "Truck BH-214", status: "Verified", eta: "2026-10-03T17:30:00+08:00", ledgerRef: "TX-UGNAY-004821", dispatchedBy: "Warehouse (J. Cruz)", acknowledgedBy: "Brgy. San Roque receiver", acknowledgedQty: 800, acknowledgedAt: "2026-10-03T17:45:00+08:00", valueEstimate: 96000, path: "direct", verification: { type: "independent", by: "Kalinga Foundation field auditor", at: "2026-10-03T19:00:00+08:00" } },
  { id: "del-002", campaignId: "cmp-san-fernando", campaignTitle: "San Fernando Lahar Response", items: "600 water bottles + 200 medicine packs", destination: "Brgy. Telabastagan, San Fernando", driver: "J. Ramos", vehicle: "Truck PF-089", status: "InTransit", eta: "2026-10-05T10:00:00+08:00", ledgerRef: "TX-UGNAY-004824", dispatchedBy: "Warehouse (J. Cruz)", valueEstimate: 42000, path: "procurement" },
  { id: "del-003", campaignId: "cmp-calumpit", campaignTitle: "Calumpit River Flooding", items: "300 canned bundles + 300 sleeping mats", destination: "Brgy. Bulusan, Calumpit", driver: "M. Reyes", vehicle: "Van CV-311", status: "Delivered", eta: "2026-10-04T09:00:00+08:00", ledgerRef: "TX-UGNAY-004819", dispatchedBy: "Warehouse (J. Cruz)", acknowledgedBy: "Brgy. Bulusan receiver", acknowledgedQty: 585, acknowledgedAt: "2026-10-04T09:30:00+08:00", valueEstimate: 31000, path: "direct", writeOff: [{ qty: 15, reason: "Water-damaged in transit — quarantined", by: "M. Reyes" }] },
  { id: "del-004", campaignId: "cmp-santa-maria", campaignTitle: "Santa Maria Stock Replenishment", items: "250 baby care sets + 250 rice packs", destination: "Brgy. Poblacion, Santa Maria", driver: "L. Gomez", vehicle: "Truck SM-102", status: "Preparing", eta: "2026-10-06T14:00:00+08:00", ledgerRef: "TX-UGNAY-004826", dispatchedBy: "Warehouse (J. Cruz)", valueEstimate: 28000, path: "stock" },
];
