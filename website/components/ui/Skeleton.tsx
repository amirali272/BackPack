import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-lg", className)} />;
}

/** A card-shaped placeholder used while a panel's data is loading. */
export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)} aria-hidden>
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="mt-4 h-7 w-20" />
      <div className="mt-5 space-y-2.5">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={cn("h-2.5", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}
