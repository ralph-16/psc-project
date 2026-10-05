import PageHeader from "@/components/ugnay/PageHeader";

export default function LguSettingsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Settings" }]}
        title="Portal settings"
        description="Workspace preferences."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="ugnay-card space-y-3 p-5 text-sm">
          <h2 className="font-display text-lg font-bold">Organization</h2>
          <div><label htmlFor="org" className="font-semibold">LGU name</label><input id="org" defaultValue="City Government of Malolos" className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2" /></div>
          <div><label htmlFor="desk" className="font-semibold">Relief desk contact (internal)</label><input id="desk" defaultValue="relief.desk@malolos.lgu.ph" className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2" /></div>
        </section>
        <section className="ugnay-card space-y-3 p-5 text-sm">
          <h2 className="font-display text-lg font-bold">Safeguards</h2>
          {["Require validation before publication (locked on)", "Mask beneficiary identities (locked on)", "Require dual approval above ₱50,000", "AI-assisted forecasts need human sign-off (locked on)"].map((t) => (
            <label key={t} className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2">
              <input type="checkbox" defaultChecked className="size-4 accent-[#084989]" /> {t}
            </label>
          ))}
          <button type="button" className="ugnay-btn ugnay-btn-solid text-sm">Save</button>
        </section>
      </div>
    </div>
  );
}
