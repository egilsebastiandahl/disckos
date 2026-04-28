"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { Location } from "@/app/types/location.model";
import { MapPin, Map, Globe } from "lucide-react";
import LocationTable from "./components/LocationTable";
import CreateLocation from "./components/CreateLocation";

export default function AdminLocationPage() {
  const { data: locations, isLoading, refetch } = useAdminFetch<Location[]>("/api/admin/location");

  const totalCount = locations?.length ?? 0;
  const withCoords = locations?.filter((l) => l.lat !== 0 || l.lon !== 0).length ?? 0;
  const withoutCoords = totalCount - withCoords;

  return (
    <div className="w-full space-y-8">
      <HeaderSection title="Lokasjoner" text="Administrer lokasjoner – opprett, rediger og slett." />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
            <MapPin className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Totalt lokasjoner</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{withCoords}</p>
            <p className="text-xs text-muted-foreground">Med koordinater</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-warm/10">
            <Map className="size-5 text-warm" />
          </div>
          <div>
            <p className="text-2xl font-bold">{withoutCoords}</p>
            <p className="text-xs text-muted-foreground">Uten koordinater</p>
          </div>
        </div>
      </div>

      {/* Location table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Alle lokasjoner</h2>
        <LocationTable locations={locations ?? []} isLoading={isLoading} onChanged={refetch} />
      </section>

      {/* Create location */}
      <section>
        <CreateLocation onCreated={refetch} />
      </section>
    </div>
  );
}
