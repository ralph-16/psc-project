import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mock/campaigns";

const SEVERITY_FILL: Record<Severity, string> = {
  Critical: "ugnay-progress-fill-critical",
  High: "ugnay-progress-fill-high",
  Elevated: "ugnay-progress-fill-elevated",
  Moderate: "ugnay-progress-fill-moderate",
};

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  /**
   * Optional severity tint for the fill (doc: cards section — crimson /
   * orange / gold / trust). Defaults to navy for neutral contexts
   * (match scores, need rows). `barClassName` still wins when passed
   * (e.g. Completeness green, which is complete-only per brand).
   */
  severity?: Severity;
}

export default function ProgressBar({ value, className, barClassName, showLabel = false, severity }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-[6px] bg-[#f3f3f3]"
      >
        <div
          className={cn(
            "h-full rounded-[6px] bg-[#084989] transition-all motion-reduce:transition-none",
            severity && SEVERITY_FILL[severity],
            barClassName,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="font-display ugnay-peso mt-1 text-sm font-semibold text-[#1a2333] tabular-nums">
          {clamped}%
        </p>
      )}
    </div>
  );
}
