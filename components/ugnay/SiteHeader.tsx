"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  HeartHandshake,
  Home,
  Landmark,
  Map as MapIcon,
  Menu,
  Route,
  ScrollText,
  Tag,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MobileTabBar from "@/components/ugnay/MobileTabBar";
import { BrandMark } from "@/components/ugnay/BrandMark";
import { LangToggle } from "@/components/ugnay/lang";

const PRIMARY_NAV = [
  { label: "Campaigns", href: "/campaigns", icon: FileText },
  { label: "How it works", href: "/how-it-works", icon: ScrollText },
  { label: "Track donation", href: "/track", icon: Route },
  { label: "Plans", href: "/plans", icon: Tag },
];

const GIVING_NAV = [
  { label: "Home", href: "/", icon: Home },
  { label: "Needs", href: "/needs", icon: HeartHandshake },
  { label: "Need map", href: "/map", icon: MapIcon },
  { label: "Account", href: "/account", icon: User },
];

const PARTNER_NAV = [
  { label: "Corporate", href: "/corporate", icon: Building2 },
  { label: "LGU", href: "/lgu", icon: Landmark },
];

/** Shared site shell header with hamburger drawer. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Close on Escape + lock body scroll while open.
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

  // Close drawer on route change.
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

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full p-2 text-[#1a2333] hover:bg-[#f3f3f3]"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
          <BrandMark />
          <span className="font-display truncate text-lg font-bold tracking-tight text-[#f6ac21] sm:text-xl">
            UGNAY
          </span>
        </Link>
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-display rounded-full px-3 py-2 text-sm font-semibold text-[#1a2333] hover:bg-[#f3f3f3] hover:text-[#084989]",
                  active && "bg-[#084989]/8 text-[#084989]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LangToggle />
          <Link href="/login" className="hidden whitespace-nowrap px-2 py-2 text-sm font-semibold text-[#1a2333] hover:text-[#084989] hover:underline md:inline-flex">
            Log in
          </Link>
          <div className="hidden shrink-0 md:block">
            <Link href="/track" className="ugnay-btn ugnay-btn-outline whitespace-nowrap">
              Track a donation
            </Link>
          </div>
          <Link href="/#quick-donate" className="ugnay-btn ugnay-btn-solid px-4 py-2 text-[13px] whitespace-nowrap sm:px-6 sm:text-sm">
            Donate
          </Link>
        </div>
      </div>

      {/* Drawer — works on all viewports: slides in from left over dimmed backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity motion-reduce:transition-none",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/25"
          onClick={() => setOpen(false)}
        />
        <nav
          ref={drawerRef}
          id="site-menu-drawer"
          aria-label="Site menu"
          className={cn(
            "absolute top-0 left-0 flex h-full w-[230px] flex-col bg-white/92 backdrop-blur-[14px] shadow-xl transition-transform duration-200 motion-reduce:transition-none",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between py-3 pr-2 pl-4">
            <div className="flex items-center gap-2">
              <BrandMark className="size-7" />
              <div>
                <p className="font-display text-sm font-bold text-[#f6ac21]">UGNAY</p>
                <p className="text-[11px] text-[#6b7280]">Bulacan Province</p>
              </div>
            </div>
            <button
              type="button"
              ref={drawerCloseRef}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-[#1a2333] hover:bg-[#f3f3f3]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="flex flex-col gap-0.5 overflow-y-auto px-4 pt-1 pb-4">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-[#1a2333] hover:bg-[#f3f3f3]",
                    active && "bg-[#084989]/8 font-semibold text-[#084989]",
                  )}
                >
                  <item.icon className="size-[17px] shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <p className="mt-3 px-2 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Your giving
            </p>
            {GIVING_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-[#1a2333] hover:bg-[#f3f3f3]",
                    active && "bg-[#084989]/8 font-semibold text-[#084989]",
                  )}
                >
                  <item.icon className="size-[17px] shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <p className="mt-3 px-2 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Partners
            </p>
            {PARTNER_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-[#1a2333] hover:bg-[#f3f3f3]",
                    active && "bg-[#084989]/8 font-semibold text-[#084989]",
                  )}
                >
                  <item.icon className="size-[17px] shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[#084989] px-2 py-2.5 text-sm font-semibold text-[#084989]"
            >
              Log in
            </Link>
          </div>
        </nav>
      </div>

      {/* Desktop partner links */}
      <div className="hidden border-t border-[#e5e7eb] bg-[#f3f3f3] md:block">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 sm:px-6">
          <span className="px-2 py-2 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Partners:
          </span>
          {PARTNER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[#084989] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
    <MobileTabBar />
    </>
  );
}
