import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";

const MEMBERS = [
  { name: "Liza Navarro", email: "csr@example.com", role: "Admin", status: "Active" },
  { name: "Mark Villanueva", email: "finance@example.com", role: "Approver", status: "Active" },
  { name: "Jen Lim", email: "comms@example.com", role: "Editor", status: "Invited" },
];

/** Corporate team management. */
export default function CorporateTeamPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Team" }]}
        title="Team & approvals"
        description="Invite teammates and set tranche approval rules."
      />

      <div className="ugnay-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="font-display text-base font-bold text-[#1a2333]">Approval rule</h2>
          <p className="mt-0.5 text-sm text-[#6b7280]">Tranches above ₱50,000 need 1 finance approver.</p>
        </div>
        <span className="rounded-full bg-[#1b9c6e]/10 px-3 py-1.5 text-xs font-bold text-[#1b9c6e]">
          Enabled
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {MEMBERS.map((member) => (
          <li key={member.email} className="ugnay-card flex flex-wrap items-center gap-3 p-4 sm:gap-4">
            <span className="font-display inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#084989]/10 text-sm font-bold text-[#084989]">
              {member.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-[#1a2333]">{member.name}</p>
              <p className="truncate text-xs text-[#6b7280]">{member.email}</p>
            </div>
            <span className="hidden rounded-full border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#1a2333] sm:inline">
              {member.role}
            </span>
            <span
              className={
                member.status === "Active"
                  ? "rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-xs font-semibold text-[#1b9c6e]"
                  : "rounded-full bg-[#d97706]/10 px-2.5 py-1 text-xs font-semibold text-[#d97706]"
              }
            >
              {member.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <span className="ugnay-btn ugnay-btn-solid w-full cursor-pointer sm:w-auto">
          <UserPlus className="size-4" aria-hidden /> Invite teammate (visual)
        </span>
        <Link href="/corporate/settings" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
          Workspace settings <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
