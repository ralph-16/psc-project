"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const CORP_NAV = [
  { label: "Dashboard", href: "/corporate/dashboard" },
  { label: "Opportunities", href: "/corporate/opportunities" },
  { label: "Contribute", href: "/corporate/contribute" },
  { label: "Tracking", href: "/corporate/tracking" },
  { label: "Evidence", href: "/corporate/evidence" },
  { label: "Reports", href: "/corporate/reports" },
  { label: "Analytics", href: "/corporate/analytics" },
  { label: "Team", href: "/corporate/team" },
  { label: "Billing", href: "/corporate/billing" },
  { label: "Settings", href: "/corporate/settings" },
];

/** Interactive corporate sub-navigation (client leaf). Active state via usePathname. */
export default function CorporateNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Corporate" className="flex gap-1 overflow-x-auto py-2">
      {CORP_NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "font-display inline-flex min-h-[44px] shrink-0 items-center rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-[#084989] hover:bg-[#084989]/5",
              active && "bg-[#084989] text-white hover:bg-[#084989]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
