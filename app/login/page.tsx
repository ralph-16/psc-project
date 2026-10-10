"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";
import { safeNext, setSession } from "@/lib/session";

/** Mock workspace entry (no sessions — routes to the mock shells by org type). */
export default function LoginPage() {
  const router = useRouter();
  const [rawNext] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("next");
  });
  const [orgType, setOrgType] = useState("LGU / DRRM Office");
  const [org, setOrg] = useState("Bulacan PDRRMO");
  const [email, setEmail] = useState("desk@bulacan.gov.ph");
  const [error, setError] = useState<string | null>(null);

  const presets: Record<string, { org: string; email: string }> = {
    "LGU / DRRM Office": { org: "Bulacan PDRRMO", email: "desk@bulacan.gov.ph" },
    "NGO / Humanitarian Organization": { org: "Kalinga Foundation", email: "field@kalinga.ph" },
    "Corporate Sponsor": { org: "Central Luzon Foods Inc.", email: "csr@clfoods.ph" },
  };

  function changeOrgType(value: string) {
    setOrgType(value);
    const preset = presets[value];
    if (preset) {
      setOrg(preset.org);
      setEmail(preset.email);
    }
    setError(null);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("email") ?? "").includes("@")) {
      setError("Enter your work email.");
      return;
    }
    if (!String(data.get("org") ?? "").trim()) {
      setError("Enter your organization.");
      return;
    }
    setError(null);
    const email = String(data.get("email"));
    const org = String(data.get("org"));
    setSession({ name: org.trim(), email: email.trim(), org: org.trim() });
    // Workspace entry: LGU has its own portal (auto-forwards when signed in);
    // Corporate and NGO share the partner workspace per CORPORATE-WORKFLOW.md,
    // so both land on its dashboard — never the marketing landing page.
    const home = orgType.startsWith("LGU") ? "/lgu" : "/corporate/dashboard";
    const next = safeNext(rawNext, home);
    router.push(next === "/login" ? home : next);
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-md flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Log in" }]}
          title="Log in"
          description="Workspace access is provisioned by your organization admin with a role."
        />
        <form onSubmit={submit} className="ugnay-card mt-4 space-y-4 p-5 sm:p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">I am with</span>
            <select
              value={orgType}
              onChange={(e) => changeOrgType(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm"
            >
              <option>LGU / DRRM Office</option>
              <option>NGO / Humanitarian Organization</option>
              <option>Corporate Sponsor</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Organization</span>
            <input name="org" value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Work email</span>
            <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm" />
          </label>
          <FieldError id="login-error" message={error} />
          <button type="submit" className="ugnay-btn ugnay-btn-solid w-full">
            Continue
          </button>
          <p className="text-xs text-[#6b7280]">
            Donors never need an account —{" "}
            <a href="/track" className="font-semibold text-[#084989] hover:underline">
              track a donation as a guest
            </a>
            .
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
