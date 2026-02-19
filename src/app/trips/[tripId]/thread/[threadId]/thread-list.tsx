"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Channel, type Trip, type Thread, type ThreadStatus } from "@/lib/data";
import { ChannelIcon } from "./channel-badge";
import { useReadContext } from "@/app/_read-context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Mail, MessageCircle, MessageSquareText, Phone, Plus, Sparkles } from "lucide-react";

type LocalThread = Thread & { isLocalOnly?: boolean };

const STATUS_LABEL: Record<ThreadStatus, string> = {
  active: "Active",
  awaiting_response: "Awaiting",
  confirmed: "Confirmed",
  closed: "Closed",
};

const STATUS_BAR: Record<ThreadStatus, string> = {
  active: "bg-blue-400",
  awaiting_response: "bg-amber-400",
  confirmed: "bg-emerald-400",
  closed: "bg-[#A8A099]",
};

const PROVIDERS: {
  value: Channel;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    value: "email",
    label: "Email",
    icon: Mail,
    activeClass: "bg-sky-100 text-sky-700 border-sky-300",
    idleClass: "bg-white text-sky-700/70 border-sky-200/70",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    activeClass: "bg-emerald-100 text-emerald-700 border-emerald-300",
    idleClass: "bg-white text-emerald-700/70 border-emerald-200/70",
  },
  {
    value: "sms",
    label: "SMS",
    icon: MessageSquareText,
    activeClass: "bg-indigo-100 text-indigo-700 border-indigo-300",
    idleClass: "bg-white text-indigo-700/70 border-indigo-200/70",
  },
  {
    value: "phone",
    label: "Call",
    icon: Phone,
    activeClass: "bg-amber-100 text-amber-700 border-amber-300",
    idleClass: "bg-white text-amber-700/70 border-amber-200/70",
  },
];

const STATUS_FILTER_OPTIONS: { value: ThreadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "awaiting_response", label: "Awaiting" },
  { value: "confirmed", label: "Confirmed" },
  { value: "closed", label: "Closed" },
];

function starterMessage(channel: Channel, name: string, contact: string) {
  if (channel === "phone") return `Call setup created for ${name}. Contact: ${contact}`;
  if (channel === "email") return `Thread created for ${name}. Email: ${contact}`;
  if (channel === "sms") return `SMS thread created for ${name}. Number: ${contact}`;
  return `WhatsApp thread created for ${name}. Number: ${contact}`;
}

export function ThreadList({
  trip,
}: {
  trip: Trip;
  activeThreadId?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { readThreadIds } = useReadContext();

  const [threads, setThreads] = useState<LocalThread[]>(trip.threads);
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<Channel>("email");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [successLabel, setSuccessLabel] = useState<string | null>(null);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<ThreadStatus | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const contactLabel = provider === "email" ? "Email address" : "Phone number";

  function resetForm() {
    setProvider("email");
    setName("");
    setContact("");
  }

  function submit() {
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    if (!trimmedName || !trimmedContact) return;

    const providerLabel = PROVIDERS.find((p) => p.value === provider)?.label ?? provider;

    const id = `local-${Date.now()}`;
    const newThread: LocalThread = {
      id,
      operatorName: trimmedName,
      contact: trimmedContact,
      channel: provider,
      lastMessagePreview: starterMessage(provider, trimmedName, trimmedContact),
      lastMessageTime: "Just now",
      unread: false,
      unreadCount: 0,
      pendingDraft: false,
      status: "active",
      isLocalOnly: true,
      messages: [
        {
          id: `${id}-1`,
          role: "outbound",
          sender: "You",
          timestamp: "Just now",
          body: starterMessage(provider, trimmedName, trimmedContact),
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setSuccessLabel(`Created ${providerLabel} thread for ${trimmedName}.`);
    setOpen(false);
    resetForm();
    router.push(`/trips/${trip.id}/thread/${id}`);
  }

  const visibleThreads = statusFilter === "all"
    ? threads
    : threads.filter((t) => t.status === statusFilter);

  const currentFilterLabel = STATUS_FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All";

  return (
    <div className="flex flex-col flex-1 min-h-0 select-none">
      {/* Header — matches thread header height */}
      <div className="px-4 py-4 border-b border-[#E5E0D8] bg-white flex items-center justify-between gap-2 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
          Operator Threads
        </p>

        <div className="flex items-center gap-1.5">
          {/* Status filter dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#E5E0D8] text-[10px] text-[#7A7265] hover:text-[#1C2B4A] hover:border-[#C9A84C]/50 transition-colors bg-white"
            >
              {currentFilterLabel}
              <ChevronDown className="size-3" />
            </button>
            {filterOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#E5E0D8] py-1 z-20"
                onMouseLeave={() => setFilterOpen(false)}
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[#F8F7F4] ${
                      opt.value === statusFilter ? "font-semibold text-[#1C2B4A]" : "text-[#7A7265]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            className="h-7 px-2.5 text-xs bg-[#1C2B4A] text-white hover:bg-[#243459]"
            onClick={() => {
              setSuccessLabel(null);
              setOpen(true);
            }}
          >
            <Plus className="size-3" />
            New
          </Button>
        </div>
      </div>

      {successLabel && (
        <p className="text-[10px] px-4 py-1.5 text-emerald-700 bg-emerald-50 border-b border-emerald-100">
          {successLabel}
        </p>
      )}

      <div className="flex-1 overflow-y-auto">
        {visibleThreads.length === 0 && (
          <p className="text-xs text-[#7A7265] text-center py-8 px-4">
            No {statusFilter === "all" ? "" : STATUS_LABEL[statusFilter as ThreadStatus].toLowerCase() + " "}threads.
          </p>
        )}
        {visibleThreads.map((thread) => {
          const selected = pathname === `/trips/${trip.id}/thread/${thread.id}`;
          const isUnread = thread.unreadCount > 0 && !readThreadIds.has(thread.id);
          const card = (
            <div className="flex items-stretch gap-0">
              {/* Slim status bar */}
              <div
                className={`w-0.5 shrink-0 rounded-full my-2 ml-3 ${STATUS_BAR[thread.status]}`}
                title={STATUS_LABEL[thread.status]}
              />
              <div className="flex items-start gap-2.5 px-3 py-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  <ChannelIcon channel={thread.channel} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${isUnread ? "font-semibold text-[#1C2B4A]" : "font-medium text-[#1C2B4A]"}`}>
                      {thread.operatorName}
                    </span>
                    <span className={`text-[10px] shrink-0 ${isUnread ? "font-semibold text-[#1C2B4A]" : "text-[#7A7265]"}`}>
                      {thread.lastMessageTime}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${isUnread ? "text-[#4F4A40] font-medium" : "text-[#7A7265]"}`}>
                    {thread.lastMessagePreview}
                  </p>
                  {thread.contact && <p className="text-[10px] text-[#A09380] mt-0.5">{thread.contact}</p>}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {thread.pendingDraft && (
                      <span className="text-[10px] text-[#8B6914] font-medium flex items-center gap-1">
                        <Sparkles className="size-2.5" />
                        Draft
                      </span>
                    )}
                    {thread.isLocalOnly && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#EEF3FB] text-[#385C97] border border-[#D3E0F5]">
                        Local only
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

          if (thread.isLocalOnly) {
            return (
              <div
                key={thread.id}
                className={`border-b border-[#E5E0D8] transition-colors ${
                  selected ? "bg-[#F0EDE8]" : "bg-white"
                }`}
              >
                {card}
              </div>
            );
          }

          return (
            <Link
              key={thread.id}
              href={`/trips/${trip.id}/thread/${thread.id}`}
              className={`block w-full text-left border-b border-[#E5E0D8] transition-colors ${
                selected ? "bg-[#F0EDE8]" : "bg-white hover:bg-[#FAFAF8]"
              }`}
            >
              {card}
            </Link>
          );
        })}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="!w-[min(760px,94vw)] !max-w-[min(760px,94vw)] p-0 overflow-hidden">
          <AlertDialogHeader className="px-5 pt-5 pb-3 border-b border-[#E5E0D8] text-left items-start">
            <AlertDialogTitle className="text-sm font-semibold text-[#1C2B4A]">Thread Setup</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new thread by selecting provider and contact details.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-12 space-y-3">
              <div>
                <p className="text-xs font-medium text-[#1C2B4A] mb-1.5">Provider</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROVIDERS.map((p) => {
                    const Icon = p.icon;
                    const active = provider === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setProvider(p.value)}
                        className={`h-10 px-3 rounded-lg border text-xs flex items-center justify-center gap-2 transition-colors ${
                          active ? p.activeClass : p.idleClass
                        }`}
                      >
                        <Icon className="size-3.5" />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="thread-name" className="block text-xs font-medium text-[#1C2B4A] mb-1">
                    Name
                  </label>
                  <input
                    id="thread-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Emirates Service Desk"
                    className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="thread-contact" className="block text-xs font-medium text-[#1C2B4A] mb-1">
                    {contactLabel}
                  </label>
                  <input
                    id="thread-contact"
                    type={provider === "email" ? "email" : "tel"}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={provider === "email" ? "operator@company.com" : "+1 415 555 0199"}
                    className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="px-5 py-4 border-t border-[#E5E0D8]">
            <AlertDialogCancel className="h-8 px-3 border-[#E5E0D8] text-[#7A7265]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 px-3 bg-[#1C2B4A] text-white hover:bg-[#243459]"
              onClick={submit}
              disabled={!name.trim() || !contact.trim()}
            >
              Create Thread
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
