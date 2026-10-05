import PageHeader from "@/components/ugnay/PageHeader";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { donations } from "@/lib/mock/donations";
import { campaigns } from "@/lib/mock/campaigns";

export default function LguDonationsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Donations" }]}
        title="Donations ledger"
        description="Pledge-to-verified trail. Donor identities shown internally; public views anonymize."
      />
      <section className="ugnay-card overflow-x-auto p-5">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th className="pb-2">Donation</th>
              <th className="pb-2">Donor (internal)</th>
              <th className="pb-2">Campaign</th>
              <th className="pb-2 text-right">Amount</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Ledger</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-[#e5e7eb]">
                <td className="py-2 font-mono text-xs">{d.id}<span className="block text-[#6b7280]">{d.date.slice(0, 10)}</span></td>
                <td className="py-2 font-medium">{d.anonymous ? "Anonymous (masked)" : d.donor}</td>
                <td className="py-2">{campaigns.find((c) => c.id === d.campaignId)?.title ?? d.campaignId}</td>
                <td className="py-2 text-right font-bold tabular-nums">₱{d.amount.toLocaleString()}</td>
                <td className="py-2"><span className="rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold text-[#084989]">{d.status}</span></td>
                <td className="py-2 font-mono text-xs">{d.ledgerRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <LedgerRef value="TX-UGNAY-004821" />
        <div className="ugnay-card p-4 text-sm">
          <p className="font-bold">Fee transparency</p>
          <p className="text-[#6b7280]">₱1,000 + ₱30 platform + ₱10 processing = ₱1,040 charged. Variances surface in reconciliation.</p>
        </div>
      </div>
    </div>
  );
}
