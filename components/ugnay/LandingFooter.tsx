const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Campaigns", href: "#campaign" },
      { label: "Our story", href: "#story" },
      { label: "Relief demand map", href: "#features" },
    ],
  },
  {
    heading: "Understand",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Transparency", href: "#evidence" },
      { label: "Transparency", href: "#evidence" },
    ],
  },
  {
    heading: "Organizations",
    links: [
      { label: "Sponsors", href: "#partners" },
      { label: "LGU / NGO tools", href: "#partners" },
      { label: "Partner opportunities", href: "#partners" },
    ],
  },
];

/**
 * Landing-only footer following public/reference/UGNAY-Refined-Landing-Page.html
 * verbatim (brand line, columns, bottom bar). Same-page anchors only, so it is
 * intentionally not shared with other routes (they keep SiteFooter).
 */
export default function LandingFooter() {
  return (
    <footer className="border-t border-[#dbe5eb] bg-white pt-14 pb-9">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-9 pb-11 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#e39b00]"
            >
              {/* Plain img (not next/image): tiny static brand asset, always served byte-identical */}
              <img
                alt=""
                src="/ugnay-logo.svg"
                width={44}
                height={44}
                className="size-11 flex-none"
                draggable={false}
              />
              <span>UGNAY</span>
            </a>
            <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-[#516472]">
              Unified Giving Network And Yield. Right need. Right donation. Real
              impact.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-xs font-bold tracking-[0.08em] text-[#183246] uppercase">
                {col.heading}
              </p>
              <ul className="mt-2">
                {col.links.map((link, i) => (
                  <li key={`${link.label}-${i}`}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-[32px] items-center py-1 text-[13px] text-[#516472] hover:text-[#145b8a] hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-[#dbe5eb] pt-5 text-xs text-[#516472] sm:flex-row sm:justify-between">
          <span>
            © 2026 UGNAY · Combined landing page concept · All campaign figures are
            demo data.
          </span>
          <span>Every Need Verified. Every Donation Traced. Every Impact Accounted For.</span>
        </div>
      </div>
    </footer>
  );
}
