import { Skeleton } from "@/components/ui/skeleton";

const TILE_HEIGHTS = [
  "h-48",
  "h-64",
  "h-40",
  "h-56",
  "h-72",
  "h-44",
  "h-52",
  "h-60",
  "h-48",
  "h-64",
  "h-40",
  "h-56",
];

export default function PhotoGallerySkeleton() {
  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      <div className="space-y-10">
        <section>
          <Skeleton className="h-6 w-64 mb-4" />
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {TILE_HEIGHTS.map((height, i) => (
              <Skeleton
                key={i}
                className={`break-inside-avoid w-full ${height} rounded-lg`}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
