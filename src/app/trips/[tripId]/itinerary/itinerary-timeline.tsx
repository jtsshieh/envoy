"use client";

import Link from "next/link";
import { type ItinerarySegment, type ItinerarySegmentType } from "@/lib/data";
import { Plane, Train, Hotel, Activity, Car, ExternalLink } from "lucide-react";

const TYPE_CONFIG: Record<
  ItinerarySegmentType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  flight: { icon: Plane, color: "text-sky-700", bg: "bg-sky-50 border-sky-200", label: "Flight" },
  train: { icon: Train, color: "text-purple-700", bg: "bg-purple-50 border-purple-200", label: "Train" },
  hotel: { icon: Hotel, color: "text-[#8B6914]", bg: "bg-amber-50 border-amber-200", label: "Hotel" },
  activity: { icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", label: "Activity" },
  transfer: { icon: Car, color: "text-slate-600", bg: "bg-slate-50 border-slate-200", label: "Transfer" },
};

export function ItineraryTimeline({
  segments,
  tripId,
}: {
  segments: ItinerarySegment[];
  tripId: string;
}) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[23px] top-4 bottom-4 w-px bg-[#E5E0D8]" />

      <div className="space-y-3">
        {segments.map((seg) => {
          const config = TYPE_CONFIG[seg.type];
          const Icon = config.icon;

          return (
            <div key={seg.id} className="flex gap-4 relative">
              {/* Icon dot */}
              <div
                className={`size-[46px] shrink-0 rounded-xl border flex items-center justify-center z-10 ${config.bg}`}
              >
                <Icon className={`size-4.5 ${config.color}`} />
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-2xl border border-[#E5E0D8] px-4 py-3.5 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-[10px] text-[#7A7265]">·</span>
                      <span className="text-[10px] text-[#7A7265]">{seg.location}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#1C2B4A] mt-0.5">
                      {seg.title}
                    </h4>
                    <p className="text-xs text-[#7A7265] mt-0.5">{seg.subtitle}</p>
                    {seg.notes && (
                      <p className="text-xs text-[#7A7265] mt-1.5 bg-[#F8F7F4] rounded-lg px-2.5 py-1.5 border border-[#E5E0D8]">
                        {seg.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-[#1C2B4A]">{seg.startDate}</p>
                    {seg.endDate && (
                      <p className="text-[10px] text-[#7A7265] mt-0.5">→ {seg.endDate}</p>
                    )}
                    {seg.threadId && seg.operatorName && (
                      <Link
                        href={`/trips/${tripId}/thread/${seg.threadId}`}
                        className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[#7A7265] hover:text-[#1C2B4A] transition-colors"
                      >
                        <ExternalLink className="size-2.5" />
                        View thread
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
