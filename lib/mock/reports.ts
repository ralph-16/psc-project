export interface Report {
  id: string;
  title: string;
  period: string;
  type: "Transparency" | "Disbursement" | "Field" | "Audit";
  pages: number;
  downloads: number;
  updatedAt: string;
}

export const reports: Report[] = [
  { id: "rep-001", title: "Q3 2026 Transparency Report", period: "Jul – Sep 2026", type: "Transparency", pages: 24, downloads: 1240, updatedAt: "2026-10-01" },
  { id: "rep-002", title: "Typhoon Maring Disbursement Summary", period: "Sep 28 – Oct 04, 2026", type: "Disbursement", pages: 12, downloads: 860, updatedAt: "2026-10-04" },
  { id: "rep-003", title: "Hagonoy Field Verification Notes", period: "Oct 03 – 04, 2026", type: "Field", pages: 8, downloads: 412, updatedAt: "2026-10-04" },
  { id: "rep-004", title: "September Ledger Audit Extract", period: "Sep 2026", type: "Audit", pages: 18, downloads: 388, updatedAt: "2026-09-30" },
];
