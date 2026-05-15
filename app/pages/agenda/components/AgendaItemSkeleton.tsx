import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import "../styles/agenda-item.css";

export default function AgendaItemSkeleton() {
  return (
    <div className="agenda-item min-w-[300px] sm:min-w-md md:max-w-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <Separator className="mb-4 mt-2 bg-border" />
      <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-44" />
      </div>
    </div>
  );
}

export function AgendaListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="flex flex-col gap-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AgendaItemSkeleton key={i} />
      ))}
    </section>
  );
}
