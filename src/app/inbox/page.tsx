import Link from "next/link";
import { getInboxItems } from "@/lib/data";
import { ChannelIcon } from "../trips/[tripId]/thread/[threadId]/channel-badge";

export default function InboxPage() {
  const items = getInboxItems();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white shrink-0 select-none">
        <h1 className="text-xl font-semibold text-[#1C2B4A]">Inbox</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          {items.length} unread thread{items.length !== 1 ? "s" : ""} across all trips
        </p>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {items.length === 0 ? (
          <p className="text-sm text-[#7A7265] select-none">No unread items.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={`${item.tripId}-${item.threadId}`}
                href={`/trips/${item.tripId}/thread/${item.threadId}`}
                className="block rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all select-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChannelIcon channel={item.channel} />
                      <p className="text-sm font-semibold text-[#1C2B4A] truncate">{item.operatorName}</p>
                    </div>
                    <p className="text-xs text-[#7A7265] mt-0.5">{item.tripDestination}</p>
                    <p className="text-xs text-[#4F4A40] mt-1 line-clamp-2">{item.preview}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-[#7A7265]">{item.lastMessageTime}</p>
                    <span className="mt-1 inline-flex min-w-5 h-5 px-1.5 rounded-full items-center justify-center text-[10px] font-bold bg-[#1C2B4A] text-white">
                      {item.unreadCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
