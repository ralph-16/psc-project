import PageHeader from "@/components/ugnay/PageHeader";
import { inventory, type InventoryItem } from "@/lib/mock/inventory";

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-left text-xs text-[#6b7280] uppercase">
            <th className="pb-2">Warehouse</th>
            <th className="pb-2">Item</th>
            <th className="pb-2">Category</th>
            <th className="pb-2 text-right">On hand</th>
            <th className="pb-2 text-right">Reserved</th>
            <th className="pb-2 text-right">Available</th>
            <th className="pb-2 text-right">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-t border-[#e5e7eb]">
              <td className="py-2">{i.warehouse}</td>
              <td className="py-2 font-medium">{i.item}</td>
              <td className="py-2">
                <span className="rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold text-[#084989]">
                  {i.category}
                </span>
              </td>
              <td className="py-2 text-right tabular-nums">{i.onHand.toLocaleString()} {i.unit}</td>
              <td className="py-2 text-right tabular-nums">{i.reserved.toLocaleString()}</td>
              <td className={`py-2 text-right font-bold tabular-nums ${i.available < 1000 ? "text-[#c8102e]" : "text-[#1b9c6e]"}`}>
                {i.available.toLocaleString()}
              </td>
              <td className="py-2 text-right text-xs text-[#6b7280]">
                {new Date(i.updatedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LguInventoryPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Inventory" }]}
        title="Warehouse inventory"
        description="Stock by warehouse and category. Reserved stock cannot be allocated twice."
      />
      <section className="ugnay-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">InventoryTable — all sites</h2>
          <span className="text-xs text-[#6b7280]">Available = On hand − Reserved</span>
        </div>
        <div className="mt-3">
          <InventoryTable items={inventory} />
        </div>
      </section>
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold">Low-stock alerts</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>• <strong>First-aid & medicines</strong> — 550 available · reorder threshold 800</li>
          <li>• <strong>Sleeping mats</strong> — 900 available · threshold 1,000</li>
        </ul>
      </section>
    </div>
  );
}
