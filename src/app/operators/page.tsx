import Link from "next/link";
import { getUniqueOperators } from "@/lib/data";
import { Mail, MessageCircle, Phone, ExternalLink } from "lucide-react";

function ChannelPill({ channel }: { channel: "email" | "whatsapp" | "phone" }) {
  if (channel === "email") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded-md">
        <Mail className="size-2.5" />
        Email
      </span>
    );
  }
  if (channel === "whatsapp") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md">
        <MessageCircle className="size-2.5" />
        WhatsApp
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md">
      <Phone className="size-2.5" />
      Phone
    </span>
  );
}

export default function OperatorsPage() {
  const operators = getUniqueOperators();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white shrink-0">
        <h1 className="text-xl font-semibold text-[#1C2B4A]">Operators</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          {operators.length} operators across all trips
        </p>
      </div>

      {/* Operator cards */}
      <div className="px-8 py-6 grid grid-cols-1 gap-3 max-w-4xl">
        {operators.map((op) => (
          <div
            key={op.name}
            className="bg-white rounded-2xl border border-[#E5E0D8] px-5 py-4 hover:border-[#C9A84C]/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-semibold text-[#1C2B4A]">
                    {op.name}
                  </h3>
                  {op.channels.map((ch) => (
                    <ChannelPill key={ch} channel={ch} />
                  ))}
                </div>
                <p className="text-xs text-[#7A7265] mt-1">
                  {op.tripCount === 1
                    ? op.tripNames[0]
                    : `${op.tripCount} trips: ${op.tripNames.join(", ")}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-[#7A7265]">Last contacted</p>
                <p className="text-xs font-medium text-[#1C2B4A] mt-0.5">
                  {op.lastContactedTime}
                </p>
              </div>
            </div>

            {/* Thread links */}
            <div className="mt-3 pt-3 border-t border-[#E5E0D8] flex flex-wrap gap-1.5">
              {op.threadRefs.map((ref) => (
                <Link
                  key={`${ref.tripId}-${ref.threadId}`}
                  href={`/trips/${ref.tripId}/thread/${ref.threadId}`}
                  className="flex items-center gap-1 text-[10px] text-[#7A7265] bg-[#F8F7F4] hover:bg-[#F0EDE8] hover:text-[#1C2B4A] border border-[#E5E0D8] px-2 py-1 rounded-lg transition-colors"
                >
                  <ExternalLink className="size-2.5" />
                  {ref.tripName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
