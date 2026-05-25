"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { type Event } from "@/app/types/event.model";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";

interface PhotoUploadProps {
  activeEvent: Event;
  onUploadComplete: () => void;
}

type QueuedFile = {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export default function PhotoUpload({
  activeEvent,
  onUploadComplete,
}: PhotoUploadProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [doneCount, setDoneCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newItems: QueuedFile[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        newItems.push({
          id: crypto.randomUUID(),
          file,
          preview: "",
          status: "error",
          error: `For stor (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks 10 MB.`,
        });
        continue;
      }
      newItems.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      });
    }
    setQueue((q) => [...q, ...newItems]);
    setBatchError(null);
    setDoneCount(0);
  }

  function removeFile(id: string) {
    setQueue((q) => {
      const item = q.find((f) => f.id === id);
      if (item && item.preview) URL.revokeObjectURL(item.preview);
      return q.filter((f) => f.id !== id);
    });
  }

  function clearAll() {
    queue.forEach((q) => {
      if (q.preview) URL.revokeObjectURL(q.preview);
    });
    setQueue([]);
    setCaption("");
    setBatchError(null);
    setDoneCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload() {
    const pending = queue.filter((q) => q.status === "pending" || q.status === "error");
    if (pending.length === 0) return;

    setUploading(true);
    setBatchError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      setBatchError("Du må være logget inn for å laste opp bilder.");
      setUploading(false);
      return;
    }

    let success = 0;
    for (const item of pending) {
      setQueue((q) =>
        q.map((f) => (f.id === item.id ? { ...f, status: "uploading", error: undefined } : f)),
      );

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("eventId", activeEvent.id);
      if (caption.trim()) formData.append("caption", caption.trim());

      try {
        const res = await fetch("/api/event/photos", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          let msg = `Opplasting feilet (${res.status}).`;
          try {
            const data = await res.json();
            if (data?.error) msg = data.error;
          } catch {
            // body wasn't JSON; keep generic message
          }
          setQueue((q) =>
            q.map((f) => (f.id === item.id ? { ...f, status: "error", error: msg } : f)),
          );
          continue;
        }

        success += 1;
        setDoneCount(success);
        setQueue((q) =>
          q.map((f) => (f.id === item.id ? { ...f, status: "done" } : f)),
        );
      } catch {
        setQueue((q) =>
          q.map((f) =>
            f.id === item.id ? { ...f, status: "error", error: "Nettverksfeil. Prøv igjen." } : f,
          ),
        );
      }
    }

    setUploading(false);
    onUploadComplete();

    // If everything succeeded, auto-clear so the user can immediately add more.
    setQueue((q) => {
      const allDone = q.every((f) => f.status === "done");
      if (allDone) {
        q.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return [];
      }
      return q;
    });
  }

  const pendingCount = queue.filter((q) => q.status === "pending" || q.status === "error").length;
  const errorCount = queue.filter((q) => q.status === "error").length;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <AddAPhotoIcon className="text-primary" fontSize="small" />
        </div>
        <div>
          <p className="font-semibold text-sm">Del bilder fra eventet</p>
          <p className="text-xs text-muted-foreground">{activeEvent.title}</p>
        </div>
      </div>

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
        <AddAPhotoIcon className="text-muted-foreground" fontSize="large" />
        <span className="text-sm text-muted-foreground">
          {queue.length === 0 ? "Trykk for å velge bilder" : "Legg til flere bilder"}
        </span>
        <span className="text-xs text-muted-foreground">
          JPEG, PNG, WebP eller HEIC • Maks 10 MB per bilde
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {queue.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {queue.map((item) => (
              <div key={item.id} className="relative aspect-square">
                {item.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground px-2 text-center">
                    {item.file.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  disabled={uploading && item.status === "uploading"}
                  className="absolute top-1 right-1 w-6 h-6 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition disabled:opacity-50"
                  aria-label="Fjern bilde"
                >
                  <CloseIcon style={{ fontSize: 14 }} />
                </button>
                {item.status !== "pending" && (
                  <div className="absolute inset-x-0 bottom-0 text-[10px] px-1 py-0.5 rounded-b-lg bg-background/85 text-foreground text-center">
                    {item.status === "uploading" && "Laster opp..."}
                    {item.status === "done" && "Lastet opp ✓"}
                    {item.status === "error" && (item.error ?? "Feil")}
                  </div>
                )}
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Felles bildetekst (valgfritt)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            disabled={uploading}
            className="w-full border border-border bg-background rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading || pendingCount === 0}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/85 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? `Laster opp... (${doneCount}/${pendingCount})`
                : pendingCount === 1
                  ? "Last opp 1 bilde"
                  : `Last opp ${pendingCount} bilder`}
            </button>
            {!uploading && (
              <button
                onClick={clearAll}
                className="px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition"
              >
                Fjern alle
              </button>
            )}
          </div>

          {errorCount > 0 && !uploading && (
            <p className="text-xs text-destructive">
              {errorCount} bilde{errorCount === 1 ? "" : "r"} feilet. Trykk på knappen igjen for å prøve på nytt.
            </p>
          )}
        </div>
      )}

      {batchError && (
        <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {batchError}
        </p>
      )}
    </div>
  );
}
