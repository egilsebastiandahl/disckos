import { Skeleton } from "@/components/ui/skeleton";

export default function ClubStatsSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <Skeleton className="h-10 w-56 mx-auto" />
        <Skeleton className="h-4 w-72 mx-auto mt-3" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-36 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </div>
  );
}
