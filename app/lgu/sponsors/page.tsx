import PageHeader from "@/components/ugnay/PageHeader";
import { sponsors } from "@/lib/mock/sponsors";
import { sponsorMatches } from "@/lib/mock/matches";

export default function LguSponsorsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Sponsors" }]}
        title="Sponsors & matching"
        description="Corporate and LGU partners. Matching tranches release only against verified donations."
      />
      <section className="ugnay-card overflow-x-auto p-5">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th className="pb-2">Sponsor</th>
              <th className="pb-2">Type</th>
              <th className="pb-2 text-right">Contribution</th>
              <th className="pb-2 text-right">Campaigns</th>
              <th className="pb-2">Focus</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id} className="border-t border-[#e5e7eb]">
                <td className="py-2 font-medium">{s.name}<span className="block text-xs font-normal text-[#6b7280]">Since {s.since}</span></td>
                <td className="py-2">{s.type}</td>
                <td className="py-2 text-right font-bold tabular-nums">₱{s.contribution.toLocaleString()}</td>
                <td className="py-2 text-right tabular-nums">{s.campaignsSupported}</td>
                <td className="py-2">{s.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        {sponsorMatches.map((m) => (
          <div key={m.id} className="ugnay-card p-5">
            <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Match · {m.id}</p>
            <h2 className="font-display mt-1 text-lg font-bold">{m.sponsorName}</h2>
            <p className="text-sm text-[#6b7280]">{m.campaignTitle} — {m.percent}% matched</p>
            <div className="mt-2 h-2 rounded-full bg-[#e5e7eb]">
              <div className="h-full rounded-full bg-[#1b9c6e]" style={{ width: `${m.percent}%` }} />
            </div>
            <ul className="mt-2 space-y-1 text-xs">
              {m.breakdown.map((b) => (
                <li key={b.label} className="flex justify-between"><span>{b.label}</span><span className="tabular-nums">{b.matched}/{b.pledged}</span></li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-[#6b7280]">{m.note}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
