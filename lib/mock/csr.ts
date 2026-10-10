import type { Campaign } from "./campaigns";
import { needsForCampaign } from "./needs";
import { CSR_PROFILE_KEY } from "./policy";

/**
 * Rules-based SponsorMatch engine (CORPORATE-WORKFLOW §1). Scores are computed
 * from an explicit CSR profile — never pay-to-rank — and every point is
 * explained. Seeded `SponsorMatch.percent` figures elsewhere remain the
 * *completion* of pledged tranches; this engine produces the *fit* ranking.
 */

export interface CsrProfile {
  /** Need categories, e.g. ["Food", "Water", "Shelter"] */
  causes: string[];
  /** Municipalities / provinces covered, e.g. ["Hagonoy", "Bulacan"] */
  areas: string[];
  /** Maximum commitment capacity in comparable units (packs/bottles) */
  capacity: number;
  /** SDG alignment labels, e.g. ["SDG 2 · Zero Hunger"] */
  sdg: string[];
}

export interface FitReason {
  label: string;
  detail: string;
  points: number;
  max: number;
}

export interface FitScore {
  percent: number;
  reasons: FitReason[];
}

/** Demo profile used until onboarding captures real preferences. */
export const DEFAULT_CSR_PROFILE: CsrProfile = {
  causes: ["Food", "Water", "Hygiene kits"],
  areas: ["Hagonoy", "Calumpit", "Bulacan"],
  capacity: 20000,
  sdg: ["SDG 2 · Zero Hunger", "SDG 6 · Clean Water"],
};

export const CSR_CAUSES = [
  "Food",
  "Water",
  "Hygiene kits",
  "Shelter",
  "Health",
  "Logistics",
];

export const CSR_AREAS = [
  "Hagonoy",
  "Calumpit",
  "Santa Maria",
  "Concepcion",
  "Sta. Rosa",
  "San Fernando",
  "Bulacan",
  "Pampanga",
];

const URGENCY_POINTS: Record<Campaign["severity"], number> = {
  Critical: 10,
  High: 7,
  Elevated: 4,
  Moderate: 2,
};

/**
 * Transparent scoring. Weights: geography 40 / cause 30 / capacity 20 /
 * urgency 10. Every rule returns its points plus a human-readable reason.
 */
export function scoreFit(profile: CsrProfile, campaign: Campaign): FitScore {
  const reasons: FitReason[] = [];

  // Geography (40): municipality > province > none.
  const muniHit = profile.areas.some(
    (a) => a.toLowerCase() === campaign.municipality.toLowerCase(),
  );
  const provHit =
    !muniHit &&
    profile.areas.some(
      (a) => a.toLowerCase() === campaign.province.toLowerCase(),
    );
  const geoPoints = muniHit ? 40 : provHit ? 25 : 0;
  reasons.push({
    label: "Geographic coverage",
    detail: muniHit
      ? `${campaign.municipality} is inside the covered areas.`
      : provHit
        ? `${campaign.province} is covered, but not ${campaign.municipality} specifically.`
        : `No covered area matches ${campaign.municipality}, ${campaign.province}.`,
    points: geoPoints,
    max: 40,
  });

  // Cause (30): share of required units in profile causes.
  const needs = needsForCampaign(campaign.id);
  const totalRequired = needs.reduce((sum, n) => sum + n.required, 0) || 1;
  const matchedRequired = needs
    .filter((n) =>
      profile.causes.some(
        (c) =>
          n.category.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(n.category.toLowerCase()) ||
          n.item.toLowerCase().includes(c.toLowerCase()),
      ),
    )
    .reduce((sum, n) => sum + n.required, 0);
  const causePoints = Math.round((30 * matchedRequired) / totalRequired);
  reasons.push({
    label: "Cause alignment",
    detail:
      matchedRequired > 0
        ? `${matchedRequired.toLocaleString("en-PH")} of ${totalRequired.toLocaleString("en-PH")} required units fall under the selected causes.`
        : "None of the campaign's required units match the selected causes.",
    points: causePoints,
    max: 30,
  });

  // Capacity (20): can the profile cover the requirement?
  const capacityPoints =
    totalRequired <= 0
      ? 20
      : Math.min(20, Math.round((20 * profile.capacity) / totalRequired));
  reasons.push({
    label: "Capacity fit",
    detail: `Stated capacity ${profile.capacity.toLocaleString("en-PH")} vs ${totalRequired.toLocaleString("en-PH")} required units.`,
    points: capacityPoints,
    max: 20,
  });

  // Urgency (10): fixed severity table, identical for every sponsor.
  const urgencyPoints = URGENCY_POINTS[campaign.severity];
  reasons.push({
    label: "Urgency",
    detail: `${campaign.severity} · ${campaign.severityAction} — same table for every sponsor.`,
    points: urgencyPoints,
    max: 10,
  });

  const percent = Math.min(
    100,
    reasons.reduce((sum, r) => sum + r.points, 0),
  );
  return { percent, reasons };
}

export function getCsrProfile(): CsrProfile {
  try {
    if (typeof window === "undefined") return DEFAULT_CSR_PROFILE;
    const raw = window.localStorage.getItem(CSR_PROFILE_KEY);
    if (!raw) return DEFAULT_CSR_PROFILE;
    const parsed = JSON.parse(raw) as Partial<CsrProfile>;
    return {
      causes: Array.isArray(parsed.causes) ? parsed.causes : DEFAULT_CSR_PROFILE.causes,
      areas: Array.isArray(parsed.areas) ? parsed.areas : DEFAULT_CSR_PROFILE.areas,
      capacity:
        typeof parsed.capacity === "number" && parsed.capacity > 0
          ? Math.floor(parsed.capacity)
          : DEFAULT_CSR_PROFILE.capacity,
      sdg: Array.isArray(parsed.sdg) ? parsed.sdg : DEFAULT_CSR_PROFILE.sdg,
    };
  } catch {
    return DEFAULT_CSR_PROFILE;
  }
}

export function setCsrProfile(profile: CsrProfile): void {
  try {
    window.localStorage.setItem(CSR_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage unavailable */
  }
}
