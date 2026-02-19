"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Trip, type ThreadStatus } from "@/lib/data";
import { ChannelIcon, ChannelBadge } from "./channel-badge";
import { useReadContext } from "@/app/_read-context";
import { Sparkles } from "lucide-react";

const STATUS_DOT: Record<ThreadStatus, string> = {
  active: "bg-blue-400",
  awaiting_response: "bg-[#C9A84C]",
  confirmed: "bg-emerald-400",
  closed: "bg-[#A8A099]",
};

const STATUS_LABEL: Record<ThreadStatus, string> = {
  active: "Active",
  awaiting_response: "Awaiting",
  confirmed: "Confirmed",
  closed: "Closed",
};

export function ThreadList({
  trip,
}: {
  trip: Trip;
  // kept for backwards compat with any existing call sites — ignored in favour of pathname
  activeThreadId?: string | null;
}) {
  const pathname = usePathname();
  const { readThreadIds } = useReadContext();

  return (
    <div className="flex-1 overflow-y-auto">
      {trip.threads.map((thread) => {
        const selected = pathname === `/trips/${trip.id}/thread/${thread.id}`;
        return (
          <Link
            key={thread.id}
            href={`/trips/${trip.id}/thread/${thread.id}`}
            className={`block w-full text-left px-4 py-3.5 border-b border-[#E5E0D8] transition-colors ${
              selected ? "bg-[#F0EDE8]" : "bg-white hover:bg-[#FAFAF8]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <ChannelIcon channel={thread.channel} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#1C2B4A] truncate">
                    {thread.operatorName}
                  </span>
                  <span className="text-[10px] text-[#7A7265] shrink-0">
                    {thread.lastMessageTime}
                  </span>
                </div>
                <p className="text-xs text-[#7A7265] mt-0.5 line-clamp-2 leading-relaxed">
                  {thread.lastMessagePreview}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <ChannelBadge channel={thread.channel} />
                  {/* Status chip */}
                  <span className="flex items-center gap-1 text-[10px] text-[#7A7265]">
                    <span className={`size-1.5 rounded-full ${STATUS_DOT[thread.status]}`} />
                    {STATUS_LABEL[thread.status]}
                  </span>
                  {/* Unread badge — hidden once thread has been opened */}
                  {thread.unreadCount > 0 && !readThreadIds.has(thread.id) && (
                    <span className="bg-[#1C2B4A] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center transition-all">
                      {thread.unreadCount}
                    </span>
                  )}
                  {thread.pendingDraft && (
                    <span className="text-[10px] text-[#8B6914] font-medium flex items-center gap-1">
                      <Sparkles className="size-2.5" />
                      Draft pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
