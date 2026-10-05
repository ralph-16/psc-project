import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import CorporateNav from "@/components/ugnay/CorporateNav";

/** Corporate shell: site header/footer + corporate sub-navigation. */
export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="sticky top-16 z-30 border-b border-[#e5e7eb] bg-white md:top-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CorporateNav />
        </div>
      </div>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
