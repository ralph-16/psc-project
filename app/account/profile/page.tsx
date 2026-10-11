"use client";

import { useState } from "react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { cn } from "@/lib/utils";

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-semibold text-[#1a2333]">{label}</p>
        <p className="text-xs text-[#6b7280]">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-[#1b9c6e]" : "bg-[#e5e7eb]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            on ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const [deliveryUpdates, setDeliveryUpdates] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);
  const [publicName, setPublicName] = useState(true);
  const [publicAmounts, setPublicAmounts] = useState(false);
  const [method, setMethod] = useState("GCash");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Profile" },
          ]}
          title="Profile & settings"
          description="Notification and privacy settings for your account."
        />

        <div className="space-y-4">
          <section className="ugnay-card px-5 py-2" aria-label="Notifications">
            <h2 className="font-display pt-3 text-lg font-bold text-[#1a2333]">Notifications</h2>
            <div className="divide-y divide-[#e5e7eb]">
              <Toggle
                label="Delivery updates"
                hint="Alerts when your donation moves stage."
                on={deliveryUpdates}
                onChange={setDeliveryUpdates}
              />
              <Toggle
                label="Verification alerts"
                hint="Alert when a trail is sealed."
                on={verificationAlerts}
                onChange={setVerificationAlerts}
              />
              <Toggle
                label="Monthly transparency digest"
                hint="Summary of platform reconciliation."
                on={monthlyReport}
                onChange={setMonthlyReport}
              />
            </div>
          </section>

          <section className="ugnay-card px-5 py-2" aria-label="Privacy">
            <h2 className="font-display pt-3 text-lg font-bold text-[#1a2333]">Privacy</h2>
            <div className="divide-y divide-[#e5e7eb]">
              <Toggle
                label="Show my name publicly"
                hint="Off = donations appear as Anonymous."
                on={publicName}
                onChange={setPublicName}
              />
              <Toggle
                label="Show my amounts publicly"
                hint="Off = amounts hidden on public trails."
                on={publicAmounts}
                onChange={setPublicAmounts}
              />
            </div>
            <p className="pb-4 text-xs text-[#6b7280]">
              Preferences apply immediately.
            </p>
          </section>

          <section className="ugnay-card p-5" aria-label="Payment methods">
            <h2 className="font-display text-lg font-bold text-[#1a2333]">
              Payment methods
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Pick a default for checkout.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
              {["GCash", "Maya", "Card"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  aria-pressed={method === m}
                  className={cn(
                    "min-h-[44px] rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold",
                    method === m
                      ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                      : "border-[#e5e7eb] text-[#1a2333]",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              Changes save automatically.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
