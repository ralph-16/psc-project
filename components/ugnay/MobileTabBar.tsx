"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, House, Route, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", icon: House },
  { label: "Needs", href: "/needs", icon: HeartHandshake },
  { label: "Track", href: "/track", icon: Route },
  { label: "Account", href: "/account", icon: User },
];

/**
 * Mobile bottom tab bar for top-level PUBLIC + INDIVIDUAL nav.
 * Rendered alongside SiteHeader on every page; visible only below md.
 * Max 4 items with icon + label, active state from the current route.
 */
export default function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e7eb] bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-4 gap-2 px-2 pt-1.5">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <li key={tab.href} className="min-w-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] leading-tight font-semibold [touch-action:manipulation] transition-colors active:bg-[#f3f3f3] motion-reduce:transition-none",
                  active ? "text-[#084989]" : "text-[#6b7280] hover:text-[#1a2333]",
                )}
              >
                <tab.icon className="size-5 shrink-0" aria-hidden />
                <span className="truncate">{tab.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "h-1 w-6 rounded-full",
                    active ? "bg-[#084989]" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
