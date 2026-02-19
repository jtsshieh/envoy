"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trips } from "@/lib/data";
import {
  Inbox,
  LayoutDashboard,
  Map,
  Plug,
  Settings,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


// Compute total unread count across all trips
const totalUnread = trips.reduce(
  (sum, trip) =>
    sum + trip.threads.reduce((s, t) => s + (t.unreadCount ?? 0), 0),
  0
);

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Inbox, label: "Inbox", href: "/inbox", badge: totalUnread },
  { icon: Map, label: "Trips", href: "/trips", badge: totalUnread },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const tripMatch = pathname.match(/^\/trips\/([^/]+)/);
  const activeTripId = tripMatch ? tripMatch[1] : null;
  const isDashboard = pathname === "/";
  const isInbox = pathname === "/inbox";
  const isTripsIndex = pathname === "/trips";

  // Close profile popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <aside
      className={`flex flex-col shrink-0 h-screen bg-[#1C2B4A] text-[#F8F7F4] select-none transition-all duration-200 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Logo + collapse toggle */}
      <div className="px-3 pt-5 pb-4 border-b border-[#2D3F63] flex items-center justify-between gap-2">
        <Link href="/" className={`flex items-center gap-2.5 ${collapsed ? "justify-center w-full" : "flex-1 min-w-0"}`}>
          <div className="size-7 rounded-lg bg-[#C9A84C] flex items-center justify-center shrink-0">
            <Sparkles className="size-4 text-[#1C2B4A]" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight text-white truncate">
              Envoy
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="size-6 flex items-center justify-center rounded-md text-[#4A6080] hover:text-[#A8B8D0] hover:bg-[#243459] transition-colors shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        )}
      </div>

      {/* Search trigger */}
      {!collapsed && (
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
      )}
      {collapsed && (
        <div className="px-2 pt-3 pb-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center h-8 rounded-lg text-[#4A6080] hover:text-[#A8B8D0] hover:bg-[#243459] transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="size-3.5" />
          </button>
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
            className="w-full flex items-center justify-center h-8 rounded-lg text-[#4A6080] hover:text-[#A8B8D0] hover:bg-[#243459] transition-colors"
            title="Search (⌘K)"
          >
            <Search className="size-3.5" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href, badge }) => {
          const active =
            href === "/" ? isDashboard
            : href === "/inbox" ? isInbox
            : href === "/trips" ? isTripsIndex
            : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-[#243459] text-white"
                  : "text-[#A8B8D0] hover:bg-[#243459] hover:text-white"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && label}
              {!collapsed && badge != null && badge > 0 && (
                <span className="ml-auto bg-[#C9A84C] text-[#1C2B4A] text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
              {collapsed && badge != null && badge > 0 && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[#C9A84C]" />
              )}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4A6080]">
              Active Trips
            </p>
          </div>
        )}
        {collapsed && <div className="pt-3 pb-1 border-t border-[#2D3F63] mx-2" />}

        {trips.map((trip) => {
          const tripUnread = trip.threads.reduce(
            (s, t) => s + (t.unreadCount ?? 0),
            0
          );
          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              title={collapsed ? `${trip.destination} · ${trip.clientName}` : undefined}
              className={`w-full flex items-start gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                activeTripId === trip.id
                  ? "bg-[#243459] text-white"
                  : "text-[#A8B8D0] hover:bg-[#243459] hover:text-white"
              }`}
            >
              {collapsed ? (
                <span className="text-[10px] font-bold w-6 h-6 rounded-md bg-[#243459] flex items-center justify-center shrink-0 leading-none">
                  {trip.destination.slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <span className="leading-relaxed flex-1 min-w-0">
                  <span className="block text-xs font-medium truncate">
                    {trip.destination}
                  </span>
                  <span className={`block text-[10px] truncate ${activeTripId === trip.id ? "text-[#7A9ABF]" : "text-[#4A6080]"}`}>
                    {trip.clientName}
                  </span>
                </span>
              )}
              {!collapsed && (tripUnread > 0 ? (
                <span className="mt-1 bg-[#C9A84C] text-[#1C2B4A] text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shrink-0">
                  {tripUnread}
                </span>
              ) : (trip.draftsForReview > 0 || trip.awaitingResponse > 0) ? (
                <span className="mt-1 size-1.5 rounded-full bg-[#C9A84C] shrink-0" />
              ) : null)}
            </Link>
          );
        })}
      </nav>

      {/* Advisor + profile popup */}
      <div ref={profileRef} className="relative px-2 py-3 border-t border-[#2D3F63]">
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#243459] transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="size-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1C2B4A] font-semibold text-sm shrink-0">
            JS
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-white truncate">
                Justin Shieh
              </p>
              <p className="text-[10px] text-[#4A6080] truncate">
                Senior Travel Advisor
              </p>
            </div>
          )}
        </button>

        {/* Profile popup menu */}
        {profileOpen && (
          <div className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-[#E5E0D8] py-1 z-20 w-44 ${collapsed ? "left-2" : "left-2 right-2 w-auto"}`}>
            <div className="px-3 py-2 border-b border-[#F0EDE8]">
              <p className="text-xs font-semibold text-[#1C2B4A]">Justin Shieh</p>
              <p className="text-[10px] text-[#7A7265]">Senior Travel Advisor</p>
            </div>
            <Link
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1C2B4A] hover:bg-[#F8F7F4] transition-colors"
            >
              <Settings className="size-3.5 text-[#7A7265]" />
              Settings
            </Link>
            <Link
              href="/integrations"
              onClick={() => setProfileOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1C2B4A] hover:bg-[#F8F7F4] transition-colors"
            >
              <Plug className="size-3.5 text-[#7A7265]" />
              Integrations
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
