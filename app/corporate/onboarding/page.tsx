import Link from "next/link";
import { ArrowRight, Building2, Check, ClipboardList, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ugnay/PageHeader";

const STEPS = [
  {
    icon: Building2,
    title: "1 · Company profile",
    detail: "Legal name, SEC registration, logo, and primary contact.",
    done: true,
  },
  {
    icon: ClipboardList,
    title: "2 · Giving preferences",
    detail: "Focus areas, regions, tranche size, and in-kind capabilities.",
    done: true,
  },
  {
    icon: Users,
    title: "3 · Team & approvals",
    detail: "Invite finance and CSR teammates, set a two-step approval rule for tranches above ₱50,000.",
    done: false,
  },
];

/** Corporate onboarding: 3-step checklist. */
export default function CorporateOnboardingPage() {
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
        {STEPS.map((step) => (
          <li key={step.title} className="ugnay-card flex items-start gap-4 p-5">
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full p-2.5",
                step.done ? "bg-[#1b9c6e]/10 text-[#1b9c6e]" : "bg-[#084989]/10 text-[#084989]",
              )}
            >
              {step.done ? <Check className="size-5" aria-hidden /> : <step.icon className="size-5" aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold text-[#1a2333]">{step.title}</h2>
              <p className="mt-1 text-sm text-[#6b7280]">{step.detail}</p>
              {step.done ? (
                <p className="mt-2 text-xs font-semibold tracking-wide text-[#1b9c6e] uppercase">Complete</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#6b7280]">
                    finance@example.com · Approver
                  </span>
                  <span className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#6b7280]">
                    csr@example.com · Editor
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
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
