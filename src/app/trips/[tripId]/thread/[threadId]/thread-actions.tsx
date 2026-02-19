"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Paperclip, X, FileText, Check } from "lucide-react";

interface StagedFile {
  name: string;
  size: string;
  type: "image" | "pdf" | "other";
  previewUrl?: string;
}

export function ThreadActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [sent, setSent] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: StagedFile[] = [];
    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      next.push({
        name: file.name,
        size: formatSize(file.size),
        type: isImage ? "image" : isPdf ? "pdf" : "other",
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    }
    setStaged((prev) => [...prev, ...next]);
    setSent(false);
  }

  function remove(name: string) {
    setStaged((prev) => prev.filter((f) => f.name !== name));
  }

  function handleSend() {
    setSent(true);
    setStaged([]);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Staged attachments preview */}
      {staged.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-end max-w-sm">
          {staged.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-1.5 bg-[#F0EDE8] rounded-lg pl-2 pr-1 py-1"
            >
              {f.type === "image" && f.previewUrl ? (
                // biome-ignore lint/a11y/useAltText: thumbnail preview
                <img
                  src={f.previewUrl}
                  alt={f.name}
                  className="size-5 rounded object-cover shrink-0"
                />
              ) : (
                <FileText className="size-3.5 text-red-500 shrink-0" />
              )}
              <span className="text-[10px] text-[#1C2B4A] font-medium max-w-[100px] truncate">
                {f.name}
              </span>
              <span className="text-[10px] text-[#7A7265]">{f.size}</span>
              <button
                type="button"
                onClick={() => remove(f.name)}
                className="size-4 flex items-center justify-center rounded text-[#7A7265] hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sent confirmation */}
      {sent && (
        <p className="text-[10px] text-emerald-700 flex items-center gap-1">
          <Check className="size-3" />
          Attachments sent
        </p>
      )}

      <div className="flex items-center gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 border-[#E5E0D8] text-[#7A7265] hover:text-[#1C2B4A] text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-3" />
          Attach
        </Button>

        {staged.length > 0 ? (
          <Button
            type="button"
            size="sm"
            className="h-7 gap-1.5 bg-[#1C2B4A] text-white hover:bg-[#243459] text-xs"
            onClick={handleSend}
          >
            <Plus className="size-3" />
            Send with {staged.length} file{staged.length !== 1 ? "s" : ""}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-7 gap-1.5 bg-[#1C2B4A] text-white hover:bg-[#243459] text-xs"
          >
            <Plus className="size-3" />
            New Message
          </Button>
        )}
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
