export type DeliveryStatus = "Preparing" | "InTransit" | "Delivered" | "Verified";

export interface Delivery {
  id: string;
  campaignId: string;
  campaignTitle: string;
  items: string;
  destination: string;
  driver: string;
  vehicle: string;
  status: DeliveryStatus;
  eta: string;
  ledgerRef: string;
}

export const deliveries: Delivery[] = [
  { id: "del-001", campaignId: "cmp-hagonoy", campaignTitle: "Hagonoy Flood Relief", items: "400 rice packs + 400 water bottles", destination: "Brgy. San Roque, Hagonoy", driver: "R. Aquino", vehicle: "Truck BH-214", status: "Verified", eta: "2026-10-03T17:30:00+08:00", ledgerRef: "TX-UGNAY-004821" },
  { id: "del-002", campaignId: "cmp-san-fernando", campaignTitle: "San Fernando Lahar Response", items: "600 water bottles + 200 medicine packs", destination: "Brgy. Telabastagan, San Fernando", driver: "J. Ramos", vehicle: "Truck PF-089", status: "InTransit", eta: "2026-10-05T10:00:00+08:00", ledgerRef: "TX-UGNAY-004824" },
  { id: "del-003", campaignId: "cmp-calumpit", campaignTitle: "Calumpit River Flooding", items: "300 canned bundles + 300 sleeping mats", destination: "Brgy. Bulusan, Calumpit", driver: "M. Reyes", vehicle: "Van CV-311", status: "Delivered", eta: "2026-10-04T09:00:00+08:00", ledgerRef: "TX-UGNAY-004819" },
  { id: "del-004", campaignId: "cmp-santa-maria", campaignTitle: "Santa Maria Stock Replenishment", items: "250 baby care sets + 250 rice packs", destination: "Brgy. Poblacion, Santa Maria", driver: "L. Gomez", vehicle: "Truck SM-102", status: "Preparing", eta: "2026-10-06T14:00:00+08:00", ledgerRef: "TX-UGNAY-004826" },
];
