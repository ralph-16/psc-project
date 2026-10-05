import type { Severity } from "./campaigns";

export interface Disaster {
  id: string;
  name: string;
  type: string;
  severity: Severity;
  municipalities: string[];
  affectedFamilies: number;
  date: string;
  status: "Active" | "Monitoring" | "Resolved";
  evacuationCenters: number;
}

export const disasters: Disaster[] = [
  { id: "dis-001", name: "Typhoon Maring flooding", type: "Typhoon / Flood", severity: "Critical", municipalities: ["Hagonoy", "Calumpit", "Bulakan"], affectedFamilies: 4200, date: "2026-09-28", status: "Active", evacuationCenters: 14 },
  { id: "dis-002", name: "Pampanga River overflow", type: "River flood", severity: "High", municipalities: ["Calumpit", "Apalit"], affectedFamilies: 1800, date: "2026-09-30", status: "Active", evacuationCenters: 6 },
  { id: "dis-003", name: "Mt. Pinatubo lahar flow", type: "Lahar flow", severity: "Critical", municipalities: ["San Fernando", "Bacolor"], affectedFamilies: 1520, date: "2026-10-02", status: "Active", evacuationCenters: 8 },
  { id: "dis-004", name: "Tarlac flash floods", type: "Flash flood", severity: "Elevated", municipalities: ["Concepcion", "Capas"], affectedFamilies: 640, date: "2026-09-29", status: "Monitoring", evacuationCenters: 3 },
  { id: "dis-005", name: "Nueva Ecija monsoon rains", type: "Monsoon", severity: "Moderate", municipalities: ["Sta. Rosa", "Cabanatuan"], affectedFamilies: 410, date: "2026-09-27", status: "Monitoring", evacuationCenters: 2 },
];
