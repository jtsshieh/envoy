"use client";

import { useState } from "react";
import Link from "next/link";
import { type AttachmentWithContext } from "@/lib/data";
import { AttachmentLightbox } from "./attachment-lightbox";
import { FileText, Image, Paperclip } from "lucide-react";

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
  const [filter, setFilter] = useState<"all" | "image" | "pdf">("all");

  const filtered =
    filter === "all" ? attachments : attachments.filter((a) => a.type === filter);

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
        {/* Summary + filter bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#1C2B4A] flex items-center justify-center">
              <Paperclip className="size-4 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C2B4A]">
                {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[10px] text-[#7A7265]">
                {images.length} image{images.length !== 1 ? "s" : ""} · {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-[#F0EDE8] rounded-lg p-1">
            {(["all", "image", "pdf"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`h-6 px-3 rounded-md text-[10px] font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-white text-[#1C2B4A] shadow-sm"
                    : "text-[#7A7265] hover:text-[#1C2B4A]"
                }`}
              >
                {f === "all" ? `All (${attachments.length})` : f === "image" ? `Images (${images.length})` : `PDFs (${pdfs.length})`}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[#7A7265] text-center py-12">
            No {filter}s in this trip.
          </p>
        ) : (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([operatorName, atts]) => (
              <section key={operatorName}>
                {/* Operator header */}
                <div className="flex items-center gap-2 mb-3">
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
                      {/* Thumbnail / icon area */}
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
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[#1C2B4A]/0 group-hover:bg-[#1C2B4A]/10 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-[#1C2B4A]/70 px-2 py-1 rounded-md">
                            Preview
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="px-3 py-2.5">
                        <p className="text-xs font-medium text-[#1C2B4A] truncate leading-snug">
                          {att.name}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-[#7A7265]">
                            {att.size}
                          </span>
                          <span className="text-[10px] text-[#7A7265]">
                            {att.messageTimestamp}
                          </span>
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
