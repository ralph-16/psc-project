export type SponsorType = "Corporate" | "LGU";

export interface Sponsor {
  id: string;
  name: string;
  type: SponsorType;
  contribution: number;
  campaignsSupported: number;
  focus: string;
  since: string;
}

export const sponsors: Sponsor[] = [
  { id: "spn-001", name: "Central Luzon Foods Inc.", type: "Corporate", contribution: 450000, campaignsSupported: 4, focus: "Food packs & logistics", since: "2024" },
  { id: "spn-002", name: "Pampanga Builders Group", type: "Corporate", contribution: 320000, campaignsSupported: 3, focus: "Shelter & transport", since: "2025" },
  { id: "spn-003", name: "City Government of Malolos", type: "LGU", contribution: 280000, campaignsSupported: 5, focus: "Warehousing & volunteers", since: "2023" },
  { id: "spn-004", name: "Bulacan Water District", type: "LGU", contribution: 150000, campaignsSupported: 2, focus: "Drinking water", since: "2025" },
  { id: "spn-005", name: "Kalinga Foundation", type: "Corporate", contribution: 500000, campaignsSupported: 6, focus: "Matching fund pool", since: "2023" },
];
