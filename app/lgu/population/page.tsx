import PageHeader from "@/components/ugnay/PageHeader";
import { disasters } from "@/lib/mock/disasters";

const rows = [
  { area: "Hagonoy coastal cluster", families: 1240, individuals: 4960, seniors: 312, pwds: 96, children: 1410, inCenters: 860, status: "Verified" },
  { area: "Calumpit riverside cluster", families: 980, individuals: 3920, seniors: 201, pwds: 74, children: 1120, inCenters: 540, status: "Verified" },
  { area: "San Fernando hillside cluster", families: 1520, individuals: 6080, seniors: 388, pwds: 121, children: 1740, inCenters: 1130, status: "Partially verified" },
  { area: "Santa Maria standby cluster", families: 720, individuals: 2880, seniors: 150, pwds: 44, children: 800, inCenters: 210, status: "Verified" },
  { area: "Concepcion cluster", families: 640, individuals: 2560, seniors: 122, pwds: 38, children: 690, inCenters: 180, status: "Unverified" },
];

export default function LguPopulationPage() {
  const totalFamilies = disasters.reduce((s, d) => s + d.affectedFamilies, 0);
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Population" }]}
        title="Affected population (masked)"
        description="Aggregated headcounts only. No full names, no exact addresses, no contact details — ever."
      />
      <div className="ugnay-card border-l-4 border-l-[#1b9c6e] p-4 text-sm">
        <p className="font-bold">Privacy rule enforced</p>
        <p className="text-[#6b7280]">
          Household identities are masked (e.g. “Household H-****”). Total affected families across
          active events: <strong className="text-[#1a2333] tabular-nums">{totalFamilies.toLocaleString()}</strong>.
          Exact rosters are restricted to authorized staff.
        </p>
      </div>
      <section className="ugnay-card mt-4 overflow-hidden p-5">
        <h2 className="font-display text-lg font-bold">Cluster aggregates</h2>
        <div className="table-scroll -mx-5 overflow-x-auto px-5">
        <table className="table-sticky-first mt-3 w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th className="pb-2">Cluster (masked)</th>
              <th className="pb-2 text-right">Families</th>
              <th className="pb-2 text-right">Individuals</th>
              <th className="pb-2 text-right">Seniors</th>
              <th className="pb-2 text-right">PWDs</th>
              <th className="pb-2 text-right">In centers</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.area} className="border-t border-[#e5e7eb]">
                <td className="py-2 font-medium">{r.area}</td>
                <td className="py-2 text-right tabular-nums">{r.families.toLocaleString()}</td>
                <td className="py-2 text-right tabular-nums">{r.individuals.toLocaleString()}</td>
                <td className="py-2 text-right tabular-nums">{r.seniors}</td>
                <td className="py-2 text-right tabular-nums">{r.pwds}</td>
                <td className="py-2 text-right tabular-nums">{r.inCenters.toLocaleString()}</td>
                <td className="py-2 text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.status === "Verified" ? "bg-[#1b9c6e]/15 text-[#1b9c6e]" : r.status.startsWith("Partial") ? "bg-[#f6ac21]/25 text-[#7a4b00]" : "bg-[#e5e7eb] text-[#6b7280]"}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <p className="mt-3 text-xs text-[#6b7280]">
          Unverified clusters are excluded from public campaign figures until the validation queue clears them.
        </p>
      </section>
      {/* Chart */}
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold">People in evacuation centers</h2>
        <div className="mt-3 space-y-2">
          {rows.map((r) => (
            <div key={r.area}>
              <div className="flex items-baseline justify-between gap-2 text-xs text-[#6b7280]">
                <span className="min-w-0 break-words">{r.area}</span>
                <span className="shrink-0 whitespace-nowrap tabular-nums">{r.inCenters.toLocaleString()}</span>
              </div>
              <div className="mt-0.5 h-2.5 rounded-full bg-[#e5e7eb]">
                <div className="h-full rounded-full bg-[#1b9c6e]" style={{ width: `${Math.round((r.inCenters / 1130) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
