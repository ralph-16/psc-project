import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

export interface ChecklistItem {
  label: string;
  done: boolean;
}

interface CompletenessProps {
  /** 0–100. Default value 85. */
  percent?: number;
  items?: ChecklistItem[];
  className?: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { label: "Needs validated by LGU desk", done: true },
  { label: "Donations confirmed & receipted", done: true },
  { label: "Allocation plan published", done: true },
  { label: "Delivery photos uploaded", done: true },
  { label: "Field verification sign-off", done: false },
];

export default function Completeness({ percent = 85, items = DEFAULT_ITEMS, className }: CompletenessProps) {
  return (
    <div className={cn("ugnay-card p-5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-bold text-[#1a2333]">Record Completeness</h3>
        <span className="font-display text-2xl font-bold text-[#084989] tabular-nums">{percent}%</span>
      </div>
      <ProgressBar value={percent} className="mt-3" barClassName="bg-[#1b9c6e]" />
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 text-sm">
            {item.done ? (
              <Check className="mt-0.5 size-4 shrink-0 text-[#1b9c6e]" aria-hidden />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-[#6b7280]" aria-hidden />
            )}
            <span className={item.done ? "text-[#1a2333]" : "text-[#6b7280]"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
