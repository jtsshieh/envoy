"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Paperclip, Receipt, Users } from "lucide-react";

export function TripLayoutClient({
  tripId,
  attachmentCount,
  travelerCount,
  invoiceCount,
}: {
  tripId: string;
  attachmentCount: number;
  travelerCount: number;
  invoiceCount: number;
}) {
  const pathname = usePathname();
  const isAttachments = pathname.startsWith(`/trips/${tripId}/attachments`);
  const isTravelers = pathname.startsWith(`/trips/${tripId}/travelers`);
  const isBilling = pathname.startsWith(`/trips/${tripId}/billing`);
  const isThreads = !isAttachments && !isTravelers && !isBilling;

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
        href={`/trips/${tripId}/travelers`}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
          isTravelers
            ? "border-[#1C2B4A] text-[#1C2B4A]"
            : "border-transparent text-[#7A7265] hover:text-[#1C2B4A]"
        }`}
      >
        <Users className="size-3.5" />
        Travelers
        {travelerCount > 0 && (
          <span
            className={`ml-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center ${
              isTravelers
                ? "bg-[#1C2B4A] text-white"
                : "bg-[#F0EDE8] text-[#7A7265]"
            }`}
          >
            {travelerCount}
          </span>
        )}
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
        href={`/trips/${tripId}/billing`}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
          isBilling
            ? "border-[#1C2B4A] text-[#1C2B4A]"
            : "border-transparent text-[#7A7265] hover:text-[#1C2B4A]"
        }`}
      >
        <Receipt className="size-3.5" />
        Billing
        {invoiceCount > 0 && (
          <span
            className={`ml-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center ${
              isBilling
                ? "bg-[#1C2B4A] text-white"
                : "bg-[#F0EDE8] text-[#7A7265]"
            }`}
          >
            {invoiceCount}
          </span>
        )}
      </Link>
    </div>
  );
}
