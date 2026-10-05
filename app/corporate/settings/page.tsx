import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";

const NOTIFICATIONS = [
  { label: "Match window alerts", detail: "Notify us when a followed match drops below 90% completion.", on: true },
  { label: "Tranche approvals", detail: "Email finance approvers for tranches above ₱50,000.", on: true },
  { label: "Delivery confirmations", detail: "Notify CSR team when photo evidence is sealed.", on: false },
];

/** Corporate settings: org profile + notification toggles. */
export default function CorporateSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Settings" }]}
        title="Workspace settings"
        description="Organization settings."
      />

      <section aria-label="Organization profile" className="ugnay-card space-y-4 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">Organization profile</h2>
        <label className="block text-sm">
          <span className="font-display font-semibold text-[#1a2333]">Display name</span>
          <input
            type="text"
            defaultValue="Kalinga Foundation"
            className="mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#1a2333]"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-display font-semibold text-[#1a2333]">Primary region</span>
            <select defaultValue="Region 3" className="mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#1a2333]">
              <option>Region 3</option>
              <option>NCR</option>
              <option>Region 4-A</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-display font-semibold text-[#1a2333]">Default ledger email</span>
            <input
              type="email"
              defaultValue="csr@example.com"
              className="mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#1a2333]"
            />
          </label>
        </div>
      </section>

      <section aria-label="Notifications" className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">Notifications (visual)</h2>
        <ul className="mt-3 space-y-3">
          {NOTIFICATIONS.map((item) => (
            <li key={item.label} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-[#1a2333]">{item.label}</p>
                <p className="text-[#6b7280]">{item.detail}</p>
              </div>
              <span
                className={
                  item.on
                    ? "mt-0.5 shrink-0 rounded-full bg-[#1b9c6e] px-3 py-1 text-xs font-bold text-white"
                    : "mt-0.5 shrink-0 rounded-full bg-[#e5e7eb] px-3 py-1 text-xs font-bold text-[#6b7280]"
                }
              >
                {item.on ? "On" : "Off"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <Link href="/corporate/dashboard" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
          Save <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/corporate/team" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
          Manage team
        </Link>
      </div>
    </div>
  );
}
