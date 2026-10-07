import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import CampaignDirectory from "@/components/ugnay/CampaignDirectory";
import { campaigns } from "@/lib/mock/campaigns";

/** Server shell + interactive directory leaf (DON-2, mock data). */
export default function CampaignsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Campaigns" }]}
          title="Verified campaigns"
          description="Every campaign is a human-validated appeal with a public money trail. Demo figures."
        />
        <div className="mt-6">
          <CampaignDirectory campaigns={campaigns} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
