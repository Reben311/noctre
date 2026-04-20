import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Upload } from "lucide-react";

interface Props {
  variant?: "hero" | "full";
  onImageReady?: (dataUrl: string) => void;
}

export function UploadDropzone({ variant = "full", onImageReady }: Props) {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        try {
          sessionStorage.setItem("storysound:image", dataUrl);
          sessionStorage.removeItem("storysound:analysis");
        } catch { /* noop */ }
        onImageReady?.(dataUrl);
        navigate({ to: "/analyze" });
      };
      reader.readAsDataURL(file);
    },
    [navigate, onImageReady]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const isHero = variant === "hero";

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`group block cursor-pointer rounded-xl bg-card brutal brutal-hover transition-all ${
        dragOver ? "bg-accent" : ""
      } ${isHero ? "p-6" : "p-8"}`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-md bg-foreground text-background grid place-items-center mb-3">
          <Upload size={20} />
        </div>
        <h3 className={`font-display tracking-tight ${isHero ? "text-xl" : "text-2xl"}`}>
          Drop a photo
        </h3>
        <p className="mt-1 text-xs font-mono uppercase text-muted-foreground">
          or tap to browse
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-4 py-2 text-xs font-mono uppercase brutal-sm">
          Choose image →
        </div>
      </div>
    </label>
  );
}
