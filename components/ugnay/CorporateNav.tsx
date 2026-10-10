"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CircleUserRound,
  CreditCard,
  FileBarChart,
  Files,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { clearSession } from "@/lib/session";

type CorpLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: { section: string; links: CorpLink[] }[] = [
  {
    section: "Workspace",
    links: [
      { href: "/corporate/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/corporate/opportunities", label: "Opportunities", icon: Search },
      { href: "/corporate/contribute", label: "Contribute", icon: HandCoins },
    ],
  },
  {
    section: "Impact",
    links: [
      { href: "/corporate/tracking", label: "Tracking", icon: Route },
      { href: "/corporate/evidence", label: "Evidence", icon: Files },
      { href: "/corporate/reports", label: "Reports", icon: FileBarChart },
      { href: "/corporate/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Manage",
    links: [
      { href: "/corporate/team", label: "Team", icon: Users },
      { href: "/corporate/billing", label: "Billing", icon: CreditCard },
      { href: "/corporate/settings", label: "Settings", icon: Settings },
    ],
  },
];

/** Corporate sidebar links (client leaf). Active state via usePathname. */
export function CorporateSidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="space-y-6">
      {NAV.map((group) => (
        <div key={group.section}>
          <p className="mb-1 px-3 text-[11px] font-bold tracking-widest text-[#6b7280] uppercase">
            {group.section}
          </p>
          <ul className="space-y-0.5">
            {group.links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#1a2333] hover:bg-[#084989]/5 hover:text-[#084989]",
                      active && "bg-[#084989]/8 font-semibold text-[#084989]",
                    )}
                  >
                    <l.icon className="size-4 shrink-0 text-[#084989]" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Partner workspace shell (corporate + NGO): top bar, sidebar, mobile drawer. */
export default function CorporateShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the drawer on open; return it to the hamburger on close
  // when focus was inside the drawer (Escape / close button / route change).
  useEffect(() => {
    if (open && !wasOpen.current) {
      drawerCloseRef.current?.focus();
    }
    if (!open && wasOpen.current) {
      const active = document.activeElement;
      if (active && drawerRef.current?.contains(active)) {
        menuButtonRef.current?.focus();
      }
    }
    wasOpen.current = open;
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open ]);

  function signOut() {
    clearSession();
    setOpen(false);
    router.push("/auth");
  }

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-2.5 sm:px-6">
          <button
            type="button"
            ref={menuButtonRef}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="corporate-menu-drawer"
            aria-label={open ? "Close workspace menu" : "Open workspace menu"}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-2 text-[#1a2333] hover:bg-[#f3f3f3] lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <Link
            href="/corporate/dashboard"
            className="flex shrink-0 items-center gap-2"
            aria-label="Partner workspace home"
          >
            <BrandMark />
            <span className="font-display text-lg font-bold tracking-tight text-[#f6ac21]">
              UGNAY
            </span>
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/account"
              aria-label="Account"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-[#1a2333] hover:bg-[#f3f3f3]"
            >
              <CircleUserRound className="size-5" aria-hidden />
              <span className="hidden sm:inline">Account</span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-[#084989] px-4 text-sm font-semibold text-[#084989]"
            >
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-4 sm:px-6 sm:py-6">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20" aria-label="Partner workspace">
            <CorporateSidebarLinks />
          </nav>
        </aside>

        <main id="main" className="min-w-0 flex-1 overflow-x-clip pb-[env(safe-area-inset-bottom,0px)]">
          {children}
        </main>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity motion-reduce:transition-none",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/25" onClick={() => setOpen(false)} />
        <nav
          ref={drawerRef}
          id="corporate-menu-drawer"
          aria-label="Workspace menu"
          className={cn(
            "absolute top-0 left-0 flex h-full w-[85vw] max-w-72 flex-col bg-white pb-safe shadow-xl transition-transform duration-200 motion-reduce:transition-none",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-4">
            <span className="font-display text-base font-bold text-[#084989]">Workspace sections</span>
            <button
              type="button"
              ref={drawerCloseRef}
              onClick={() => setOpen(false)}
              aria-label="Close workspace menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 hover:bg-[#f3f3f3]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="drawer-safe flex-1 overflow-y-auto p-4">
            <CorporateSidebarLinks onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </div>
    </div>
  );
}
