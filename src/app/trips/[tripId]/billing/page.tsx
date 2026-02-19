import { getTripById, getAttachmentsForTrip } from "@/lib/data";
import { notFound } from "next/navigation";
import { BillingManager } from "./billing-manager";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const allAttachments = getAttachmentsForTrip(tripId);
  const invoices = allAttachments.filter(
    (a) =>
      a.type === "pdf" &&
      (a.tags?.includes("invoice") ||
        a.tags?.includes("receipt") ||
        a.tags?.includes("confirmation") ||
        a.name.toLowerCase().includes("invoice") ||
        a.name.toLowerCase().includes("receipt")),
  );

  return (
    <BillingManager tripId={tripId} invoices={invoices} threads={trip.threads} />
  );
}
