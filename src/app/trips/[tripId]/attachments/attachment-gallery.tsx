"use client";

import { useState } from "react";
import Link from "next/link";
import { type AttachmentWithContext } from "@/lib/data";
import { AttachmentLightbox } from "./attachment-lightbox";
import { FileText, Paperclip } from "lucide-react";

function groupByOperator(attachments: AttachmentWithContext[]) {
  const map = new Map<string, AttachmentWithContext[]>();
  for (const att of attachments) {
    const key = att.operatorName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(att);
  }
  return map;
}

export function AttachmentGallery({
  attachments,
  tripId,
}: {
  attachments: AttachmentWithContext[];
  tripId: string;
}) {
  const [lightbox, setLightbox] = useState<AttachmentWithContext | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "pdf">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const tagOptions = Array.from(
    new Set(attachments.flatMap((a) => a.tags ?? [])),
  ).sort();

  const filtered = attachments.filter((a) => {
    const typeMatch = typeFilter === "all" ? true : a.type === typeFilter;
    const tagMatch = selectedTag === "all" ? true : (a.tags ?? []).includes(selectedTag);
    return typeMatch && tagMatch;
  });

  const grouped = groupByOperator(filtered);
  const images = attachments.filter((a) => a.type === "image");
  const pdfs = attachments.filter((a) => a.type === "pdf");

  return (
    <>
      {lightbox && (
        <AttachmentLightbox
          attachment={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="px-8 py-6">
        {/* Summary row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-lg bg-[#1C2B4A] flex items-center justify-center shrink-0">
            <Paperclip className="size-4 text-[#C9A84C]" />
          </div>
          <div className="select-none">
            <p className="text-sm font-semibold text-[#1C2B4A]">
              {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
            </p>
            <p className="text-[10px] text-[#7A7265]">
              {images.length} image{images.length !== 1 ? "s" : ""} · {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Unified filter bar: type selector + tag pills */}
        <div className="flex items-center gap-2 mb-5 flex-wrap select-none">
          {/* Type segmented control */}
          <div className="flex items-center gap-px bg-[#F0EDE8] rounded-lg p-0.5 shrink-0">
            {([
              { value: "all", label: `All (${attachments.length})` },
              { value: "image", label: `Images (${images.length})` },
              { value: "pdf", label: `PDFs (${pdfs.length})` },
            ] as const).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTypeFilter(value)}
                className={`h-6 px-3 rounded-md text-[10px] font-medium transition-colors ${
                  typeFilter === value
                    ? "bg-white text-[#1C2B4A] shadow-sm"
                    : "text-[#7A7265] hover:text-[#1C2B4A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          {tagOptions.length > 0 && (
            <div className="w-px h-4 bg-[#E5E0D8] shrink-0" />
          )}

          {/* Tag pills */}
          {tagOptions.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`h-6 px-2.5 rounded-full text-[10px] font-medium border transition-colors ${
                  selectedTag === "all"
                    ? "bg-[#1C2B4A] text-white border-[#1C2B4A]"
                    : "bg-white text-[#7A7265] border-[#E5E0D8] hover:border-[#C9A84C]/50"
                }`}
              >
                All tags
              </button>
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`h-6 px-2.5 rounded-full text-[10px] font-medium border capitalize transition-colors ${
                    selectedTag === tag
                      ? "bg-[#EEF3FB] text-[#385C97] border-[#CFE0FF]"
                      : "bg-white text-[#7A7265] border-[#E5E0D8] hover:border-[#C9A84C]/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[#7A7265] text-center py-12 select-none">
            No attachments match the current filters.
          </p>
        ) : (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([operatorName, atts]) => (
              <section key={operatorName}>
                {/* Operator header */}
                <div className="flex items-center gap-2 mb-3 select-none">
                  <p className="text-xs font-semibold text-[#1C2B4A]">
                    {operatorName}
                  </p>
                  <div className="flex-1 h-px bg-[#E5E0D8]" />
                  <Link
                    href={`/trips/${tripId}/thread/${atts[0].threadId}`}
                    className="text-[10px] text-[#7A7265] hover:text-[#C9A84C] transition-colors"
                  >
                    View thread →
                  </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {atts.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setLightbox(att)}
                      className="group text-left bg-white rounded-xl ring-1 ring-[#E5E0D8] overflow-hidden hover:shadow-md hover:ring-[#C9A84C]/40 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="h-32 bg-[#F0EDE8] overflow-hidden relative">
                        {att.type === "image" && att.previewUrl ? (
                          // biome-ignore lint/a11y/useAltText: gallery thumbnail
                          <img
                            src={att.previewUrl}
                            alt={att.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center">
                              <FileText className="size-5 text-red-500" />
                            </div>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-red-400">
                              PDF
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[#1C2B4A]/0 group-hover:bg-[#1C2B4A]/10 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-[#1C2B4A]/70 px-2 py-1 rounded-md select-none">
                            Preview
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="px-3 py-2.5 select-none">
                        <p className="text-xs font-medium text-[#1C2B4A] truncate leading-snug">
                          {att.name}
                        </p>
                        {att.tags && att.tags.length > 0 && (
                          <div className="mt-1 flex items-center gap-1 flex-wrap">
                            {att.tags.slice(0, 2).map((tag) => (
                              <span
                                key={`${att.id}-${tag}`}
                                className="inline-flex text-[9px] px-1.5 py-0.5 rounded-full border bg-[#F8F7F4] text-[#7A7265] border-[#E5E0D8] capitalize"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-[#7A7265]">{att.size}</span>
                          <span className="text-[10px] text-[#7A7265]">{att.messageTimestamp}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
