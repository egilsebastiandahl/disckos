"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/app/types/event.model";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";

interface PhotoUploadProps {
  activeEvent: Event;
  onUploadComplete: () => void;
}

export default function PhotoUpload({ activeEvent, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      setError("Du må være logget inn for å laste opp bilder.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("eventId", activeEvent.id);
    if (caption.trim()) formData.append("caption", caption.trim());

    try {
      const res = await fetch("/api/event/photos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Opplasting feilet.");
        setUploading(false);
        return;
      }

      setSuccess(true);
      clearSelection();
      onUploadComplete();
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <AddAPhotoIcon className="text-primary" fontSize="small" />
        </div>
        <div>
          <p className="font-semibold text-sm">Del bilder fra dagens event</p>
          <p className="text-xs text-muted-foreground">{activeEvent.title}</p>
        </div>
      </div>

      {!preview ? (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
          <AddAPhotoIcon className="text-muted-foreground" fontSize="large" />
          <span className="text-sm text-muted-foreground">Trykk for å velge bilde</span>
          <span className="text-xs text-muted-foreground">JPEG, PNG eller WebP • Maks 10MB</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
            <button
              onClick={clearSelection}
              className="absolute top-2 right-2 w-7 h-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Legg til en bildetekst (valgfritt)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            className="w-full border border-border bg-background rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/85 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Laster opp..." : "Last opp bilde"}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

      {success && (
        <p className="mt-3 text-sm text-primary bg-primary/10 rounded-lg px-3 py-2">Bildet ble lastet opp! 🎉</p>
      )}
    </div>
  );
}
