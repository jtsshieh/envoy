import { notFound } from "next/navigation";
import { getTripById } from "@/lib/data";
import { TravelerManager } from "./traveler-manager";

export default async function TravelersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  return <TravelerManager travelers={trip.travelers} tripId={tripId} />;
}
