export type Severity = "Critical" | "High" | "Elevated" | "Moderate";

export const SEVERITY_ACTION: Record<Severity, string> = {
  Critical: "Immediate aid",
  High: "Within 24h",
  Elevated: "Replenishment",
  Moderate: "Monitoring",
};

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
}

function build(
  c: Omit<Campaign, "remaining" | "progress" | "severityAction">,
): Campaign {
  const remaining = c.required - c.secured;
  const progress = Math.round((c.secured / c.required) * 100);
  return { ...c, remaining, progress, severityAction: SEVERITY_ACTION[c.severity] };
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
  }),
];

export function getCampaign(idOrSlug: string): Campaign | undefined {
  return campaigns.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}
