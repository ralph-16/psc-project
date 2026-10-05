import { cn } from "@/lib/utils";

interface LoadingStateProps {
  lines?: number;
  className?: string;
}

/** Skeleton placeholder block. */
export default function LoadingState({ lines = 3, className }: LoadingStateProps) {
  return (
    <div className={cn("ugnay-card space-y-3 p-5", className)} aria-busy="true" aria-label="Loading">
      <div className="h-5 w-1/3 animate-pulse rounded-full bg-[#e5e7eb]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded-full bg-[#e5e7eb]"
          style={{ width: `${92 - i * 14}%` }}
        />
      ))}
    </div>
  );
}
