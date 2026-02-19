"use client";

import { useState } from "react";
import Link from "next/link";
import { trips as allTrips } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";

// ── Create trip modal (mockup — no persistence) ───────────────────────────────

function CreateTripModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1C2B4A]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#E5E0D8]">
          <div>
            <h2 className="text-lg font-semibold text-[#1C2B4A]">
              New Trip
            </h2>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Create a new trip and start managing operator communications.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg text-[#7A7265] hover:bg-[#F0EDE8] hover:text-[#1C2B4A] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form
          className="px-7 py-6 space-y-5"
          onSubmit={(e) => { e.preventDefault(); onClose(); }}
        >
          {/* Client name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1C2B4A] flex items-center gap-1.5">
              <User className="size-3 text-[#7A7265]" />
              Client Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah & James Thornton"
              className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1C2B4A] flex items-center gap-1.5">
              <MapPin className="size-3 text-[#7A7265]" />
              Destination
            </label>
            <input
              type="text"
              placeholder="e.g. Peru & Bolivia"
              className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Travel dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#1C2B4A] flex items-center gap-1.5">
                <CalendarDays className="size-3 text-[#7A7265]" />
                Departure Date
              </label>
              <input
                type="date"
                className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#1C2B4A] flex items-center gap-1.5">
                <CalendarDays className="size-3 text-[#7A7265]" />
                Return Date
              </label>
              <input
                type="date"
                className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1C2B4A]">
              Notes
              <span className="ml-1.5 text-[#B8B09E] font-normal">optional</span>
            </label>
            <textarea
              rows={3}
              placeholder="Special requirements, client preferences, trip context…"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-4 border-[#E5E0D8] text-[#7A7265]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 bg-[#1C2B4A] text-white hover:bg-[#243459] gap-1.5"
            >
              <Plus className="size-3" />
              Create Trip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Trip row (table style) ────────────────────────────────────────────────────

function TripRow({ trip }: { trip: typeof allTrips[number] }) {
  const totalPending = trip.awaitingResponse + trip.draftsForReview;

  return (
    <Link href={`/trips/${trip.id}`} className="block group">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#E5E0D8] hover:bg-[#FAFAF8] transition-colors">
        {/* Status dot */}
        <div className="shrink-0 w-2 flex justify-center">
          {totalPending > 0 ? (
            <span className="size-2 rounded-full bg-[#C9A84C]" />
          ) : (
            <span className="size-2 rounded-full bg-emerald-400" />
          )}
        </div>

        {/* Destination + client */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1C2B4A] truncate">
            {trip.destination}
          </p>
          <p className="text-xs text-[#7A7265] truncate">{trip.clientName}</p>
        </div>

        {/* Dates */}
        <div className="w-40 shrink-0 flex items-center gap-1.5 text-xs text-[#7A7265]">
          <CalendarDays className="size-3.5 shrink-0" />
          {trip.travelDates}
        </div>

        {/* Threads */}
        <div className="w-24 shrink-0 text-xs text-[#7A7265]">
          {trip.threads.length} thread{trip.threads.length !== 1 ? "s" : ""}
        </div>

        {/* Status chips */}
        <div className="w-56 shrink-0 flex flex-wrap gap-1.5">
          {trip.draftsForReview > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#8B6914] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <Sparkles className="size-2.5" />
              {trip.draftsForReview} draft{trip.draftsForReview !== 1 ? "s" : ""} pending
            </span>
          )}
          {trip.awaitingResponse > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#7A7265] bg-[#F0EDE8] px-2 py-0.5 rounded-full">
              <Clock className="size-2.5" />
              {trip.awaitingResponse} awaiting
            </span>
          )}
          {totalPending === 0 && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Check className="size-2.5" />
              Current
            </span>
          )}
        </div>

        <ChevronRight className="size-4 text-[#C9A84C] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TripsPage() {
  const [showCreate, setShowCreate] = useState(false);

  const totalPending = allTrips.filter(
    (t) => t.awaitingResponse + t.draftsForReview > 0
  ).length;

  return (
    <>
      {showCreate && (
        <CreateTripModal onClose={() => setShowCreate(false)} />
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1C2B4A]">Trips</h1>
            <p className="text-sm text-[#7A7265] mt-1">
              {allTrips.length} active trip{allTrips.length !== 1 ? "s" : ""}
              {totalPending > 0 && (
                <span className="ml-2 text-[#8B6914]">
                  · {totalPending} requiring attention
                </span>
              )}
            </p>
          </div>
          <Button
            size="sm"
            className="h-8 px-4 bg-[#1C2B4A] text-white hover:bg-[#243459] gap-1.5 mb-0.5"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="size-3.5" />
            New Trip
          </Button>
        </div>

        {/* Summary cards */}
        <div className="px-10 py-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7265]">
              Active
            </p>
            <p className="text-2xl font-bold text-[#1C2B4A] mt-1">
              {allTrips.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7265]">
              Total Threads
            </p>
            <p className="text-2xl font-bold text-[#1C2B4A] mt-1">
              {allTrips.reduce((s, t) => s + t.threads.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 ring-1 ring-[#E5E0D8]">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7A7265]">
              Awaiting Response
            </p>
            <p className="text-2xl font-bold text-[#1C2B4A] mt-1">
              {allTrips.reduce((s, t) => s + t.awaitingResponse, 0)}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 ring-1 ring-amber-200">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B6914]">
              Drafts for Review
            </p>
            <p className="text-2xl font-bold text-[#8B6914] mt-1">
              {allTrips.reduce((s, t) => s + t.draftsForReview, 0)}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="px-10 pb-10">
          <div className="bg-white rounded-xl ring-1 ring-[#E5E0D8] overflow-hidden">
            {/* Table header */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-[#E5E0D8] bg-[#FAFAF8]">
              <div className="w-2 shrink-0" />
              <div className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                Trip
              </div>
              <div className="w-40 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                Dates
              </div>
              <div className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                Threads
              </div>
              <div className="w-56 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                Status
              </div>
              <div className="size-4 shrink-0" />
            </div>

            {allTrips.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
