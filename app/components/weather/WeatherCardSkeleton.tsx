import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface WeatherCardSkeletonProps {
  variant?: "now" | "event";
  className?: string;
}

export default function WeatherCardSkeleton({
  variant = "now",
  className,
}: WeatherCardSkeletonProps) {
  if (variant === "event") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-3 mt-0.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}
