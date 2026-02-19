"use client";

import { useEffect } from "react";
import { X, Download, FileText } from "lucide-react";
import { type Attachment } from "@/lib/data";

export function AttachmentLightbox({
  attachment,
  onClose,
}: {
  attachment: Attachment;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0D1826]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex flex-col max-w-4xl max-h-[90vh] w-full mx-6 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E0D8] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {attachment.type === "pdf" ? (
              <FileText className="size-4 text-red-500 shrink-0" />
            ) : (
              <div className="size-4 rounded-sm bg-sky-100 shrink-0 flex items-center justify-center">
                <span className="text-[7px] font-bold text-sky-600">IMG</span>
              </div>
            )}
            <span className="text-sm font-medium text-[#1C2B4A] truncate">
              {attachment.name}
            </span>
            <span className="text-xs text-[#7A7265] shrink-0">{attachment.size}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              type="button"
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium text-[#1C2B4A] bg-[#F0EDE8] hover:bg-[#E5E0D8] transition-colors"
            >
              <Download className="size-3" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="size-7 flex items-center justify-center rounded-lg text-[#7A7265] hover:bg-[#F0EDE8] hover:text-[#1C2B4A] transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[#F8F7F4] flex items-center justify-center p-6">
          {attachment.type === "image" && attachment.previewUrl ? (
            // biome-ignore lint/a11y/useAltText: preview image in lightbox
            <img
              src={attachment.previewUrl}
              alt={attachment.name}
              className="max-w-full max-h-full rounded-xl shadow-lg object-contain"
            />
          ) : (
            /* PDF placeholder */
            <div className="w-full max-w-lg bg-white rounded-xl shadow ring-1 ring-[#E5E0D8] overflow-hidden">
              {/* Mock PDF pages */}
              <div className="bg-[#E8E3DA] px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[#7A7265]">
                  {attachment.name}
                </span>
                <span className="text-[10px] text-[#7A7265]">Page 1 of 3</span>
              </div>
              <div className="p-8 space-y-3">
                <div className="h-4 bg-[#1C2B4A] rounded w-2/3" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-full" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-5/6" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-full" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-4/6" />
                <div className="mt-5 h-2.5 bg-[#E5E0D8] rounded w-full" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-full" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-3/4" />
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="h-16 bg-[#F0EDE8] rounded" />
                  <div className="h-16 bg-[#F0EDE8] rounded" />
                </div>
                <div className="h-2.5 bg-[#E5E0D8] rounded w-full mt-2" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-5/6" />
                <div className="h-2.5 bg-[#E5E0D8] rounded w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
