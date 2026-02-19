import { notFound } from "next/navigation";
import { getTripById } from "@/lib/data";
import { ThreadClient } from "./thread-client";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ tripId: string; threadId: string }>;
}) {
  const { tripId, threadId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const thread = trip.threads.find((t) => t.id === threadId);
  if (!thread) notFound();

  return <ThreadClient thread={thread} tripId={tripId} />;
}
