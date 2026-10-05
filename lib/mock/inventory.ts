export interface InventoryItem {
  id: string;
  warehouse: string;
  item: string;
  category: string;
  onHand: number;
  reserved: number;
  available: number;
  unit: string;
  updatedAt: string;
}

function inv(i: Omit<InventoryItem, "available">): InventoryItem {
  return { ...i, available: i.onHand - i.reserved };
}

export const inventory: InventoryItem[] = [
  inv({ id: "inv-001", warehouse: "Malolos Central Warehouse", item: "Rice packs (5kg)", category: "Food", onHand: 3200, reserved: 1100, unit: "packs", updatedAt: "2026-10-04T07:30:00+08:00" }),
  inv({ id: "inv-002", warehouse: "Malolos Central Warehouse", item: "Drinking water (6L)", category: "Water", onHand: 5400, reserved: 1900, unit: "bottles", updatedAt: "2026-10-04T07:30:00+08:00" }),
  inv({ id: "inv-003", warehouse: "Malolos Central Warehouse", item: "Hygiene kits", category: "Non-food", onHand: 2100, reserved: 800, unit: "kits", updatedAt: "2026-10-04T07:30:00+08:00" }),
  inv({ id: "inv-004", warehouse: "San Fernando Depot", item: "Sleeping mats", category: "Shelter", onHand: 1500, reserved: 600, unit: "pcs", updatedAt: "2026-10-03T18:00:00+08:00" }),
  inv({ id: "inv-005", warehouse: "San Fernando Depot", item: "First-aid & medicines", category: "Health", onHand: 900, reserved: 350, unit: "packs", updatedAt: "2026-10-03T18:00:00+08:00" }),
  inv({ id: "inv-006", warehouse: "Calumpit Forward Post", item: "Canned goods bundle", category: "Food", onHand: 1800, reserved: 700, unit: "bundles", updatedAt: "2026-10-03T12:00:00+08:00" }),
];
