"use client";

import { useState } from "react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";

const inputClass =
  "min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm";

/** Mock sponsor profile (no backend — NGO/LGU partners record real pledges). */
export default function SponsorRegisterPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("org") ?? "").trim()) {
      setError("Tell us your company or organization name.");
      return;
    }
    const contact = String(data.get("contact") ?? "").trim();
    if (!contact) {
      setError("Share an email or phone so partners can reach you.");
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
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Sponsor registration" }]}
          title="Partner with verified relief efforts"
          description="Create your sponsor profile. NGO/LGU partners record your pledges so every contribution is traceable — a full workspace is optional. Demo form only."
        />
        {done ? (
          <section aria-live="polite" className="ugnay-card mt-4 p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold">Profile received (demo)</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              In the live product, your profile becomes matchable against verified gaps, and each
              recorded pledge gets a DonationTrace trail with opt-in public credit.
            </p>
          </section>
        ) : (
          <form onSubmit={submit} className="ugnay-card mt-4 space-y-4 p-5 sm:p-6">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Organization</span>
              <input name="org" autoComplete="organization" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Cause areas (comma-separated)</span>
              <input name="causes" placeholder="e.g. food packs, drinking water" autoComplete="off" className={inputClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Goods / services you can offer</span>
                <input name="goods" autoComplete="off" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Coverage areas</span>
                <input name="coverage" placeholder="e.g. Bulacan, Central Luzon" autoComplete="off" className={inputClass} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Capacity range (units)</span>
                <input name="capacity" placeholder="e.g. 1,000–10,000 packs" autoComplete="off" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Contact preferences</span>
                <input name="contact" autoComplete="email" placeholder="Email or phone" className={inputClass} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">CSR / SDG priorities</span>
              <input name="csr" placeholder="e.g. Zero Hunger, Clean Water" autoComplete="off" className={inputClass} />
            </label>
            <FieldError id="sponsor-error" message={error} />
            <button type="submit" className="ugnay-btn ugnay-btn-solid w-full">
              Create sponsor profile
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
