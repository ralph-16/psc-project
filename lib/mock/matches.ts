export interface MatchBreakdown {
  label: string;
  matched: number;
  pledged: number;
}

export interface SponsorMatch {
  id: string;
  sponsorId: string;
  sponsorName: string;
  campaignId: string;
  campaignTitle: string;
  /** Overall match completion, 0–100 */
  percent: number;
  breakdown: MatchBreakdown[];
  note: string;
}

/**
 * Canonical example: 84% overall match completion.
 * Breakdown mirrors per-category matched/pledged pairs.
 */
export const sponsorMatches: SponsorMatch[] = [
  {
    id: "match-001",
    sponsorId: "spn-005",
    sponsorName: "Kalinga Foundation",
    campaignId: "cmp-hagonoy",
    campaignTitle: "Hagonoy Flood Relief",
    percent: 84,
    breakdown: [
      { label: "Rice packs", matched: 27, pledged: 30 },
      { label: "Water bottles", matched: 16, pledged: 20 },
      { label: "Hygiene kits", matched: 18, pledged: 20 },
      { label: "Sleeping mats", matched: 12, pledged: 15 },
      { label: "Medicine packs", matched: 7, pledged: 10 },
      { label: "Baby care sets", matched: 4, pledged: 5 },
    ],
    note: "Kalinga Foundation matches verified individual donations 1:1 up to the pledged ceiling per category.",
  },
  {
    id: "match-002",
    sponsorId: "spn-001",
    sponsorName: "Central Luzon Foods Inc.",
    campaignId: "cmp-calumpit",
    campaignTitle: "Calumpit River Flooding",
    percent: 62,
    breakdown: [
      { label: "Canned bundles", matched: 18, pledged: 30 },
      { label: "Rice packs", matched: 12, pledged: 20 },
      { label: "Water bottles", matched: 11, pledged: 20 },
    ],
    note: "In-kind food match released in tranches as pledges verify.",
  },
];

export function matchesForCampaign(campaignId: string): SponsorMatch[] {
  return sponsorMatches.filter((m) => m.campaignId === campaignId);
}
