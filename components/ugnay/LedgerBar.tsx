import Link from "next/link";

const STATS = [
  { value: "₱18,420,500", label: "Total raised" },
  { value: "₱16,890,200", label: "Total disbursed" },
  { value: "48 of 51", label: "Verified & deployed" },
];

/** Platform-wide transparency ledger bar. Solid card. */
export default function LedgerBar() {
  return (
    <section aria-label="Platform ledger totals" className="ugnay-card">
      <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-[#1a2333]">Bulacan Province</p>
          <p className="inline-flex w-fit items-center gap-1.5 text-[11.5px] font-semibold text-[#0e6e4e]">
            <span aria-hidden className="size-1.5 rounded-full bg-[#1b9c6e]" />
            Public audit active
          </p>
        </div>
        <dl className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-0.5 text-xs text-[#6b7280]">{s.label}</dt>
              <dd className="font-display order-1 text-[22px] leading-none font-semibold text-[#084989] tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-1 md:items-end">
          <p className="inline-flex items-center gap-1.5 text-[11.5px] text-[#6b7280]">
            <span
              aria-hidden
              className="size-1.5 animate-pulse rounded-full bg-[#1b9c6e] motion-reduce:animate-none"
            />
            Region 3 data synced
          </p>
          <Link
            href="/transparency"
            className="text-[13px] font-semibold text-[#084989] hover:underline hover:underline-offset-4"
          >
            See the full transparency and audit trail
          </Link>
        </div>
      </div>
    </section>
  );
}
