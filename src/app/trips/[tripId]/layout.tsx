import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripById, getAttachmentsForTrip } from "@/lib/data";
import { ThreadList } from "./thread/[threadId]/thread-list";
import { TripLayoutClient } from "./trip-layout-client";
import { TripBodyClient } from "./trip-body-client";
import { Sparkles, Clock, ChevronRight } from "lucide-react";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const attachmentCount = getAttachmentsForTrip(tripId).length;
  const itineraryCount = trip.itinerary.length;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* Trip header */}
      <div className="px-6 pt-4 pb-0 bg-white border-b border-[#E5E0D8] shrink-0">
        <div className="flex items-center gap-4 pb-3">
          <Link
            href="/trips"
            className="text-[#7A7265] hover:text-[#1C2B4A] transition-colors p-1 rounded hover:bg-[#F0EDE8]"
          >
            <ChevronRight className="size-4 rotate-180" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-[#1C2B4A]">
                {trip.destination}
              </h2>
              {trip.draftsForReview > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8B6914] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="size-2.5" />
                  {trip.draftsForReview} draft for review
                </span>
              )}
              {trip.awaitingResponse > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#7A7265] bg-[#F0EDE8] px-2 py-0.5 rounded-full">
                  <Clock className="size-2.5" />
                  {trip.awaitingResponse} awaiting response
                </span>
              )}
            </div>
            <p className="text-xs text-[#7A7265] mt-0.5">
              {trip.clientName} · {trip.travelDates}
            </p>
          </div>
        </div>

        {/* Sub-nav tabs */}
        <TripLayoutClient
          tripId={tripId}
          attachmentCount={attachmentCount}
          itineraryCount={itineraryCount}
        />
      </div>

      {/* Body — two-panel for threads, full-width for attachments */}
      <TripBodyClient
        threadList={
          <div className="w-[280px] shrink-0 border-r border-[#E5E0D8] bg-white flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E0D8]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                Operator Threads
              </p>
            </div>
            <ThreadList trip={trip} />
          </div>
        }
      >
        {children}
      </TripBodyClient>
    </div>
  );
}
