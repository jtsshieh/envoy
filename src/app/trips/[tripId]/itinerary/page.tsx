import { notFound } from "next/navigation";
import { getTripById } from "@/lib/data";
import { ItineraryTimeline } from "./itinerary-timeline";

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-[#1C2B4A]">Itinerary</h3>
          <p className="text-xs text-[#7A7265] mt-0.5">
            {trip.travelDates} · {trip.itinerary.length} segments
          </p>
        </div>
        <ItineraryTimeline segments={trip.itinerary} tripId={tripId} />
      </div>
    </div>
  );
}
