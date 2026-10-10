"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ugnay/PageHeader";
import {
  CSR_AREAS,
  CSR_CAUSES,
  DEFAULT_CSR_PROFILE,
  getCsrProfile,
  setCsrProfile,
} from "@/lib/mock/csr";

const SDG_OPTIONS = [
  "SDG 1 · No Poverty",
  "SDG 2 · Zero Hunger",
  "SDG 3 · Good Health",
  "SDG 6 · Clean Water",
  "SDG 11 · Sustainable Communities",
];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Corporate onboarding: profile + CSR preferences feed the match engine. */
export default function CorporateOnboardingPage() {
  const [causes, setCauses] = useState<string[]>(DEFAULT_CSR_PROFILE.causes);
  const [areas, setAreas] = useState<string[]>(DEFAULT_CSR_PROFILE.areas);
  const [capacity, setCapacity] = useState(String(DEFAULT_CSR_PROFILE.capacity));
  const [sdg, setSdg] = useState<string[]>(DEFAULT_CSR_PROFILE.sdg);
  const [saved, setSaved] = useState(false);

  // Hydrate from the stored profile after mount (SSR renders defaults).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = getCsrProfile();
      setCauses(stored.causes);
      setAreas(stored.areas);
      setCapacity(String(stored.capacity));
      setSdg(stored.sdg);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(capacity.replace(/[^0-9]/g, "")) || 0;
    setCsrProfile({
      causes,
      areas,
      capacity: parsed,
      sdg,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        breadcrumb={[
          { label: "Corporate", href: "/corporate" },
          { label: "Register", href: "/corporate/register" },
          { label: "Onboarding" },
        ]}
        title="Set up your giving workspace"
        description="Three steps to set up your workspace."
      />

      <ol className="space-y-4">
        <li className="ugnay-card flex items-start gap-4 p-5">
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1b9c6e]/10 p-2.5 text-[#1b9c6e]">
            <Check className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-bold text-[#1a2333]">
              1 · Company profile
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Legal name, SEC registration, logo, and primary contact.
            </p>
            <p className="mt-2 text-xs font-semibold tracking-wide text-[#1b9c6e] uppercase">
              Complete
            </p>
          </div>
        </li>

        <li className="ugnay-card p-5">
          <div className="flex items-start gap-4">
            <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#084989]/10 p-2.5 text-[#084989]">
              <ClipboardList className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold text-[#1a2333]">
                2 · Giving preferences
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                These feed the SponsorMatch engine — geography 40 · cause 30 ·
                capacity 20 · urgency 10. Never pay-to-rank.
              </p>
            </div>
          </div>
          <form onSubmit={save} className="mt-4 space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Cause areas
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Cause areas">
                {CSR_CAUSES.map((cause) => {
                  const on = causes.includes(cause);
                  return (
                    <button
                      key={cause}
                      type="button"
                      onClick={() => {
                        setCauses(toggle(causes, cause));
                        setSaved(false);
                      }}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                        on
                          ? "bg-[#084989] text-white"
                          : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                      )}
                    >
                      {cause}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Geographic coverage
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Geographic coverage">
                {CSR_AREAS.map((area) => {
                  const on = areas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        setAreas(toggle(areas, area));
                        setSaved(false);
                      }}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                        on
                          ? "bg-[#084989] text-white"
                          : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                      )}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                  Capacity (units)
                </span>
                <input
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(e.target.value.replace(/[^0-9]/g, ""));
                    setSaved(false);
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label="Commitment capacity in units"
                  className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
                />
              </label>
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                  SDG alignment
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="SDG alignment">
                  {SDG_OPTIONS.map((tag) => {
                    const on = sdg.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSdg(toggle(sdg, tag));
                          setSaved(false);
                        }}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex min-h-[44px] items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                          on
                            ? "bg-[#084989] text-white"
                            : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button type="submit" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                Save preferences
              </button>
              <p aria-live="polite" className="text-sm font-semibold text-[#1b9c6e]">
                {saved ? "Preferences saved — match rankings use your profile." : ""}
              </p>
            </div>
          </form>
        </li>

        <li className="ugnay-card flex items-start gap-4 p-5">
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#084989]/10 p-2.5 text-[#084989]">
            <Users className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-bold text-[#1a2333]">
              3 · Team & approvals
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Invite finance and CSR teammates, set a two-step approval rule for
              tranches above ₱50,000.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#6b7280]">
                finance@example.com · Approver
              </span>
              <span className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#6b7280]">
                csr@example.com · Editor
              </span>
            </div>
          </div>
        </li>
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/corporate/dashboard" className="ugnay-btn ugnay-btn-solid">
          Enter dashboard <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/corporate/register" className="ugnay-btn ugnay-btn-outline">
          Back to registration
        </Link>
      </div>
    </div>
  );
}
