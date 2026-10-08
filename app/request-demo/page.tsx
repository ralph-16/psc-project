"use client";

import { useState } from "react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";

/** Mock demo/procurement-quote request (no backend — success state only). */
export default function RequestDemoPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgType, setOrgType] = useState("LGU");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const contact = String(data.get("contact") ?? "").trim();
    if (!String(data.get("org") ?? "").trim()) {
      setError("Tell us your organization name.");
      return;
    }
    if (!contact || (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact) && contact.length < 7)) {
      setError("Enter a valid email or phone number.");
      return;
    }
    setError(null);
    setDone(true);
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Request a demo" }]}
          title="Request a demo"
          description="For LGUs, NGOs, and companies — including the government procurement-quote path."
        />
        {done ? (
          <section aria-live="polite" className="ugnay-card mt-4 p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold">Request received</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Our team reaches out within two working days with a walkthrough
              and, for government buyers, a procurement-ready quote.
            </p>
          </section>
        ) : (
          <form onSubmit={submit} className="ugnay-card mt-4 space-y-4 p-5 sm:p-6">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Organization type
              </span>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                name="orgType"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm"
              >
                <option>LGU</option>
                <option>NGO / Foundation</option>
                <option>Corporate Sponsor</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Organization name
              </span>
              <input name="org" autoComplete="organization" className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Contact (email or phone)
              </span>
              <input name="contact" autoComplete="email" className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm" />
            </label>
            {orgType === "LGU" && (
              <p className="rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm text-[#6b7280]">
                Government procurement path: a formal quote for plan, add-ons, and implementation
                fee — no card checkout required.
              </p>
            )}
            <FieldError id="demo-error" message={error} />
            <button type="submit" className="ugnay-btn ugnay-btn-solid w-full">
              Submit request
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
