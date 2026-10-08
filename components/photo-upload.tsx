"use client";

import { useState } from "react";
import { getBrowserSupabase, EVIDENCE_BUCKET } from "@/lib/supabase-browser";
import { Upload, CheckCircle2, AlertCircle, X } from "lucide-react";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export function PhotoUpload({
  value = "",
  onUpload,
}: {
  value?: string;
  onUpload?: (url: string) => void;
}) {
  const [url, setUrl] = useState(value);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(value ? "done" : "idle");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("error");
      setMessage(`File type not allowed. Accepted: JPEG, PNG, WebP, GIF, PDF.`);
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setStatus("error");
      setMessage(`File too large (${sizeMB.toFixed(1)} MB). Maximum: ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Show local preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      // Storage not configured — set a local object URL as fallback
      const localUrl = URL.createObjectURL(file);
      setUrl(localUrl);
      onUpload?.(localUrl);
      setStatus("done");
      setMessage("Photo attached (will not persist without Supabase storage).");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setStatus("error");
      setMessage("Upload failed — " + error.message);
      return;
    }

    const { data } = supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(path);
    const publicUrl = data.publicUrl;
    setUrl(publicUrl);
    setPreviewUrl(publicUrl);
    onUpload?.(publicUrl);
    setStatus("done");
    setMessage("Photo uploaded to secure cloud storage.");
  }

  function clearFile() {
    setUrl("");
    onUpload?.("");
    setStatus("idle");
    setMessage("");
    setPreviewUrl(null);
  }

  return (
    <div>
      <input type="hidden" name="photo_url" value={url} />

      {status !== "done" && (
        <label className="relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-black/15 bg-slate-50 cursor-pointer hover:border-brand/50 hover:bg-brand/5 transition-colors">
          <Upload size={22} className="text-black/30 mb-2" />
          <span className="text-sm text-black/50">Click to upload photo or document</span>
          <span className="text-xs text-black/35 mt-1">JPEG, PNG, WebP, GIF, PDF · max {MAX_SIZE_MB} MB</span>
          <input
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      )}

      {status === "uploading" && (
        <p className="mt-2 text-xs text-black/50 flex items-center gap-1">
          <span className="animate-spin inline-block h-3 w-3 border border-brand border-t-transparent rounded-full" />
          Uploading…
        </p>
      )}

      {status === "error" && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={14} />
          {message}
        </div>
      )}

      {status === "done" && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Preview" className="h-14 w-14 rounded-lg object-cover border border-black/10" />
          ) : (
            <CheckCircle2 size={20} className="text-green-600" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-green-800">Photo attached</div>
            {message && <p className="text-xs text-green-600">{message}</p>}
          </div>
          <button type="button" onClick={clearFile} className="text-green-600 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
