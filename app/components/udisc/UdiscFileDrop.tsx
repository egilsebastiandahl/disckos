"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UdiscFileDropProps {
  onFile: (csv: string, fileName: string) => void;
  disabled?: boolean;
}

export default function UdiscFileDrop({ onFile, disabled }: UdiscFileDropProps) {
  const [dragging, setDragging] = useState(false);

  async function read(file: File | undefined) {
    if (!file) return;
    onFile(await file.text(), file.name);
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        read(e.dataTransfer.files[0]);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-6 py-10 text-center cursor-pointer transition-colors hover:border-primary/60",
        dragging && "border-primary bg-primary/5",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <FileUp className="size-8 text-primary" />
      <span className="font-medium">Slipp UDisc-filen her, eller klikk for å velge</span>
      <span className="text-sm text-muted-foreground">CSV-eksport fra UDisc-appen</span>
      <input
        type="file"
        accept=".csv,text/csv,text/comma-separated-values"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          read(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}
