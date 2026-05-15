import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EventWeatherSectionSkeletonProps {
  isNextEvent?: boolean;
}

export default function EventWeatherSectionSkeleton({
  isNextEvent,
}: EventWeatherSectionSkeletonProps) {
  const labelClass = isNextEvent ? "bg-primary-foreground/20" : "bg-muted/60";

  return (
    <div className="flex flex-col gap-2">
      <Skeleton className={cn("h-3 w-24", labelClass)} />
      <div className="flex items-center gap-3">
        <Skeleton className={cn("h-14 w-14 rounded-full", labelClass)} />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <Skeleton className={cn("h-7 w-12", labelClass)} />
            <Skeleton className={cn("h-3 w-24", labelClass)} />
          </div>
          <div className="flex gap-3 mt-0.5">
            <Skeleton className={cn("h-3 w-20", labelClass)} />
            <Skeleton className={cn("h-3 w-14", labelClass)} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <Skeleton className={cn("h-3 w-5", labelClass)} />
            <Skeleton className={cn("h-5 w-5 rounded-full", labelClass)} />
            <Skeleton className={cn("h-3 w-4", labelClass)} />
          </div>
        ))}
      </div>
    </div>
  );
}
