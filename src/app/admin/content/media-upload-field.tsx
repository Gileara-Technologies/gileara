"use client";

// Shared image field for the Insights and Playbooks forms: a text input
// for manual entry (an existing /public path, or a full external URL --
// unchanged from before this upload pipeline existed) plus a file
// picker that uploads to R2 via POST /api/admin/content/media and fills
// the text input with the returned path on success. The text input
// stays editable either way -- uploading is a convenience, not the only
// way to set this field.

import { useId, useState } from "react";
import type { MediaPrefix } from "@/lib/cms/media-storage";

const fieldClass =
  "w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-on-surface-variant";

const secondaryButtonClass =
  "inline-flex items-center gap-1 rounded border border-outline-variant px-2.5 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60";

interface UploadResponse {
  ok: boolean;
  path?: string;
  error?: string;
}

interface MediaUploadFieldProps {
  prefix: MediaPrefix;
  name: string;
  label: string;
  hint: string;
  defaultValue?: string;
  placeholder: string;
}

export function MediaUploadField({ prefix, name, label, hint, defaultValue, placeholder }: MediaUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const fileId = useId();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file after a retry
    if (!file) {
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("prefix", prefix);
      body.set("file", file);
      const res = await fetch("/api/admin/content/media", { method: "POST", body });
      const data = (await res.json()) as UploadResponse;
      if (!res.ok || !data.ok || !data.path) {
        setError(data.error ?? "The image could not be uploaded.");
        return;
      }
      setValue(data.path);
    } catch {
      setError("The image could not be uploaded. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={fieldClass}
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label htmlFor={fileId} className={`${secondaryButtonClass} cursor-pointer`}>
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            cloud_upload
          </span>
          {uploading ? "Uploading..." : "Upload an image"}
        </label>
        <input
          id={fileId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
        {error && (
          <span role="alert" className="text-xs text-error">
            {error}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-on-surface-variant">{hint}</p>
    </div>
  );
}
