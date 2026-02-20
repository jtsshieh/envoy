"use client";

import { useRef, useState } from "react";
import { trips } from "@/lib/data";
import { Mail, MessageCircle, MessageSquareText, Phone, Sparkles, Download } from "lucide-react";
import type { Trip, ThreadStatus, Channel } from "@/lib/data";

function ChannelIconInline({ channel }: { channel: Channel }) {
  if (channel === "whatsapp")
    return <MessageCircle className="size-3.5" style={{ color: "#059669" }} />;
  if (channel === "sms")
    return <MessageSquareText className="size-3.5" style={{ color: "#4f46e5" }} />;
  if (channel === "email")
    return <Mail className="size-3.5" style={{ color: "#0284c7" }} />;
  return <Phone className="size-3.5" style={{ color: "#d97706" }} />;
}

const STATUS_BAR: Record<ThreadStatus, string> = {
  active: "#60a5fa",
  awaiting_response: "#fbbf24",
  confirmed: "#34d399",
  closed: "#A8A099",
};

const TRIP_OPTIONS: { id: string; label: string }[] = [
  { id: "tanzania-safari", label: "Tanzania Safari" },
  { id: "peru-bolivia", label: "Peru & Bolivia" },
  { id: "namibia-expedition", label: "Namibia Expedition" },
  { id: "socotra-expedition", label: "Socotra Expedition" },
];

export default function PresentationPage() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedTripId, setSelectedTripId] = useState("tanzania-safari");

  const trip = trips.find((t) => t.id === selectedTripId) as Trip;

  async function saveAsPng() {
    const el = panelRef.current;
    if (!el) return;

    // Temporarily remove scroll constraints so html2canvas sees full height
    const prev = { overflow: el.style.overflow, maxHeight: el.style.maxHeight };
    el.style.overflow = "visible";
    el.style.maxHeight = "none";

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });

    el.style.overflow = prev.overflow;
    el.style.maxHeight = prev.maxHeight;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "operator-threads.png";
    a.click();
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center py-10 px-4">
      {/* Toolbar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 gap-2">
        {/* Trip selector pills */}
        <div className="flex flex-wrap gap-1.5">
          {TRIP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedTripId(opt.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedTripId === opt.id
                  ? "bg-[#1C2B4A] text-white border-[#1C2B4A]"
                  : "bg-white text-[#7A7265] border-[#E5E0D8]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={saveAsPng}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2B4A] text-white text-xs font-medium shrink-0"
        >
          <Download className="size-3" />
          Save as PNG
        </button>
      </div>

      {/* Thread list panel — capture target */}
      <div
        ref={panelRef}
        className="w-80 bg-white border border-[#E5E0D8] overflow-y-auto max-h-[80vh]"
      >
        {/* Thread cards */}
        <div>
          {trip.threads.map((thread) => (
            <div
              key={thread.id}
              className="border-b border-[#E5E0D8] bg-white last:border-b-0"
            >
              <div className="flex items-stretch gap-0">
                {/* Slim status bar */}
                <div
                  className="w-0.5 shrink-0 rounded-full my-2 ml-3"
                  style={{ backgroundColor: STATUS_BAR[thread.status] }}
                />
                <div className="flex items-start gap-2.5 px-3 py-3 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    <ChannelIconInline channel={thread.channel} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm truncate ${
                          thread.unread
                            ? "font-semibold text-[#1C2B4A]"
                            : "font-medium text-[#1C2B4A]"
                        }`}
                      >
                        {thread.operatorName}
                      </span>
                      <span
                        className={`text-[10px] shrink-0 ${
                          thread.unread
                            ? "font-semibold text-[#1C2B4A]"
                            : "text-[#7A7265]"
                        }`}
                      >
                        {thread.lastMessageTime}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
                        thread.unread
                          ? "text-[#4F4A40] font-medium"
                          : "text-[#7A7265]"
                      }`}
                    >
                      {thread.lastMessagePreview}
                    </p>
                    {thread.contact && (
                      <p className="text-[10px] text-[#A09380] mt-0.5">
                        {thread.contact}
                      </p>
                    )}
                    {thread.pendingDraft && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#8B6914] font-medium flex items-center gap-1">
                          <Sparkles className="size-2.5" />
                          Draft
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
