"use client";

import { useState } from "react";
import { EventPhoto } from "@/app/types/event-photo.model";
import { Event } from "@/app/types/event.model";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PhotoGalleryProps {
  photos: EventPhoto[];
  events: Event[];
}

export default function PhotoGallery({ photos, events }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredPhotos = filter === "all" ? photos : photos.filter((p) => p.eventId === filter);

  const eventMap = new Map(events.map((e) => [e.id, e]));

  function openLightbox(photo: EventPhoto) {
    setSelectedPhoto(photo);
  }

  function closeLightbox() {
    setSelectedPhoto(null);
  }

  function navigatePhoto(direction: "prev" | "next") {
    if (!selectedPhoto) return;
    const idx = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const newIdx = direction === "prev" ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < filteredPhotos.length) {
      setSelectedPhoto(filteredPhotos[newIdx]);
    }
  }

  // Group photos by event for the collage effect
  const eventsWithPhotos = Array.from(new Set(filteredPhotos.map((p) => p.eventId))).map((eventId) => ({
    event: eventMap.get(eventId),
    photos: filteredPhotos.filter((p) => p.eventId === eventId),
  }));

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">Ingen bilder ennå.</p>
        <p className="text-muted-foreground text-sm mt-1">Bilder lastet opp fra eventer vil dukke opp her.</p>
      </div>
    );
  }

  return (
    <>
      {/* Event filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          Alle
        </button>
        {events
          .filter((e) => photos.some((p) => p.eventId === e.id))
          .map((event) => (
            <button
              key={event.id}
              onClick={() => setFilter(event.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === event.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {event.title}
            </button>
          ))}
      </div>

      {/* Masonry gallery */}
      {filter === "all" ? (
        <div className="space-y-10">
          {eventsWithPhotos.map(({ event, photos: eventPhotos }) => (
            <section key={event?.id ?? "unknown"}>
              {event && (
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                  {event.title}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {new Date(event.date).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </h3>
              )}
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {eventPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} onClick={() => openLightbox(photo)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onClick={() => openLightbox(photo)} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <CloseIcon className="text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("prev");
            }}
            className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <ChevronLeftIcon className="text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("next");
            }}
            className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <ChevronRightIcon className="text-white" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption || "Event photo"}
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
            />
            <div className="mt-3 text-center">
              {selectedPhoto.caption && <p className="text-white text-sm mb-1">{selectedPhoto.caption}</p>}
              <p className="text-white/60 text-xs">
                {selectedPhoto.displayName ?? "Ukjent"} •{" "}
                {new Date(selectedPhoto.createdAt).toLocaleDateString("nb-NO", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PhotoCard({ photo, onClick }: { photo: EventPhoto; onClick: () => void }) {
  return (
    <div
      className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition"
      onClick={onClick}
    >
      <img
        src={photo.imageUrl}
        alt={photo.caption || "Event photo"}
        className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {photo.caption && <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>}
        <p className="text-white/70 text-xs mt-0.5">{photo.displayName ?? "Ukjent"}</p>
      </div>
    </div>
  );
}
