"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/app/types/event.model";
import { EventPhoto } from "@/app/types/event-photo.model";
import useFetch from "@/app/hooks/useFetch";
import HeaderSection from "@/app/components/sections/HeaderSection";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import PhotoUpload from "./components/PhotoUpload";
import PhotoGallery from "./components/PhotoGallery";

function getActiveEvent(events: Event[]): Event | null {
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return (
    events.find((event) => {
      const eventDate = new Date(event.date);
      return Math.abs(now.getTime() - eventDate.getTime()) <= oneDayMs;
    }) ?? null
  );
}

export default function BilderPage() {
  const { data: events, isLoading: eventsLoading } = useFetch<Event[]>("/api/event");
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const activeEvent = events ? getActiveEvent(events) : null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPhotos = async () => {
    setPhotosLoading(true);
    try {
      const res = await fetch("/api/event/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (e) {
      console.error("Failed to fetch photos", e);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const isLoading = eventsLoading || photosLoading;

  return (
    <>
      <HeaderSection title="Bilder" text="Minner fra eventene våre. Del dine egne bilder når et event pågår!" />

      <main className="max-w-6xl mx-auto">
        {/* Upload section — only visible to authenticated users during active event */}
        {session && activeEvent && (
          <div className="mb-10 max-w-md mx-auto">
            <PhotoUpload activeEvent={activeEvent} onUploadComplete={fetchPhotos} />
          </div>
        )}

        {/* Info message for non-logged-in users during active event */}
        {!session && activeEvent && (
          <div className="mb-10 max-w-md mx-auto text-center">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Logg inn for å dele bilder fra <span className="font-medium text-foreground">{activeEvent.title}</span>
              </p>
            </div>
          </div>
        )}

        {/* Gallery */}
        {isLoading ? (
          <FrisbeeLoader text="Henter bilder..." size="lg" />
        ) : (
          <PhotoGallery photos={photos} events={events ?? []} />
        )}
      </main>
    </>
  );
}
