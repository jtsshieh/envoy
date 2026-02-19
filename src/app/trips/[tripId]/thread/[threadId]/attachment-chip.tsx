"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { type Attachment } from "@/lib/data";
import { AttachmentLightbox } from "../../attachments/attachment-lightbox";

export function AttachmentChip({
  attachment,
  outbound,
  sourceBadge,
}: {
  attachment: Attachment;
  outbound: boolean;
  sourceBadge?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <AttachmentLightbox
          attachment={attachment}
          onClose={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors group ${
          outbound
            ? "bg-white/10 hover:bg-white/20"
            : "bg-[#F0EDE8] hover:bg-[#E5E0D8]"
        }`}
      >
        {attachment.type === "image" && attachment.previewUrl ? (
          <div className="size-9 rounded-lg overflow-hidden shrink-0 bg-[#E5E0D8]">
            {/* biome-ignore lint/a11y/useAltText: thumbnail */}
            <img
              src={attachment.previewUrl}
              alt={attachment.name}
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
              outbound ? "bg-white/15" : "bg-red-50"
            }`}
          >
            <FileText
              className={`size-4 ${outbound ? "text-white/80" : "text-red-500"}`}
            />
          </div>
        )}

        <div className="min-w-0">
          <p
            className={`text-xs font-medium leading-snug truncate max-w-[140px] ${
              outbound ? "text-white" : "text-[#1C2B4A]"
            }`}
          >
            {attachment.name}
          </p>
          <p
            className={`text-[10px] mt-0.5 ${
              outbound ? "text-white/60" : "text-[#7A7265]"
            }`}
          >
            {attachment.size}
          </p>
          {sourceBadge && (
            <span
              className={`inline-flex mt-1 text-[9px] px-1.5 py-0.5 rounded-full border ${
                outbound
                  ? "text-white/75 border-white/25"
                  : "text-[#385C97] bg-[#E7F0FF] border-[#CFE0FF]"
              }`}
            >
              {sourceBadge}
            </span>
          )}
        </div>
      </button>
    </>
  );
}
