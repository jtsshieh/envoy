import { notFound } from "next/navigation";
import { getTripById, getAttachmentsForTrip } from "@/lib/data";
import { AttachmentGallery } from "./attachment-gallery";

export default async function AttachmentsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const attachments = getAttachmentsForTrip(tripId);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F7F4]">
      {attachments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-10 py-20">
          <div className="size-12 rounded-full bg-[#F0EDE8] flex items-center justify-center mb-3">
            <span className="text-xl">📎</span>
          </div>
          <p className="text-sm font-medium text-[#1C2B4A]">No attachments yet</p>
          <p className="text-xs text-[#7A7265] mt-1">
            Attachments sent or received in operator threads will appear here.
          </p>
        </div>
      ) : (
        <AttachmentGallery attachments={attachments} tripId={tripId} />
      )}
    </div>
  );
}
