export type TraceStage =
  | "Pledged"
  | "Confirmed"
  | "Allocated"
  | "InTransit"
  | "Delivered"
  | "Verified";

export const TRACE_STAGES: TraceStage[] = [
  "Pledged",
  "Confirmed",
  "Allocated",
  "InTransit",
  "Delivered",
  "Verified",
];

export interface TraceEvent {
  id: string;
  donationId: string;
  stage: TraceStage;
  timestamp: string;
  actor: string;
  note: string;
  evidence?: string;
  txRef: string;
}

/** Full trail for donation don-001 (TX-UGNAY-004821). */
export const traceTrail: TraceEvent[] = [
  { id: "tr-001", donationId: "don-001", stage: "Pledged", timestamp: "2026-10-03T09:12:00+08:00", actor: "Maria Santos (donor)", note: "₱1,000 pledged to Hagonoy Flood Relief via Ugnay.", txRef: "TX-UGNAY-004821" },
  { id: "tr-002", donationId: "don-001", stage: "Confirmed", timestamp: "2026-10-03T09:14:00+08:00", actor: "Ugnay payments", note: "Payment confirmed. Receipt issued to donor inbox.", evidence: "receipt.pdf", txRef: "TX-UGNAY-004821" },
  { id: "tr-003", donationId: "don-001", stage: "Allocated", timestamp: "2026-10-03T12:40:00+08:00", actor: "Bulacan Relief Desk", note: "Allocated to 20 rice packs + 20 water bottles for Brgy. San Roque.", txRef: "TX-UGNAY-004821" },
  { id: "tr-004", donationId: "don-001", stage: "InTransit", timestamp: "2026-10-03T15:02:00+08:00", actor: "Volunteer convoy #7", note: "Dispatched from Malolos warehouse. GPS ping logged.", evidence: "dispatch-photo.jpg", txRef: "TX-UGNAY-004821" },
  { id: "tr-005", donationId: "don-001", stage: "Delivered", timestamp: "2026-10-03T17:26:00+08:00", actor: "Brgy. San Roque receiver", note: "Received and signed by barangay coordinator.", evidence: "delivery-photo.jpg", txRef: "TX-UGNAY-004821" },
  { id: "tr-006", donationId: "don-001", stage: "Verified", timestamp: "2026-10-04T08:00:00+08:00", actor: "Ugnay field verifier", note: "Photo evidence cross-checked. Trail closed and ledger-sealed.", evidence: "verification-report.pdf", txRef: "TX-UGNAY-004821" },
];

export function traceForDonation(donationId: string): TraceEvent[] {
  return traceTrail.filter((t) => t.donationId === donationId);
}
