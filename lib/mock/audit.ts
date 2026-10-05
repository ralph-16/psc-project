export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  ledgerRef: string;
}

export const auditLog: AuditEvent[] = [
  { id: "aud-001", timestamp: "2026-10-04T08:00:00+08:00", actor: "Field verifier", action: "Sealed delivery trail", entity: "Delivery", entityId: "del-001", ledgerRef: "TX-UGNAY-004821" },
  { id: "aud-002", timestamp: "2026-10-03T17:26:00+08:00", actor: "Brgy. coordinator", action: "Signed proof of receipt", entity: "Delivery", entityId: "del-003", ledgerRef: "TX-UGNAY-004819" },
  { id: "aud-003", timestamp: "2026-10-03T12:40:00+08:00", actor: "Relief desk officer", action: "Allocated donation to needs", entity: "Donation", entityId: "don-001", ledgerRef: "TX-UGNAY-004821" },
  { id: "aud-004", timestamp: "2026-10-02T15:05:00+08:00", actor: "Corporate sponsor", action: "Pledged matching tranche", entity: "Match", entityId: "match-001", ledgerRef: "TX-UGNAY-004815" },
  { id: "aud-005", timestamp: "2026-10-01T13:57:00+08:00", actor: "Finance reviewer", action: "Confirmed incoming transfer", entity: "Donation", entityId: "don-005", ledgerRef: "TX-UGNAY-004798" },
];
