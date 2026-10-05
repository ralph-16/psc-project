import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatCard from "@/components/ugnay/StatCard";

// Time series: chronological order is correct (not sorted — months read left to right).
const MONTHS = [
  { label: "Jul", value: 55 },
  { label: "Aug", value: 70 },
  { label: "Sep", value: 84 },
  { label: "Oct", value: 40 },
];

// Category comparison: sorted descending by value (largest first).
const CHANNELS = [
  { label: "Matching fund", value: 84 },
  { label: "Cash tranches", value: 72 },
  { label: "In-kind goods", value: 48 },
];

/** Corporate analytics. */
export default function CorporateAnalyticsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Analytics" }]}
        title="Giving analytics"
        description="Portfolio trends and channel mix."
      />

      <section aria-label="KPI stats" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Match efficiency" value="84%" sub="top match completion" />
        <StatCard label="Avg. release time" value="2.1 days" sub="pledge → dispatch" />
        <StatCard label="Verified trails" value="100%" sub="6 of 6 sealed" />
        <StatCard label="Repeat rate" value="3×" sub="quarters active" />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section aria-labelledby="corp-monthly-heading" className="ugnay-card p-5">
          <h2 id="corp-monthly-heading" className="font-display text-base font-bold text-[#1a2333]">Match completion by month</h2>
          <div className="mt-4 flex h-44 items-end gap-3" role="list" aria-label="Match completion by month">
            {MONTHS.map((month) => (
              <div
                key={month.label}
                role="listitem"
                tabIndex={0}
                aria-label={`${month.label}: ${month.value} percent match completion${month.label === "Oct" ? ", partial month" : ""}`}
                className="flex flex-1 flex-col items-center gap-1.5 self-stretch rounded-lg"
              >
                <span className="text-xs font-bold text-[#1a2333] tabular-nums">{month.value}%</span>
                <div className="flex w-full flex-1 items-end overflow-hidden rounded-lg bg-[#f3f3f3]">
                  <div aria-hidden className="w-full rounded-lg bg-[#084989]" style={{ height: `${month.value}%` }} />
                </div>
                <span className="text-xs font-medium text-[#6b7280]">{month.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">October is partial . Ranking is needs-based, never pay-to-rank.</p>
          <p className="sr-only">
            Text summary: match completion peaked in September at 84 percent, followed by August at 70
            percent, July at 55 percent, and October at 40 percent for the partial month.
          </p>
          <table className="sr-only">
            <caption>Match completion by month, in chronological order</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Completion</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month) => (
                <tr key={month.label}>
                  <th scope="row">{month.label}</th>
                  <td>{month.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="corp-channel-heading" className="ugnay-card p-5">
          <h2 id="corp-channel-heading" className="font-display text-base font-bold text-[#1a2333]">Channel mix</h2>
          <ul className="mt-4 space-y-4" aria-label="Channel mix, sorted highest to lowest">
            {CHANNELS.map((channel, i) => (
              <li key={channel.label} tabIndex={0} aria-label={`${i + 1} of ${CHANNELS.length}: ${channel.label}, ${channel.value} percent`}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-[#1a2333]">
                    <span aria-hidden className="mr-1.5 inline-block size-2.5 rounded-sm bg-[#1b9c6e] align-baseline" />
                    {i + 1}. {channel.label}
                  </span>
                  <span className="font-display font-bold tabular-nums">{channel.value}%</span>
                </div>
                <ProgressBar value={channel.value} className="mt-1.5" barClassName="bg-[#1b9c6e]" />
              </li>
            ))}
          </ul>
          <p className="sr-only">
            Text summary: Matching fund leads at 84 percent, followed by cash tranches at 72 percent
            and in-kind goods at 48 percent.
          </p>
          <Link href="/corporate/reports" className="ugnay-btn-link ugnay-btn mt-4 text-sm">
            Include in CSR report <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}
