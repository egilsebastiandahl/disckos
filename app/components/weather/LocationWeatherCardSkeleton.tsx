import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LocationWeatherCardSkeletonProps {
  compact?: boolean;
  showHourly?: boolean;
  className?: string;
}

export default function LocationWeatherCardSkeleton({
  compact = false,
  showHourly = true,
  className,
}: LocationWeatherCardSkeletonProps) {
  const iconSize = compact ? "h-12 w-12" : "h-16 w-16";
  const tempSize = compact ? "h-7 w-12" : "h-9 w-14";

  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardHeader className="px-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-4">
          <Skeleton className={cn("rounded-full", iconSize)} />
          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
            <div className="flex items-baseline gap-2">
              <Skeleton className={tempSize} />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-3 mt-0.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>

        {showHourly && (
          <div className="mt-3 pt-3 border-t border-border">
            <Skeleton className="h-3 w-44 mb-1.5" />
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3 w-5" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
