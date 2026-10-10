/**
 * Opt-in Supporter Wall (donor workflow §9). Donors are anonymous by default;
 * only Confirmed donations with explicit opt-in appear, by validated display
 * name only — never amounts, never rankings. Server-side enforcement is out of
 * scope for the prototype; the inbox pattern keeps opt-ins local to the demo.
 */

export interface SupporterEntry {
  displayName: string;
  campaignId: string;
  campaignTitle: string;
  traceId: string;
  at: string;
}

export const WALL_KEY = "ugnay-wall";

const NAME_RE = /^[A-Za-z0-9 .'\-]{2,30}$/;

/** Display names: 2–30 chars, plain punctuation only (no amounts, no links). */
export function isValidDisplayName(name: string): boolean {
  return NAME_RE.test(name.trim());
}

export const seedWall: SupporterEntry[] = [
  { displayName: "Marie S.", campaignId: "cmp-hagonoy", campaignTitle: "Hagonoy Flood Relief", traceId: "UGN-8842", at: "2026-10-03T09:20:00+08:00" },
  { displayName: "Kuya J.", campaignId: "cmp-hagonoy", campaignTitle: "Hagonoy Flood Relief", traceId: "UGN-9102", at: "2026-10-03T15:44:00+08:00" },
  { displayName: "Ana D.", campaignId: "cmp-calumpit", campaignTitle: "Calumpit River Flooding", traceId: "UGN-7741", at: "2026-10-02T08:30:00+08:00" },
  { displayName: "M. Torres", campaignId: "cmp-bulacan", campaignTitle: "Bulacan Flood Relief Campaign", traceId: "UGN-8831", at: "2026-10-04T11:10:00+08:00" },
];

export function readWallInbox(): SupporterEntry[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(WALL_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter(
      (e): e is SupporterEntry =>
        !!e && typeof e.displayName === "string" && typeof e.campaignId === "string",
    );
  } catch {
    return [];
  }
}

export function addWallEntry(entry: Omit<SupporterEntry, "at">): void {
  try {
    const list = readWallInbox();
    if (list.some((e) => e.traceId === entry.traceId)) return; // one wall entry per donation
    list.push({ ...entry, at: new Date().toISOString() });
    window.localStorage.setItem(WALL_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function wallForCampaign(campaignId: string): SupporterEntry[] {
  return [
    ...seedWall.filter((e) => e.campaignId === campaignId),
    ...readWallInbox().filter((e) => e.campaignId === campaignId),
  ];
}
