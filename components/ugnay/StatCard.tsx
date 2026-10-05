import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function StatCard({ label, value, sub, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("ugnay-card p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-sm font-semibold tracking-wide text-[#6b7280] uppercase">
          {label}
        </p>
        {Icon && (
          <span className="inline-flex items-center justify-center rounded-full bg-[#084989]/10 p-2 text-[#084989]">
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="font-display mt-2 text-3xl font-bold tracking-tight text-[#1a2333] tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-[#6b7280]">{sub}</p>}
    </div>
  );
}
