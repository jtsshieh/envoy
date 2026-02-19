import { redirect, notFound } from "next/navigation";
import { getTripById } from "@/lib/data";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const defaultThread =
    trip.threads.find((t) => t.pendingDraft) ?? trip.threads[0];

  redirect(`/trips/${tripId}/thread/${defaultThread.id}`);
}
