"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trips } from "@/lib/data";
import { Search, Map, MessageSquare, FileText, X } from "lucide-react";

interface ResultItem {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  type: "trip" | "thread" | "message";
}

function buildIndex(): ResultItem[] {
  const items: ResultItem[] = [];
  for (const trip of trips) {
    items.push({
      id: `trip-${trip.id}`,
      label: trip.destination,
      sublabel: `${trip.clientName} · ${trip.travelDates}`,
      href: `/trips/${trip.id}`,
      type: "trip",
    });
    for (const thread of trip.threads) {
      items.push({
        id: `thread-${trip.id}-${thread.id}`,
        label: thread.operatorName,
        sublabel: `${trip.destination} · ${trip.clientName}`,
        href: `/trips/${trip.id}/thread/${thread.id}`,
        type: "thread",
      });
      for (const message of thread.messages) {
        if (message.messageType !== undefined || !message.body.trim()) continue;
        const truncated = message.body.length > 70 ? `${message.body.slice(0, 70)}…` : message.body;
        items.push({
          id: `message-${trip.id}-${thread.id}-${message.id}`,
          label: truncated,
          sublabel: `${thread.operatorName} · ${trip.destination}`,
          href: `/trips/${trip.id}/thread/${thread.id}`,
          type: "message",
        });
      }
    }
  }
  return items;
}

const ALL_ITEMS = buildIndex();

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hasQuery = query.trim().length > 0;

  const filtered = hasQuery
    ? ALL_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS.filter((i) => i.type !== "message").slice(0, 8);

  const trips_results = filtered.filter((i) => i.type === "trip");
  const thread_results = filtered.filter((i) => i.type === "thread");
  const messages_results = hasQuery ? filtered.filter((i) => i.type === "message") : [];

  const flatList = [...trips_results, ...thread_results, ...messages_results];

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const navigate = useCallback(
    (item: ResultItem) => {
      router.push(item.href);
      close();
    },
    [router, close]
  );

  // Global Cmd+K listener
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      if (flatList[cursor]) navigate(flatList[cursor]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E0D8] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E0D8]">
          <Search className="size-4 text-[#7A7265] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Search trips, operators, messages…"
            className="flex-1 text-sm text-[#1C2B4A] placeholder:text-[#A8A099] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[#7A7265] hover:text-[#1C2B4A] transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-[#A8A099] bg-[#F0EDE8] px-1.5 py-0.5 rounded">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-80 py-2">
          {flatList.length === 0 ? (
            <p className="text-center text-sm text-[#7A7265] py-8">No results found</p>
          ) : (
            <>
              {trips_results.length > 0 && (
                <ResultGroup
                  label="Trips"
                  items={trips_results}
                  cursor={cursor}
                  flatList={flatList}
                  onSelect={navigate}
                />
              )}
              {thread_results.length > 0 && (
                <ResultGroup
                  label="Threads"
                  items={thread_results}
                  cursor={cursor}
                  flatList={flatList}
                  onSelect={navigate}
                />
              )}
              {messages_results.length > 0 && (
                <ResultGroup
                  label="Messages"
                  items={messages_results}
                  cursor={cursor}
                  flatList={flatList}
                  onSelect={navigate}
                />
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[#E5E0D8] flex items-center gap-3 text-[10px] text-[#A8A099]">
          <span className="flex items-center gap-1"><kbd className="bg-[#F0EDE8] px-1 rounded">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-[#F0EDE8] px-1 rounded">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="bg-[#F0EDE8] px-1 rounded">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function ResultGroup({
  label,
  items,
  cursor,
  flatList,
  onSelect,
}: {
  label: string;
  items: ResultItem[];
  cursor: number;
  flatList: ResultItem[];
  onSelect: (item: ResultItem) => void;
}) {
  return (
    <div>
      <div className="px-4 py-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A8A099]">
          {label}
        </p>
      </div>
      {items.map((item) => {
        const flatIndex = flatList.indexOf(item);
        const active = flatIndex === cursor;
        return (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => {}}
            onClick={() => onSelect(item)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              active ? "bg-[#F0EDE8]" : "hover:bg-[#FAFAF8]"
            }`}
          >
            <div
              className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${
                item.type === "trip"
                  ? "bg-[#1C2B4A]/10"
                  : item.type === "thread"
                  ? "bg-amber-50"
                  : "bg-emerald-50"
              }`}
            >
              {item.type === "trip" ? (
                <Map className="size-3.5 text-[#1C2B4A]" />
              ) : item.type === "thread" ? (
                <MessageSquare className="size-3.5 text-[#8B6914]" />
              ) : (
                <FileText className="size-3.5 text-emerald-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C2B4A] truncate">
                {item.label}
              </p>
              <p className="text-[11px] text-[#7A7265] truncate">{item.sublabel}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
