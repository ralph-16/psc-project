export type Severity = "Critical" | "High" | "Elevated" | "Moderate";

export const SEVERITY_ACTION: Record<Severity, string> = {
  Critical: "Immediate aid",
  High: "Within 24h",
  Elevated: "Replenishment",
  Moderate: "Monitoring",
};

export type CampaignStatus =
  | "Draft"
  | "Active"
  | "Partially Fulfilled"
  | "Fulfilled"
  | "Closed";

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  barangay: string;
  province: string;
  severity: Severity;
  severityAction: string;
  disaster: string;
  required: number;
  secured: number;
  remaining: number;
  /** 0–100 */
  progress: number;
  families: number;
  featured: boolean;
  evacuationCenter?: string;
  description: string;
  updatedAt: string;
  /* --- Transparency figures (MOCK DATA — static demo only, no backend) --- */
  /** Peso amounts (whole pesos). Confirmed cash received. */
  confirmedCash?: number;
  /** Funds assigned to approved allocations. */
  allocatedCash?: number;
  /** Funds spent/disbursed against procurement/delivery. */
  utilizedCash?: number;
  status?: CampaignStatus;
  /** "cash" | "inkind" | "service" accepted. */
  donationTypes?: string[];
  targetDate?: string;
  validatingOrg?: string;
  permitNo?: string;
  permitIssuer?: string;
  fundAdministrator?: string;
  lastReconciliation?: string;
  reconciliationNote?: string;
  finalReport?: {
    raised: number;
    allocated: number;
    utilized: number;
    remaining: number;
    remainingNote: string;
    reconciliationDate: string;
  };
}

function build(
  c: Omit<Campaign, "remaining" | "progress" | "severityAction">,
): Campaign {
  const remaining = c.required - c.secured;
  const progress = Math.round((c.secured / c.required) * 100);
  const status: CampaignStatus =
    c.status ?? (progress >= 100 ? "Fulfilled" : progress > 0 ? "Partially Fulfilled" : "Active");
  return { ...c, remaining, progress, severityAction: SEVERITY_ACTION[c.severity], status };
}

export const campaigns: Campaign[] = [
  build({
    id: "cmp-hagonoy",
    slug: "hagonoy-flood-relief",
    title: "Hagonoy Flood Relief",
    municipality: "Hagonoy",
    barangay: "Brgy. San Roque",
    province: "Bulacan",
    severity: "Critical",
    disaster: "Typhoon & monsoon flooding",
    required: 5000,
    secured: 2150,
    families: 1240,
    featured: true,
    description:
      "Sustained flooding across coastal barangays. Priority needs are rice packs, drinking water, and hygiene kits for 1,240 displaced families.",
    updatedAt: "2026-10-04T08:00:00+08:00",
    confirmedCash: 465500,
    allocatedCash: 280000,
    utilizedCash: 190000,
    status: "Partially Fulfilled",
    donationTypes: ["cash", "inkind"],
    targetDate: "2026-11-15",
    validatingOrg: "Hagonoy DRRM Office",
    permitNo: "DSWD-SB-2026-0422",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Hagonoy Municipal Treasury (Trust Fund 2026-08-FL)",
    lastReconciliation: "2026-10-01",
    reconciliationNote: "₱90,000 is allocated but still awaiting procurement/delivery.",
  }),
  build({
    id: "cmp-calumpit",
    slug: "calumpit-river-flooding",
    title: "Calumpit River Flooding",
    municipality: "Calumpit",
    barangay: "Brgy. Bulusan",
    province: "Bulacan",
    severity: "High",
    disaster: "River overflow flooding",
    required: 4200,
    secured: 2310,
    families: 980,
    featured: false,
    description:
      "Pampanga River overflow displaced riverside communities. Drinking water and canned goods needed within 24 hours.",
    updatedAt: "2026-10-03T16:30:00+08:00",
    confirmedCash: 298400,
    allocatedCash: 180000,
    utilizedCash: 120000,
    status: "Active",
    donationTypes: ["cash"],
    targetDate: "2026-11-10",
    validatingOrg: "Calumpit DRRM Office",
    permitNo: "DSWD-SB-2026-0431",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Calumpit Municipal Treasury (Trust Fund 2026-09-RV)",
    lastReconciliation: "2026-10-02",
  }),
  build({
    id: "cmp-santa-maria",
    slug: "santa-maria-replenishment",
    title: "Santa Maria Stock Replenishment",
    municipality: "Santa Maria",
    barangay: "Brgy. Poblacion",
    province: "Bulacan",
    severity: "Elevated",
    disaster: "Post-typhoon replenishment",
    required: 3000,
    secured: 1950,
    families: 720,
    featured: false,
    description:
      "Evacuation centers stabilizing. Replenishing rice, sleeping mats, and baby supplies for 720 families.",
    updatedAt: "2026-10-02T10:15:00+08:00",
    confirmedCash: 152000,
    allocatedCash: 90000,
    utilizedCash: 60000,
    status: "Partially Fulfilled",
    donationTypes: ["cash", "inkind"],
    targetDate: "2026-11-20",
    validatingOrg: "Santa Maria DRRM Office",
    permitNo: "DSWD-SB-2026-0409",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Santa Maria Municipal Treasury",
  }),
  build({
    id: "cmp-concepcion",
    slug: "concepcion-relief-drive",
    title: "Concepcion Relief Drive",
    municipality: "Concepcion",
    barangay: "Brgy. San Nicolas",
    province: "Tarlac",
    severity: "Elevated",
    disaster: "Flash-flood replenishment",
    required: 2800,
    secured: 1960,
    families: 640,
    featured: false,
    description:
      "Flash floods receding. Replenishment round for hygiene kits and maintenance medicines for 640 families.",
    updatedAt: "2026-10-01T14:45:00+08:00",
    confirmedCash: 98500,
    allocatedCash: 60000,
    utilizedCash: 41000,
    status: "Active",
    donationTypes: ["inkind", "cash"],
    targetDate: "2026-11-12",
    validatingOrg: "Concepcion DRRM Office",
    permitNo: "DSWD-SB-2026-0395",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Concepcion Municipal Treasury",
  }),
  build({
    id: "cmp-sta-rosa",
    slug: "sta-rosa-monitoring",
    title: "Sta. Rosa Monitoring Round",
    municipality: "Sta. Rosa",
    barangay: "Brgy. Rizal",
    province: "Nueva Ecija",
    severity: "Moderate",
    disaster: "Preventive monitoring",
    required: 2000,
    secured: 1700,
    families: 410,
    featured: false,
    evacuationCenter: "Sta. Rosa Central Evacuation Center",
    description:
      "Situation stable under monitoring. Standby packs pre-positioned for 410 families near the evacuation center.",
    updatedAt: "2026-09-30T09:00:00+08:00",
    confirmedCash: 73000,
    allocatedCash: 40000,
    utilizedCash: 40000,
    status: "Active",
    donationTypes: ["cash"],
    targetDate: "2026-12-01",
    validatingOrg: "Sta. Rosa DRRM Office",
    permitNo: "DSWD-SB-2026-0388",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Sta. Rosa Municipal Treasury",
  }),
  build({
    id: "cmp-san-fernando",
    slug: "san-fernando-lahar-response",
    title: "San Fernando Lahar Response",
    municipality: "San Fernando",
    barangay: "Brgy. Telabastagan",
    province: "Pampanga",
    severity: "Critical",
    disaster: "Lahar flow displacement",
    required: 6000,
    secured: 1800,
    families: 1520,
    featured: true,
    description:
      "Lahar flows displaced hillside communities. Immediate aid: water, rice, sleeping mats, and medicines for 1,520 families.",
    updatedAt: "2026-10-04T06:20:00+08:00",
    confirmedCash: 512000,
    allocatedCash: 300000,
    utilizedCash: 175000,
    status: "Partially Fulfilled",
    donationTypes: ["cash", "inkind"],
    targetDate: "2026-11-30",
    validatingOrg: "San Fernando DRRM Office",
    permitNo: "DSWD-SB-2026-0440",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "San Fernando City Treasury (Trust Fund 2026-10-LH)",
    lastReconciliation: "2026-10-03",
  }),
  build({
    id: "cmp-bulacan",
    slug: "bulacan-flood-relief",
    title: "Bulacan Flood Relief Campaign",
    municipality: "Hagonoy",
    barangay: "Multiple barangays",
    province: "Bulacan",
    severity: "Critical",
    disaster: "Typhoon & monsoon flooding",
    required: 20000,
    secured: 14000,
    families: 2000,
    featured: true,
    description:
      "Province-wide flood response across coastal and riverside barangays. Food packs, drinking water, and hygiene kits for 2,000 affected households.",
    updatedAt: "2026-10-05T08:00:00+08:00",
    confirmedCash: 1284500,
    allocatedCash: 850000,
    utilizedCash: 620000,
    status: "Partially Fulfilled",
    donationTypes: ["cash", "inkind", "service"],
    targetDate: "2026-11-30",
    validatingOrg: "Bulacan Provincial DRRM Office",
    permitNo: "DSWD-SB-2026-0418",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Bulacan Provincial Treasury (Trust Fund 2026-08-FL)",
    lastReconciliation: "2026-09-15",
    reconciliationNote: "₱230,000 is allocated but still awaiting procurement/delivery.",
  }),
  build({
    id: "cmp-bulacan-recovery",
    slug: "bulacan-typhoon-recovery",
    title: "Bulacan Typhoon Recovery — July 2026",
    municipality: "Hagonoy",
    barangay: "Multiple barangays",
    province: "Bulacan",
    severity: "Moderate",
    disaster: "Typhoon",
    required: 12000,
    secured: 12000,
    families: 640,
    featured: false,
    description:
      "Completed July typhoon recovery. Fully delivered and verified — see the final report for where every peso went.",
    updatedAt: "2026-09-02T17:00:00+08:00",
    confirmedCash: 860000,
    allocatedCash: 860000,
    utilizedCash: 845000,
    status: "Closed",
    donationTypes: ["cash"],
    targetDate: "2026-08-30",
    validatingOrg: "Bulacan Provincial DRRM Office",
    permitNo: "DSWD-SB-2026-0331",
    permitIssuer: "DSWD Standards Bureau",
    fundAdministrator: "Bulacan Provincial Treasury (Trust Fund 2026-07-TY)",
    lastReconciliation: "2026-09-02",
    finalReport: {
      raised: 860000,
      allocated: 860000,
      utilized: 845000,
      remaining: 15000,
      remainingNote: "₱15,000 unspent after final delivery; returned to the fund administrator reserve with board approval (Resolution 2026-118).",
      reconciliationDate: "2026-09-02",
    },
  }),
];

export function getCampaign(idOrSlug: string): Campaign | undefined {
  return campaigns.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}
