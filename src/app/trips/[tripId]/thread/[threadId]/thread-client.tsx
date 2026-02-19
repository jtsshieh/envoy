"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { type Thread, type Message, type ThreadStatus } from "@/lib/data";
import { ChannelBadge } from "./channel-badge";
import { MessageBubble } from "./message-bubble";
import { ComposeBar } from "./compose-bar";
import { useReadContext } from "@/app/_read-context";
import { ChevronDown } from "lucide-react";

const STATUS_LABELS: Record<ThreadStatus, string> = {
  active: "Active",
  awaiting_response: "Awaiting Response",
  confirmed: "Confirmed",
  closed: "Closed",
};

const STATUS_COLORS: Record<ThreadStatus, string> = {
  active: "bg-blue-50 text-blue-700 border-blue-200",
  awaiting_response: "bg-amber-50 text-[#8B6914] border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-[#F0EDE8] text-[#7A7265] border-[#E5E0D8]",
};

// Canned AI draft responses per channel type
const AI_DRAFT_RESPONSES: Record<string, string> = {
  whatsapp: "Hi! Thanks for your quick reply. I'd like to confirm the details and proceed with the booking. Could you please send across the final pricing and any payment instructions?\n\nLooking forward to confirming this.",
  email: "Dear [Operator],\n\nThank you for your prompt response. I am pleased to confirm that we'd like to proceed as discussed.\n\nCould you please provide:\n• Confirmation documentation\n• Payment details and deposit requirements\n• Any pre-arrival information for my clients\n\nPlease don't hesitate to reach out should you need anything further.\n\nKind regards,\nEleanor Shaw\nConcierge Travel",
  phone: "Call notes: Spoke with operator. Confirmed details as discussed — awaiting written confirmation to follow. Will follow up if documentation not received within 24 hours.",
};

interface ThreadClientProps {
  thread: Thread;
  tripId: string;
}

export function ThreadClient({ thread: initialThread, tripId }: ThreadClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialThread.messages);
  const [status, setStatus] = useState<ThreadStatus>(initialThread.status);
  const [statusOpen, setStatusOpen] = useState(false);
  const [draftBody, setDraftBody] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const { markRead } = useReadContext();

  // Mark as read on mount
  useEffect(() => {
    markRead(initialThread.id);
  }, [initialThread.id, markRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close status dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    if (statusOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusOpen]);

  const handleSend = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleGenerateAiDraft = useCallback(() => {
    const loadingMsg: Message = {
      id: `ai-draft-${Date.now()}`,
      role: "draft",
      sender: "AI Draft",
      timestamp: "Just now",
      isAiDraft: true,
      body: "AI is drafting a response…",
    };
    setMessages((prev) => [...prev, loadingMsg]);

    const draftText = AI_DRAFT_RESPONSES[initialThread.channel] ?? AI_DRAFT_RESPONSES.email;
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id ? { ...m, body: draftText } : m
        )
      );
    }, 1500);
  }, [initialThread.channel]);

  const handleEditDraft = useCallback((body: string) => {
    setDraftBody(body);
  }, []);

  const nonDraftCount = messages.filter((m) => !m.isAiDraft).length;
  const pendingDraft = messages.some((m) => m.isAiDraft && m.role === "draft");

  return (
    <>
      {/* Thread header */}
      <div className="px-6 py-4 border-b border-[#E5E0D8] bg-white flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-[#1C2B4A]">
              {initialThread.operatorName}
            </h3>
            <ChannelBadge channel={initialThread.channel} />
          </div>
          <p className="text-[10px] text-[#7A7265] mt-0.5">
            {nonDraftCount} messages
            {pendingDraft && (
              <span className="ml-2 text-[#8B6914] font-medium">
                · 1 AI draft pending your review
              </span>
            )}
          </p>
        </div>

        {/* Status dropdown */}
        <div ref={statusRef} className="relative">
          <button
            type="button"
            onClick={() => setStatusOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${STATUS_COLORS[status]}`}
          >
            {STATUS_LABELS[status]}
            <ChevronDown className="size-3" />
          </button>
          {statusOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#E5E0D8] py-1 z-10">
              {(Object.keys(STATUS_LABELS) as ThreadStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setStatus(s);
                    setStatusOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[#F8F7F4] ${
                    s === status ? "font-semibold text-[#1C2B4A]" : "text-[#7A7265]"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-[#F8F7F4]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onEditDraft={handleEditDraft} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose bar */}
      <ComposeBar
        onSend={handleSend}
        onGenerateAiDraft={handleGenerateAiDraft}
        draftBody={draftBody}
        onDraftBodyConsumed={() => setDraftBody(undefined)}
      />
    </>
  );
}
