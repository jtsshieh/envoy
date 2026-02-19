import Link from "next/link";
import { trips } from "@/lib/data";
import {
  Mail,
  MessageCircle,
  Phone,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Plane,
  Train,
} from "lucide-react";

function channelIcon(channel: string) {
  switch (channel) {
    case "email":
      return <Mail className="size-3.5 shrink-0 text-blue-500" />;
    case "whatsapp":
      return <MessageCircle className="size-3.5 shrink-0 text-green-500" />;
    case "sms":
      return <MessageSquare className="size-3.5 shrink-0 text-purple-500" />;
    case "phone":
      return <Phone className="size-3.5 shrink-0 text-amber-500" />;
    default:
      return <MessageCircle className="size-3.5 shrink-0 text-[#7A7265]" />;
  }
}

export default function DashboardPage() {
  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalUnread = trips.reduce(
    (s, t) => s + t.threads.reduce((ts, th) => ts + th.unreadCount, 0),
    0
  );
  const totalAwaiting = trips.reduce((s, t) => s + t.awaitingResponse, 0);
  const totalDrafts = trips.reduce((s, t) => s + t.draftsForReview, 0);
  const totalTravelers = trips.reduce((s, t) => s + t.travelers.length, 0);

  // ── Needs Attention ──────────────────────────────────────────────────────────
  type AttentionItem = {
    tripId: string;
    tripDestination: string;
    threadId: string;
    operatorName: string;
    channel: string;
    preview: string;
    time: string;
    status: "unread" | "draft";
  };

  const attentionByTrip: { trip: (typeof trips)[number]; items: AttentionItem[] }[] = [];

  for (const trip of trips) {
    const items: AttentionItem[] = [];
    for (const thread of trip.threads) {
      if (thread.unread || thread.pendingDraft) {
        items.push({
          tripId: trip.id,
          tripDestination: trip.destination,
          threadId: thread.id,
          operatorName: thread.operatorName,
          channel: thread.channel,
          preview: thread.lastMessagePreview,
          time: thread.lastMessageTime,
          status: thread.pendingDraft ? "draft" : "unread",
        });
      }
    }
    if (items.length > 0) {
      attentionByTrip.push({ trip, items });
    }
  }

  const totalAttention = attentionByTrip.reduce((s, g) => s + g.items.length, 0);

  // ── Upcoming Departures ───────────────────────────────────────────────────────
  type Departure = {
    tripId: string;
    destination: string;
    clientName: string;
    title: string;
    startDate: string;
    type: "flight" | "train";
  };

  const allDepartures: Departure[] = [];
  for (const trip of trips) {
    for (const seg of trip.itinerary) {
      if (seg.type === "flight" || seg.type === "train") {
        allDepartures.push({
          tripId: trip.id,
          destination: trip.destination,
          clientName: trip.clientName,
          title: seg.title,
          startDate: seg.startDate,
          type: seg.type,
        });
      }
    }
  }

  // Sort by startDate string (works for "Mar 8, 2025" style — lexicographic on month abbrev is approximate;
  // use Date parse for correctness)
  allDepartures.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const upcomingDepartures = allDepartures.slice(0, 4);

  const today = new Date();
  function daysUntil(dateStr: string) {
    const d = new Date(dateStr);
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white">
        <h1 className="text-xl font-semibold text-[#1C2B4A]">Dashboard</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          Good morning, Justin. Here&apos;s your overview for today.
        </p>
      </div>

      <div className="px-8 py-8">
        {/* ── Stat bar ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Active Trips
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">{trips.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Unread Messages
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">{totalUnread}</p>
          </div>
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Awaiting Response
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">{totalAwaiting}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 ring-1 ring-amber-200">
            <p className="text-xs font-medium text-[#8B6914] uppercase tracking-wide">
              Drafts for Review
            </p>
            <p className="text-3xl font-bold text-[#8B6914] mt-1">{totalDrafts}</p>
          </div>
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Total Travelers
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">{totalTravelers}</p>
          </div>
        </div>

        {/* ── Two-column body ───────────────────────────────────────────────── */}
        <div className="flex gap-6 items-start">
          {/* Left — Needs Attention (~60%) */}
          <div className="flex-[3] min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-[#1C2B4A]">Needs Attention</h2>
              {totalAttention > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-[10px] font-bold text-white bg-[#C9A84C] rounded-full">
                  {totalAttention}
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
              {attentionByTrip.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <CheckCircle2 className="size-8 text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-700">All caught up</p>
                  <p className="text-xs text-[#7A7265]">No unread messages or pending drafts</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8]">
                  {attentionByTrip.map(({ trip, items }) => (
                    <div key={trip.id}>
                      {/* Trip label */}
                      <div className="px-5 py-2 bg-[#F8F7F4]">
                        <span className="text-[10px] font-semibold text-[#7A7265] uppercase tracking-wider">
                          {trip.destination} · {trip.clientName}
                        </span>
                      </div>
                      {items.map((item) => (
                        <Link
                          key={item.threadId}
                          href={`/trips/${item.tripId}/thread/${item.threadId}`}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group"
                        >
                          {/* Channel icon */}
                          <div className="size-7 rounded-lg bg-[#F0EDE8] flex items-center justify-center shrink-0">
                            {channelIcon(item.channel)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[#1C2B4A] truncate">
                                {item.operatorName}
                              </p>
                              <span
                                className={`shrink-0 inline-flex items-center h-4 px-1.5 text-[10px] font-medium rounded-full ${
                                  item.status === "draft"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {item.status === "draft" ? "Draft pending" : "Unread"}
                              </span>
                            </div>
                            <p className="text-xs text-[#7A7265] truncate mt-0.5">
                              {item.preview}
                            </p>
                          </div>

                          {/* Time + chevron */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] text-[#7A7265]">{item.time}</span>
                            <ChevronRight className="size-3.5 text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column (~40%) */}
          <div className="flex-[2] min-w-0 space-y-5">
            {/* Upcoming Departures */}
            <div>
              <h2 className="text-sm font-semibold text-[#1C2B4A] mb-3">
                Upcoming Departures
              </h2>
              <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
                {upcomingDepartures.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-xs text-[#7A7265]">No upcoming flights or trains</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E0D8]">
                    {upcomingDepartures.map((dep, i) => {
                      const days = daysUntil(dep.startDate);
                      return (
                        <Link
                          key={`${dep.tripId}-${i}`}
                          href={`/trips/${dep.tripId}`}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors group"
                        >
                          {/* Date badge */}
                          <div className="size-10 rounded-xl bg-[#F0EDE8] flex flex-col items-center justify-center shrink-0">
                            {dep.type === "flight" ? (
                              <Plane className="size-4 text-[#1C2B4A]" />
                            ) : (
                              <Train className="size-4 text-[#1C2B4A]" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1C2B4A] truncate">
                              {dep.destination}
                            </p>
                            <p className="text-xs text-[#7A7265] truncate">
                              {dep.clientName} · {dep.startDate}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <span
                              className={`text-xs font-semibold ${
                                days < 0
                                  ? "text-[#7A7265]"
                                  : days <= 7
                                  ? "text-red-600"
                                  : days <= 30
                                  ? "text-amber-600"
                                  : "text-[#1C2B4A]"
                              }`}
                            >
                              {days < 0
                                ? "Departed"
                                : days === 0
                                ? "Today"
                                : `${days}d`}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Active Trips Quick Links */}
            <div>
              <h2 className="text-sm font-semibold text-[#1C2B4A] mb-3">
                Active Trips
              </h2>
              <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
                <div className="divide-y divide-[#E5E0D8]">
                  {trips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#F8F7F4] transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C2B4A] truncate">
                          {trip.destination}
                        </p>
                        <p className="text-xs text-[#7A7265] truncate">
                          {trip.clientName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#7A7265]">
                          {trip.threads.length} threads
                        </span>
                        <ChevronRight className="size-3.5 text-[#C9A84C]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
