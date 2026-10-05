import Link from "next/link";
import { ArrowRight, CreditCard, Download } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";

const INVOICES = [
  { id: "INV-2026-09", period: "Sep 2026", amount: "₱125,000", status: "Paid" },
  { id: "INV-2026-08", period: "Aug 2026", amount: "₱200,000", status: "Paid" },
  { id: "INV-2026-07", period: "Jul 2026", amount: "₱175,000", status: "Paid" },
];

/** Corporate billing: plan, payment method, invoices. */
export default function CorporateBillingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Billing" }]}
        title="Plan & billing"
        description="Billing records and invoices."
      />

      <section aria-label="Billing summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Current plan" value="Impact+" sub="annual" />
        <StatCard label="YTD invoiced" value="₱500,000" sub="3 invoices" />
        <StatCard label="Next invoice" value="Nov 01" sub="₱0 due" />
      </section>

      <section aria-label="Payment method" className="ugnay-card mt-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-4">
        <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#084989]/10 p-2.5 text-[#084989]">
          <CreditCard className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold text-[#1a2333]">Bank transfer · ••4821</h2>
          <p className="text-sm text-[#6b7280]">Default settlement channel for tranches.</p>
        </div>
        <span className="w-fit rounded-full bg-[#1b9c6e]/10 px-3 py-1 text-xs font-bold text-[#1b9c6e]">Default</span>
      </section>

      <section aria-label="Invoices" className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">Invoices</h2>
        <ul className="mt-3 divide-y divide-[#e5e7eb]">
          {INVOICES.map((invoice) => (
            <li key={invoice.id} className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div>
                <p className="font-display font-bold text-[#1a2333]">
                  {invoice.id} <span className="font-sans font-normal text-[#6b7280]">· {invoice.period}</span>
                </p>
                <p className="tabular-nums">{invoice.amount}</p>
              </div>
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-xs font-semibold text-[#1b9c6e]">
                  {invoice.status}
                </span>
                <span className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#084989]">
                  <Download className="size-3.5" aria-hidden /> PDF
                </span>
              </span>
            </li>
          ))}
        </ul>
        <Link href="/corporate/reports" className="ugnay-btn-link ugnay-btn mt-3 text-sm">
          Reconcile with CSR report <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
