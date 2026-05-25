import { Skeleton } from "@/components/ui/skeleton";

function PlayerCardSkeleton() {
  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-5 md:p-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-muted/60" />
      <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-3" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-44" />
      <div className="w-12 h-px bg-border my-4" />
      <div className="flex flex-col items-center gap-1 mb-4">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function HallOfFameSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-8 md:mb-12">
        <Skeleton className="h-10 w-56 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto mt-3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlayerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
