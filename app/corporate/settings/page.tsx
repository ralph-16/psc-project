"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ugnay/PageHeader";

const NOTIFICATIONS = [
  { label: "Match window alerts", detail: "Notify us when a followed match drops below 90% completion.", on: true },
  { label: "Tranche approvals", detail: "Email finance approvers for tranches above ₱50,000.", on: true },
  { label: "Delivery confirmations", detail: "Notify CSR team when photo evidence is sealed.", on: false },
];

const VISIBILITY_KEY = "ugnay-visibility";

type Visibility = { sponsorsWall: boolean; campaignPages: boolean };

const DEFAULT_VISIBILITY: Visibility = { sponsorsWall: true, campaignPages: true };

function readVisibility(): Visibility {
  try {
    const raw = window.localStorage.getItem(VISIBILITY_KEY);
    if (!raw) return DEFAULT_VISIBILITY;
    const parsed = JSON.parse(raw) as Partial<Visibility>;
    return {
      sponsorsWall: parsed.sponsorsWall ?? true,
      campaignPages: parsed.campaignPages ?? true,
    };
  } catch {
    return DEFAULT_VISIBILITY;
  }
}

/** Corporate settings: org profile + notification + recognition toggles. */
export default function CorporateSettingsPage() {
  const [visibility, setVisibility] = useState<Visibility>(DEFAULT_VISIBILITY);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisibility(readVisibility()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle(key: keyof Visibility) {
    setVisibility((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        window.localStorage.setItem(VISIBILITY_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const toggles: { key: keyof Visibility; label: string; detail: string }[] = [
    {
      key: "sponsorsWall",
      label: "Public sponsors wall",
      detail: "Show our name and contribution band on the public sponsors wall.",
    },
    {
      key: "campaignPages",
      label: "Campaign page mentions",
      detail: "Allow campaigns to name us as a contributor on their public pages.",
    },
  ];

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

      <section aria-label="Public recognition" className="ugnay-card mt-4 p-5">
        <h2 className="font-display flex items-center gap-2 text-base font-bold text-[#1a2333]">
          <Eye className="size-4 text-[#084989]" aria-hidden /> Public recognition
        </h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Recognition is strictly about naming — opting out never limits operational
          reporting to LGU staff or accountability audits.
        </p>
        <ul className="mt-3 space-y-3">
          {toggles.map((item) => {
            const on = visibility[item.key];
            return (
              <li key={item.key} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-[#1a2333]">{item.label}</p>
                  <p className="text-[#6b7280]">{item.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  aria-pressed={on}
                  aria-label={`${item.label}: ${on ? "shown" : "hidden"}`}
                  className={cn(
                    "mt-0.5 inline-flex min-h-[44px] min-w-[64px] shrink-0 items-center justify-center rounded-full px-3 py-1 text-xs font-bold",
                    on ? "bg-[#1b9c6e] text-white" : "bg-[#e5e7eb] text-[#6b7280]",
                  )}
                >
                  {on ? "Shown" : "Hidden"}
                </button>
              </li>
            );
          })}
        </ul>
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
