"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Paperclip, CalendarDays } from "lucide-react";

export function TripLayoutClient({
  tripId,
  attachmentCount,
  itineraryCount,
}: {
  tripId: string;
  attachmentCount: number;
  itineraryCount: number;
}) {
  const pathname = usePathname();
  const isAttachments = pathname.startsWith(`/trips/${tripId}/attachments`);
  const isItinerary = pathname.startsWith(`/trips/${tripId}/itinerary`);
  const isThreads = !isAttachments && !isItinerary;

  return (
    <div className="flex items-center gap-1 -mb-px">
      <Link
        href={`/trips/${tripId}`}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
          isThreads
            ? "border-[#1C2B4A] text-[#1C2B4A]"
            : "border-transparent text-[#7A7265] hover:text-[#1C2B4A]"
        }`}
      >
        <MessageSquare className="size-3.5" />
        Threads
      </Link>
      <Link
        href={`/trips/${tripId}/attachments`}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
          isAttachments
            ? "border-[#1C2B4A] text-[#1C2B4A]"
            : "border-transparent text-[#7A7265] hover:text-[#1C2B4A]"
        }`}
      >
        <Paperclip className="size-3.5" />
        Attachments
        {attachmentCount > 0 && (
          <span
            className={`ml-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center ${
              isAttachments
                ? "bg-[#1C2B4A] text-white"
                : "bg-[#F0EDE8] text-[#7A7265]"
            }`}
          >
            {attachmentCount}
          </span>
        )}
      </Link>
      <Link
        href={`/trips/${tripId}/itinerary`}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
          isItinerary
            ? "border-[#1C2B4A] text-[#1C2B4A]"
            : "border-transparent text-[#7A7265] hover:text-[#1C2B4A]"
        }`}
      >
        <CalendarDays className="size-3.5" />
        Itinerary
        {itineraryCount > 0 && (
          <span
            className={`ml-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center ${
              isItinerary
                ? "bg-[#1C2B4A] text-white"
                : "bg-[#F0EDE8] text-[#7A7265]"
            }`}
          >
            {itineraryCount}
          </span>
        )}
      </Link>
    </div>
  );
}
