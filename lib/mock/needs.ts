import type { Severity } from "./campaigns";

export interface NeedItem {
  id: string;
  campaignId: string;
  item: string;
  category: string;
  required: number;
  secured: number;
  remaining: number;
  unit: string;
  severity: Severity;
}

function need(
  n: Omit<NeedItem, "remaining">,
): NeedItem {
  return { ...n, remaining: n.required - n.secured };
}

export const needs: NeedItem[] = [
  need({ id: "need-hag-rice", campaignId: "cmp-hagonoy", item: "Rice packs (5kg)", category: "Food", required: 1500, secured: 620, unit: "packs", severity: "Critical" }),
  need({ id: "need-hag-water", campaignId: "cmp-hagonoy", item: "Drinking water (6L)", category: "Water", required: 2000, secured: 840, unit: "bottles", severity: "Critical" }),
  need({ id: "need-hag-hygiene", campaignId: "cmp-hagonoy", item: "Hygiene kits", category: "Non-food", required: 1500, secured: 690, unit: "kits", severity: "Critical" }),
  need({ id: "need-cal-water", campaignId: "cmp-calumpit", item: "Drinking water (6L)", category: "Water", required: 1600, secured: 900, unit: "bottles", severity: "High" }),
  need({ id: "need-cal-canned", campaignId: "cmp-calumpit", item: "Canned goods bundle", category: "Food", required: 1400, secured: 770, unit: "bundles", severity: "High" }),
  need({ id: "need-cal-mats", campaignId: "cmp-calumpit", item: "Sleeping mats", category: "Shelter", required: 1200, secured: 640, unit: "pcs", severity: "High" }),
  need({ id: "need-sm-rice", campaignId: "cmp-santa-maria", item: "Rice packs (5kg)", category: "Food", required: 1200, secured: 800, unit: "packs", severity: "Elevated" }),
  need({ id: "need-sm-baby", campaignId: "cmp-santa-maria", item: "Baby formula & diapers", category: "Care", required: 800, secured: 500, unit: "sets", severity: "Elevated" }),
  need({ id: "need-sm-mats", campaignId: "cmp-santa-maria", item: "Sleeping mats", category: "Shelter", required: 1000, secured: 650, unit: "pcs", severity: "Elevated" }),
  need({ id: "need-con-hygiene", campaignId: "cmp-concepcion", item: "Hygiene kits", category: "Non-food", required: 1400, secured: 1000, unit: "kits", severity: "Elevated" }),
  need({ id: "need-con-meds", campaignId: "cmp-concepcion", item: "Maintenance medicines", category: "Health", required: 1400, secured: 960, unit: "packs", severity: "Elevated" }),
  need({ id: "need-sr-standby", campaignId: "cmp-sta-rosa", item: "Standby family packs", category: "Food", required: 1200, secured: 1050, unit: "packs", severity: "Moderate" }),
  need({ id: "need-sr-water", campaignId: "cmp-sta-rosa", item: "Drinking water (6L)", category: "Water", required: 800, secured: 650, unit: "bottles", severity: "Moderate" }),
  need({ id: "need-sf-rice", campaignId: "cmp-san-fernando", item: "Rice packs (5kg)", category: "Food", required: 2000, secured: 600, unit: "packs", severity: "Critical" }),
  need({ id: "need-sf-water", campaignId: "cmp-san-fernando", item: "Drinking water (6L)", category: "Water", required: 2200, secured: 700, unit: "bottles", severity: "Critical" }),
  need({ id: "need-sf-meds", campaignId: "cmp-san-fernando", item: "First-aid & medicines", category: "Health", required: 1800, secured: 500, unit: "packs", severity: "Critical" }),
];

export function needsForCampaign(campaignId: string): NeedItem[] {
  return needs.filter((n) => n.campaignId === campaignId);
}
