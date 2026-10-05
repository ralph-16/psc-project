"use client";

import { useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Keep the active pill visible and update edge-fade affordance.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    el.querySelector<HTMLElement>("[aria-current='page']")?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <nav
      ref={scrollRef}
      aria-label="Corporate"
      data-at-start={atStart}
      data-at-end={atEnd}
      className="chip-scroll no-scrollbar -mx-4 flex snap-x gap-1 overflow-x-auto scroll-smooth px-4 py-2 sm:mx-0 sm:px-0"
    >
      {CORP_NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "font-display inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-[#084989] hover:bg-[#084989]/5",
              active && "bg-[#084989] text-white shadow-sm hover:bg-[#084989]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
