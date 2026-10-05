import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Campaign, Severity } from "@/lib/mock/campaigns";
import ProgressBar from "./ProgressBar";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "featured" | "standard";
  className?: string;
}

const SEVERITY_BADGE: Record<Severity, string> = {
  Critical: "bg-[#c8102e] text-white",
  High: "bg-[#d97706] text-[#1a2333]",
  Elevated: "bg-[#f6ac21] text-[#1a2333]",
  Moderate: "bg-[#0b4a9c] text-white",
};

const SEVERITY_BAR: Record<Severity, string> = {
  Critical: "bg-[#c8102e]",
  High: "bg-[#d97706]",
  Elevated: "bg-[#f6ac21]",
  Moderate: "bg-[#0b4a9c]",
};

function badgeLabel(severity: Severity) {
  return severity === "Moderate" ? "Moderate" : `${severity} need`;
}

function families(n: number) {
  return `${n.toLocaleString("en-PH")} families`;
}

function packs(n: number) {
  return `${n.toLocaleString("en-PH")} packs`;
}

export default function CampaignCard({ campaign, variant = "standard", className }: CampaignCardProps) {
  const href = `/campaigns/${campaign.slug}`;
  const donateHref = `${href}/donate`;
  const badge = (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        SEVERITY_BADGE[campaign.severity],
      )}
    >
      {badgeLabel(campaign.severity)}
    </span>
  );

  if (variant === "featured") {
    return (
      <article className={cn("ugnay-card flex flex-col gap-2.5 p-6", className)}>
        {badge}
        <h3 className="font-display text-[19px] leading-snug font-semibold text-[#1a2333]">
          <Link href={href} className="hover:text-[#084989] hover:underline">
            {campaign.title}
          </Link>
        </h3>
        <p className="text-[12.5px] text-[#6b7280]">
          {campaign.severity} need in {campaign.barangay}, {campaign.municipality}
        </p>
        <p className="line-clamp-2 text-sm text-[#6b7280]">{campaign.description}</p>
        <ProgressBar
          value={campaign.progress}
          barClassName={SEVERITY_BAR[campaign.severity]}
          className="mt-1"
        />
        <p className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#6b7280]">
          <span className="tabular-nums">
            {packs(campaign.secured)} / {packs(campaign.required)}
          </span>
          <span className="tabular-nums">{families(campaign.families)}</span>
        </p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href={href} className="ugnay-btn ugnay-btn-outline">
            View Campaign
          </Link>
          <Link href={donateHref} className="ugnay-btn ugnay-btn-solid">
            Donate Now
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("ugnay-card flex flex-col gap-2 p-4", className)}>
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
          SEVERITY_BADGE[campaign.severity],
        )}
      >
        {badgeLabel(campaign.severity)}
      </span>
      <h3 className="font-display text-[15px] leading-snug font-semibold text-[#1a2333]">
        <Link href={href} className="hover:text-[#084989] hover:underline">
          {campaign.title}
        </Link>
      </h3>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#6b7280]">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" aria-hidden />
          {campaign.municipality}, {campaign.province}
        </span>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Users className="size-3.5" aria-hidden />
          {families(campaign.families)}
        </span>
      </p>
      <ProgressBar
        value={campaign.progress}
        barClassName={SEVERITY_BAR[campaign.severity]}
        className="mt-1"
      />
      <p className="flex items-center justify-between gap-2 text-[12.5px] text-[#6b7280]">
        <span className="tabular-nums">
          {packs(campaign.secured)} / {packs(campaign.required)}
        </span>
        <span className="tabular-nums">{campaign.progress}%</span>
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href={href}
          className="inline-flex min-h-[44px] items-center text-[13px] font-semibold text-[#084989] hover:underline hover:underline-offset-4"
        >
          View
        </Link>
        <Link
          href={donateHref}
          className="ugnay-btn ugnay-btn-solid ugnay-btn-sm"
        >
          Donate Now
        </Link>
      </div>
    </article>
  );
}
