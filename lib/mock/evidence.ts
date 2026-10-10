/**
 * Tiered evidence model (CORPORATE-WORKFLOW §4). Sponsors see baseline impact
 * plus granular evidence ONLY after an authorized LGU officer sanitizes it
 * (PII stripped). Unsanitized records never leave the LGU workspace.
 */

export type EvidenceTier = "baseline" | "granular";

export interface EvidencePhoto {
  src: string;
  caption: string;
}

export interface EvidenceRecord {
  id: string;
  deliveryId: string;
  campaignTitle: string;
  tier: EvidenceTier;
  sanitized: boolean;
  sanitizedBy?: string;
  sanitizedAt?: string;
  photos: EvidencePhoto[];
  documents: string[];
  note: string;
}

export const evidence: EvidenceRecord[] = [
  {
    id: "ev-001",
    deliveryId: "del-001",
    campaignTitle: "Hagonoy Flood Relief",
    tier: "granular",
    sanitized: true,
    sanitizedBy: "LGU Auditor (M. Villanueva)",
    sanitizedAt: "2026-10-03T18:20:00+08:00",
    photos: [
      { src: "/landing/evidence-volunteer-older.jpg", caption: "Distribution at Brgy. San Roque evacuation center — faces blurred, consent on file." },
    ],
    documents: ["receiving-report-del-001.pdf"],
    note: "Barangay-level summary cleared for sponsor tier.",
  },
  {
    id: "ev-002",
    deliveryId: "del-003",
    campaignTitle: "Calumpit River Flooding",
    tier: "granular",
    sanitized: false,
    photos: [
      { src: "/landing/evidence-volunteer-older.jpg", caption: "Raw field photo — pending PII review." },
    ],
    documents: ["receiving-report-del-003.pdf"],
    note: "Held in LGU workspace until an authorized officer sanitizes it.",
  },
  {
    id: "ev-003",
    deliveryId: "del-002",
    campaignTitle: "San Fernando Lahar Response",
    tier: "baseline",
    sanitized: true,
    sanitizedBy: "LGU Auditor (M. Villanueva)",
    sanitizedAt: "2026-10-04T09:00:00+08:00",
    photos: [],
    documents: ["dispatch-order-del-002.pdf"],
    note: "Baseline impact summary only — no field imagery attached yet.",
  },
];

/** What corporate dashboards may display. */
export function sponsorVisibleEvidence(): EvidenceRecord[] {
  return evidence.filter((e) => e.sanitized);
}

export function evidenceForDelivery(deliveryId: string): EvidenceRecord[] {
  return evidence.filter((e) => e.deliveryId === deliveryId);
}
