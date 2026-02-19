import Link from "next/link";
import { trips } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronRight,
  Sparkles,
  Check,
  Clock,
  CalendarDays,
} from "lucide-react";

export default function DashboardPage() {
  const totalDrafts = trips.reduce((s, t) => s + t.draftsForReview, 0);
  const totalAwaiting = trips.reduce((s, t) => s + t.awaitingResponse, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-10 pt-9 pb-6 border-b border-[#E5E0D8] bg-white">
        <h1 className="text-2xl font-semibold text-[#1C2B4A]">Dashboard</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          Good morning, Eleanor. Here's your overview for today.
        </p>
      </div>

      <div className="px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Active Trips
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">
              {trips.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 ring-1 ring-[#E5E0D8]">
            <p className="text-xs font-medium text-[#7A7265] uppercase tracking-wide">
              Awaiting Response
            </p>
            <p className="text-3xl font-bold text-[#1C2B4A] mt-1">
              {totalAwaiting}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 ring-1 ring-amber-200">
            <p className="text-xs font-medium text-[#8B6914] uppercase tracking-wide">
              Drafts for Review
            </p>
            <p className="text-3xl font-bold text-[#8B6914] mt-1">
              {totalDrafts}
            </p>
          </div>
        </div>

        {/* Trip cards */}
        <h2 className="text-base font-semibold text-[#1C2B4A] mb-4">
          Active Trips
        </h2>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {trips.map((trip) => {
            const totalPending = trip.awaitingResponse + trip.draftsForReview;
            return (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow ring-1 ring-[#E5E0D8] bg-white rounded-xl h-full">
                  <CardHeader className="pb-0 pt-5 px-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#1C2B4A] leading-snug">
                          {trip.destination}
                        </h3>
                        <p className="text-sm text-[#7A7265] mt-0.5">
                          {trip.clientName}
                        </p>
                      </div>
                      {totalPending > 0 && (
                        <span className="size-2.5 rounded-full bg-[#C9A84C] mt-1 shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 px-5 pb-5">
                    <div className="flex items-center gap-1.5 text-[#7A7265] text-xs mb-4">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {trip.travelDates}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trip.awaitingResponse > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-[#7A7265] bg-[#F0EDE8] px-2.5 py-1 rounded-full">
                          <Clock className="size-3" />
                          {trip.awaitingResponse} awaiting response
                        </div>
                      )}
                      {trip.draftsForReview > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-[#8B6914] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Sparkles className="size-3" />
                          {trip.draftsForReview} draft pending review
                        </div>
                      )}
                      {totalPending === 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <Check className="size-3" />
                          All threads current
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                      <span className="text-xs text-[#7A7265]">
                        {trip.threads.length} operator threads
                      </span>
                      <ChevronRight className="size-4 text-[#C9A84C]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
