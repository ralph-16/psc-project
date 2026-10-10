"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Truck,
  ClipboardCheck,
  FileText,
  Settings,
  Siren,
  Users,
  Boxes,
  Sparkles,
  HeartHandshake,
  Inbox,
  ArrowLeftRight,
  Route,
  BadgeCheck,
  Eye,
  Scale,
  Landmark,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ugnay/BrandMark";
import {
  LGU_ROLE_LABELS,
  getLguRoles,
  setLguRoles,
  type LguRole,
} from "@/lib/session";

type LguLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Empty = every role. */
  roles: LguRole[];
};

const NAV: { section: string; links: LguLink[] }[] = [
  {
    section: "Operate",
    links: [
      { href: "/lgu/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: [] },
      { href: "/lgu/events", label: "Active Events", icon: Siren, roles: ["manager"] },
      { href: "/lgu/population", label: "Population", icon: Users, roles: ["manager"] },
      { href: "/lgu/inventory", label: "Inventory", icon: Boxes, roles: ["manager", "warehouse"] },
      { href: "/lgu/forecast", label: "Forecast", icon: Sparkles, roles: ["manager"] },
      { href: "/lgu/validation", label: "Validation", icon: ClipboardCheck, roles: ["manager", "auditor"] },
    ],
  },
  {
    section: "Publish",
    links: [
      { href: "/lgu/campaigns", label: "Campaigns", icon: Megaphone, roles: ["manager"] },
      { href: "/lgu/campaigns/new", label: "New Campaign", icon: FileText, roles: ["manager"] },
      { href: "/lgu/sponsors", label: "Sponsors", icon: HeartHandshake, roles: ["manager"] },
      { href: "/lgu/donations", label: "Donations", icon: Landmark, roles: ["manager", "auditor"] },
      { href: "/lgu/transparency", label: "Transparency", icon: Eye, roles: ["manager", "auditor"] },
    ],
  },
  {
    section: "Fulfill",
    links: [
      { href: "/lgu/receiving", label: "Receiving", icon: Inbox, roles: ["warehouse"] },
      { href: "/lgu/allocation", label: "Allocation", icon: ArrowLeftRight, roles: ["warehouse"] },
      { href: "/lgu/logistics", label: "Logistics", icon: Route, roles: ["warehouse"] },
      { href: "/lgu/delivery", label: "Delivery", icon: Truck, roles: ["warehouse"] },
      { href: "/lgu/verification", label: "Verification", icon: BadgeCheck, roles: ["warehouse", "auditor"] },
    ],
  },
  {
    section: "Assure",
    links: [
      { href: "/lgu/reconciliation", label: "Reconciliation", icon: Scale, roles: ["auditor"] },
      { href: "/lgu/reports", label: "Reports", icon: FileText, roles: ["manager", "auditor"] },
      { href: "/lgu/audit", label: "Audit Trail", icon: ShieldCheck, roles: ["auditor"] },
      { href: "/lgu/settings", label: "Settings", icon: Settings, roles: ["manager"] },
    ],
  },
];

function linkVisible(link: LguLink, roles: LguRole[]) {
  return link.roles.length === 0 || link.roles.some((r) => roles.includes(r));
}

/** Interactive LGU sidebar links (client leaf). Filtered by active RBAC roles. */
export function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [roles, setRoles] = useState<LguRole[]>(["manager", "warehouse", "auditor"]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setRoles(getLguRoles()));
    return () => cancelAnimationFrame(frame);
  }, []);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const visible = NAV.map((group) => ({
    ...group,
    links: group.links.filter((l) => linkVisible(l, roles)),
  })).filter((group) => group.links.length > 0);

  return (
    <div className="space-y-6">
      {visible.map((group) => (
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
      <div className="rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#f6ac21] bg-white p-4">
        <p className="font-display text-sm font-bold text-[#1a2333]">Validation before publication</p>
        <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
          No need goes public until a validator approves the estimate. Drafts stay internal.
        </p>
        <Link
          href="/lgu/validation"
          onClick={onNavigate}
          className="ugnay-btn-link ugnay-btn mt-2 !text-xs"
        >
          Open validation queue →
        </Link>
      </div>
    </div>
  );
}

/** Mobile section quick-jump: horizontally scrollable chip row (drawer stays canonical). */
function QuickJump() {
  const pathname = usePathname();
  const items = [
    { href: "/lgu/dashboard", label: "Dashboard" },
    { href: "/lgu/validation", label: "Validation" },
    { href: "/lgu/forecast", label: "Forecast" },
    { href: "/lgu/receiving", label: "Receiving" },
    { href: "/lgu/allocation", label: "Allocation" },
    { href: "/lgu/campaigns", label: "Campaigns" },
    { href: "/lgu/logistics", label: "Logistics" },
    { href: "/lgu/reconciliation", label: "Reconciliation" },
    { href: "/lgu/reports", label: "Reports" },
    { href: "/lgu/transparency", label: "Transparency" },
  ];
  return (
    <nav
      aria-label="LGU sections quick jump"
      className="chip-scroll no-scrollbar -mx-4 mb-4 flex snap-x gap-1.5 overflow-x-auto scroll-smooth px-4 py-1 lg:hidden"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap",
              active
                ? "border-[#084989] bg-[#084989] text-white shadow-sm"
                : "border-[#e5e7eb] bg-white text-[#1a2333]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** RBAC role switcher (mock): active roles persist to localStorage and filter the sidebar. */
function RoleSwitcher() {
  const [roles, setRoles] = useState<LguRole[]>(["manager", "warehouse", "auditor"]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRoles(getLguRoles()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle(role: LguRole) {
    setRoles((prev) => {
      const next = prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role];
      const safe = next.length > 0 ? next : (["manager"] as LguRole[]);
      setLguRoles(safe);
      return safe;
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu((v) => !v)}
        aria-expanded={openMenu}
        aria-label={`Active roles: ${roles.map((r) => LGU_ROLE_LABELS[r]).join(", ")}. Change roles`}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold whitespace-nowrap hover:bg-white/20 sm:text-sm"
      >
        <Users className="size-4" aria-hidden />
        {roles.length === 3 ? "All roles" : `${roles.length} role${roles.length === 1 ? "" : "s"}`}
      </button>
      {openMenu && (
        <>
          <button
            type="button"
            aria-label="Close role menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpenMenu(false)}
          />
          <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-[#e5e7eb] bg-white p-2 text-[#1a2333] shadow-xl">
            <p className="px-3 pt-1 pb-2 text-xs font-bold tracking-wider text-[#6b7280] uppercase">
              Acting roles (mock RBAC)
            </p>
            {(Object.keys(LGU_ROLE_LABELS) as LguRole[]).map((role) => {
              const on = roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(role)}
                  className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f3f3f3]"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-5 items-center justify-center rounded-md border-[1.5px] text-xs font-bold",
                      on ? "border-[#084989] bg-[#084989] text-white" : "border-[#e5e7eb] text-transparent",
                    )}
                  >
                    ✓
                  </span>
                  <span className="font-semibold">{LGU_ROLE_LABELS[role]}</span>
                </button>
              );
            })}
            <p className="px-3 pt-1 pb-2 text-xs text-[#6b7280]">
              Navigation and gated actions adapt to these roles.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** Interactive LGU portal chrome: top bar, sidebar, mobile drawer, footer. Client leaf. */
export default function LguShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-[#1a2333] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="lgu-menu-drawer"
              aria-label={open ? "Close LGU menu" : "Open LGU menu"}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
            <Link href="/lgu/dashboard" className="flex items-center gap-2">
              <BrandMark className="size-9" />
              <span className="leading-tight">
                <span className="font-display block text-base font-bold"><span className="text-[#f6ac21]">UGNAY</span> · LGU Portal</span>
                <span className="block text-xs text-white/70">City of Malolos</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <RoleSwitcher />
            <Link
              href="/lgu"
              className="rounded-full border border-white/30 px-3 py-1.5 font-semibold hover:bg-white/10"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-4 sm:px-6 sm:py-6">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20" aria-label="LGU">
            <SidebarLinks />
          </nav>
        </aside>

        <main id="main" className="min-w-0 flex-1 overflow-x-clip pb-[env(safe-area-inset-bottom,0px)]">
          {/* Section quick-jump: mobile primary nav complement (drawer stays canonical). */}
          <QuickJump />
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
          id="lgu-menu-drawer"
          aria-label="LGU menu"
          className={cn(
            "absolute top-0 left-0 flex h-full w-[85vw] max-w-72 flex-col bg-white pb-safe shadow-xl transition-transform duration-200 motion-reduce:transition-none",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-4">
            <span className="font-display text-base font-bold text-[#084989]">LGU sections</span>
            <button
              type="button"
              ref={drawerCloseRef}
              onClick={() => setOpen(false)}
              aria-label="Close LGU menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 hover:bg-[#f3f3f3]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="drawer-safe flex-1 overflow-y-auto p-4">
            <SidebarLinks onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </div>

      <footer className="border-t border-[#e5e7eb] bg-white pb-safe">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-4 text-xs text-[#6b7280] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>UGNAY LGU Portal · Sensitive beneficiary data stays protected.</p>
          <p>Sensitive beneficiary data hidden: no full names or addresses shown publicly.</p>
        </div>
      </footer>
    </div>
  );
}
