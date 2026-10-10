import { AlertTriangle, Check, Circle, CircleDot, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDateTime } from "@/lib/mock/totals";
import { DISPUTE_STAGES, type TraceEvent } from "@/lib/mock/trace";

interface TraceTimelineProps {
  events: TraceEvent[];
  /** Index of the current (in-progress) stage. Defaults to last event. */
  currentIndex?: number;
}

export default function TraceTimeline({ events, currentIndex }: TraceTimelineProps) {
  const current = currentIndex ?? events.length - 1;
  return (
    <ol className="relative space-y-6 border-l-2 border-[#e5e7eb] pl-0">
      {events.map((event, i) => {
        const alert = (DISPUTE_STAGES as string[]).includes(event.stage);
        const state = alert ? "alert" : i < current ? "done" : i === current ? "current" : "pending";
        return (
          <li key={event.id} className="relative pl-10">
            <span
              aria-hidden
              className={cn(
                "absolute top-0 -left-[15px] inline-flex size-7 items-center justify-center rounded-full border-2 bg-white",
                state === "done" && "border-[#1b9c6e] text-[#1b9c6e]",
                state === "current" && "border-[#084989] text-[#084989]",
                state === "pending" && "border-[#e5e7eb] text-[#6b7280]",
                state === "alert" && "border-[#d97706] text-[#d97706]",
              )}
            >
              {state === "done" ? (
                <Check className="size-3.5" aria-hidden />
              ) : state === "alert" ? (
                <AlertTriangle className="size-3.5" aria-hidden />
              ) : state === "current" ? (
                <CircleDot className="size-3.5" aria-hidden />
              ) : (
                <Circle className="size-3.5" aria-hidden />
              )}
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h4 className="font-display text-base font-bold text-[#1a2333]">{event.stage}</h4>
              <time className="text-xs text-[#6b7280]">
                {mockDateTime(event.timestamp)}
              </time>
            </div>
            <p className="mt-0.5 text-sm font-medium text-[#1a2333]">{event.actor}</p>
            <p className="text-sm text-[#6b7280]">{event.note}</p>
            {event.evidence && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#084989]">
                <FileText className="size-3.5" aria-hidden />
                {event.evidence} · {event.txRef}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
