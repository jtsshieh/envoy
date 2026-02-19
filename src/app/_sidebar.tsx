"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trips } from "@/lib/data";
import {
  LayoutDashboard,
  Map,
  Users,
  Settings,
  Sparkles,
  Search,
} from "lucide-react";

// Compute total unread count across all trips
const totalUnread = trips.reduce(
  (sum, trip) =>
    sum + trip.threads.reduce((s, t) => s + (t.unreadCount ?? 0), 0),
  0
);

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Map, label: "Trips", href: "/trips", badge: totalUnread },
  { icon: Users, label: "Operators", href: "/operators" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  // Derive active trip from path: /trips/[tripId] or /trips/[tripId]/thread/[threadId]
  const tripMatch = pathname.match(/^\/trips\/([^/]+)/);
  const activeTripId = tripMatch ? tripMatch[1] : null;
  const isDashboard = pathname === "/";
  // "Trips" nav item is only active on the index page, not on individual trip pages
  const isTripsIndex = pathname === "/trips";

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen bg-[#1C2B4A] text-[#F8F7F4]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#2D3F63]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[#C9A84C] flex items-center justify-center">
            <Sparkles className="size-4 text-[#1C2B4A]" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            Concierge
          </span>
        </Link>
      </div>

      {/* Search trigger */}
      <div className="px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#4A6080] hover:text-[#A8B8D0] hover:bg-[#243459] transition-colors text-xs"
        >
          <Search className="size-3.5 shrink-0" />
          <span>Search…</span>
          <kbd className="ml-auto text-[10px] bg-[#243459] px-1.5 py-0.5 rounded text-[#4A6080]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href, badge }) => {
          const active =
            href === "/" ? isDashboard
            : href === "/trips" ? isTripsIndex
            : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#243459] text-white"
                  : "text-[#A8B8D0] hover:bg-[#243459] hover:text-white"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
              {badge != null && badge > 0 && (
                <span className="ml-auto bg-[#C9A84C] text-[#1C2B4A] text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 pb-2 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4A6080]">
            Active Trips
          </p>
        </div>

        {trips.map((trip) => {
          const tripUnread = trip.threads.reduce(
            (s, t) => s + (t.unreadCount ?? 0),
            0
          );
          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left transition-colors group ${
                activeTripId === trip.id
                  ? "bg-[#243459] text-white"
                  : "text-[#A8B8D0] hover:bg-[#243459] hover:text-white"
              }`}
            >
              <span className="leading-relaxed flex-1 min-w-0">
                <span className="block text-xs font-medium truncate">
                  {trip.destination}
                </span>
                <span className="block text-[10px] text-[#4A6080] group-hover:text-[#7A9ABF] truncate">
                  {trip.clientName}
                </span>
              </span>
              {tripUnread > 0 ? (
                <span className="mt-1 bg-[#C9A84C] text-[#1C2B4A] text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shrink-0">
                  {tripUnread}
                </span>
              ) : (trip.draftsForReview > 0 || trip.awaitingResponse > 0) ? (
                <span className="mt-1 size-1.5 rounded-full bg-[#C9A84C] shrink-0" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Advisor */}
      <div className="px-4 py-4 border-t border-[#2D3F63] flex items-center gap-3">
        <div className="size-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1C2B4A] font-semibold text-sm shrink-0">
          ES
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">
            Eleanor Shaw
          </p>
          <p className="text-[10px] text-[#4A6080] truncate">
            Senior Travel Advisor
          </p>
        </div>
      </div>
    </aside>
  );
}
