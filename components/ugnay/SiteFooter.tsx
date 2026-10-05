import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Give",
    links: [
      { label: "Active needs", href: "/needs" },
      { label: "Campaigns", href: "/campaigns" },
      { label: "Track a donation", href: "/track" },
    ],
  },
  {
    heading: "Verify",
    links: [
      { label: "Track a donation", href: "/track" },
      { label: "Campaigns", href: "/campaigns" },
      { label: "My account", href: "/account" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { label: "Corporate", href: "/corporate" },
      { label: "LGU desks", href: "/lgu" },
      { label: "My impact", href: "/account/impact" },
    ],
  },
];

/** Shared site shell footer. */
export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#084989] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-xl font-bold">Ugnay</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
            Every need verified, every peso traced. Connecting donors, LGUs, and sponsors across
            Region 3.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden /> Malolos, Bulacan · Region 3
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" aria-hidden /> (044) 000-0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" aria-hidden /> hello@ugnay.ph
            </li>
          </ul>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="font-display text-[13px] font-bold tracking-wider uppercase">{col.heading}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/80 hover:text-white hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Ugnay · Malolos, Bulacan</p>
          <p>Every figure updates with each confirmed delivery.</p>
        </div>
      </div>
    </footer>
  );
}
