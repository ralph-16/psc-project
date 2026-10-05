import { Tent } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mock/campaigns";
import { SEVERITY_ACTION } from "@/lib/mock/campaigns";

const SEVERITY_STYLES: Record<Severity, { badge: string; dot: string }> = {
  Critical: { badge: "bg-[#c8102e] text-white", dot: "bg-[#c8102e]" },
  High: { badge: "bg-[#d97706] text-[#1a2333]", dot: "bg-[#d97706]" },
  Elevated: { badge: "bg-[#f6ac21] text-[#1a2333]", dot: "bg-[#f6ac21]" },
  Moderate: { badge: "bg-[#0b4a9c] text-white", dot: "bg-[#0b4a9c]" },
};

interface StatusBadgeProps {
  severity: Severity;
  /** Show the response-time guidance text (e.g. "Immediate aid"). Default true. */
  showGuidance?: boolean;
  className?: string;
}

export default function StatusBadge({ severity, showGuidance = true, className }: StatusBadgeProps) {
  const styles = SEVERITY_STYLES[severity];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
          styles.badge,
        )}
      >
        {severity}
        {showGuidance && (
          <span className="font-normal opacity-90">&nbsp;· {SEVERITY_ACTION[severity]}</span>
        )}
      </span>
      {severity === "Moderate" && (
        <span
          title="Evacuation center on standby"
          aria-label="Evacuation center on standby"
          className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-white p-1 text-[#0b4a9c]"
        >
          <Tent className="size-3.5" aria-hidden />
        </span>
      )}
    </span>
  );
}

export function SeverityDot({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2.5 rounded-full", SEVERITY_STYLES[severity].dot, className)}
    />
  );
}
