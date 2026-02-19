"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { type Thread, type Message, type ThreadStatus, type Traveler } from "@/lib/data";
import { ChannelIcon } from "./channel-badge";
import { MessageBubble } from "./message-bubble";
import { ComposeBar } from "./compose-bar";
import { useReadContext } from "@/app/_read-context";
import { Building2, ChevronDown, ChevronUp, NotebookPen, Pin, RefreshCw, Upload, X } from "lucide-react";

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
  sms: "Thanks for the quick update. Please confirm final pricing and payment steps so I can lock this in for the client.",
  email: "Dear [Operator],\n\nThank you for your prompt response. I am pleased to confirm that we'd like to proceed as discussed.\n\nCould you please provide:\n• Confirmation documentation\n• Payment details and deposit requirements\n• Any pre-arrival information for my clients\n\nPlease don't hesitate to reach out should you need anything further.\n\nKind regards,\nJustin Shieh\nEnvoy Travel",
  phone: "Call notes: Spoke with operator. Confirmed details as discussed — awaiting written confirmation to follow. Will follow up if documentation not received within 24 hours.",
};

interface ThreadClientProps {
  thread: Thread;
  tripId: string;
  travelers: Traveler[];
  tripNotes: string;
}

export function ThreadClient({ thread: initialThread, tripId, travelers, tripNotes }: ThreadClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialThread.messages);
  const [status, setStatus] = useState<ThreadStatus>(initialThread.status);
  const [statusOpen, setStatusOpen] = useState(false);
  const [draftBody, setDraftBody] = useState<string | undefined>(undefined);
  const [crmPanelOpen, setCrmPanelOpen] = useState(false);
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const [loggedToCrm, setLoggedToCrm] = useState(false);

  // Notes panel state
  const [notesText, setNotesText] = useState(tripNotes);
  const [notesSaved, setNotesSaved] = useState(true);
  const [crmSynced, setCrmSynced] = useState(false);
  const notesSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pin state
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Set<string>>(
    () => new Set(initialThread.messages.filter((m) => m.pinned).map((m) => m.id))
  );
  const [pinnedBannerExpanded, setPinnedBannerExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const statusRef = useRef<HTMLDivElement>(null);
  const { markRead, templates } = useReadContext();

  function scrollToMessage(messageId: string) {
    const el = messageRefs.current.get(messageId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Brief highlight flash
      el.classList.add("ring-2", "ring-[#C9A84C]", "ring-offset-2", "rounded-2xl");
      setTimeout(() => el.classList.remove("ring-2", "ring-[#C9A84C]", "ring-offset-2", "rounded-2xl"), 1200);
    }
  }

  // Auto-dismiss "logged to CRM" banner
  useEffect(() => {
    if (!loggedToCrm) return;
    const t = setTimeout(() => setLoggedToCrm(false), 2500);
    return () => clearTimeout(t);
  }, [loggedToCrm]);

  // Auto-dismiss CRM synced confirmation
  useEffect(() => {
    if (!crmSynced) return;
    const t = setTimeout(() => setCrmSynced(false), 2000);
    return () => clearTimeout(t);
  }, [crmSynced]);

  // Debounced notes save indicator
  function handleNotesChange(value: string) {
    setNotesText(value);
    setNotesSaved(false);
    if (notesSaveTimer.current) clearTimeout(notesSaveTimer.current);
    notesSaveTimer.current = setTimeout(() => setNotesSaved(true), 500);
  }

  function handleSyncToCrm() {
    setCrmSynced(true);
  }

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

  const handleTogglePin = useCallback((messageId: string) => {
    setPinnedMessageIds((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }, []);

  const handlePerformScheduledCall = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId || m.messageType !== "scheduled_call") return m;
        return {
          ...m,
          role: "inbound",
          sender: "AI Call Assistant",
          timestamp: "Just now",
          body: "Automated call completed. Expand to review transcript.",
          messageType: "call_transcript",
          unreadCall: true,
          transcriptTurns: [
            {
              id: `${m.id}-turn-1`,
              speaker: "AI Agent",
              role: "agent",
              body: "Opening call and confirming objective from generated prompt.",
            },
            {
              id: `${m.id}-turn-2`,
              speaker: initialThread.operatorName,
              role: "operator",
              body: "Operator confirms availability, operational timings, and named contact.",
            },
            {
              id: `${m.id}-turn-3`,
              speaker: "AI Agent",
              role: "agent",
              body: "Requested reconfirmation process, payment method, and cancellation cut-offs.",
            },
            {
              id: `${m.id}-turn-4`,
              speaker: initialThread.operatorName,
              role: "operator",
              body: "Provided final commitments and agreed to send written summary after call.",
            },
          ],
        };
      }),
    );
  }, [initialThread.operatorName]);

  const handleMarkCallRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, unreadCall: false } : m)),
    );
  }, []);

  const handleGenerateAiDraft = useCallback((opts?: { tone?: string; length?: string; customPrompt?: string; context?: string }) => {
    const loadingMsg: Message = {
      id: `ai-draft-${Date.now()}`,
      role: "draft",
      sender: "AI Draft",
      timestamp: "Just now",
      isAiDraft: true,
      body: "AI is drafting a response…",
    };
    setMessages((prev) => [...prev, loadingMsg]);

    let draftText = AI_DRAFT_RESPONSES[initialThread.channel] ?? AI_DRAFT_RESPONSES.email;

    if (opts?.customPrompt) {
      draftText = `[Draft based on: "${opts.customPrompt}"]\n\n${draftText}`;
    }
    if (opts?.tone === "friendly") {
      draftText = draftText.replace("Dear [Operator],", "Hi there!").replace("Kind regards,", "Best,");
    } else if (opts?.tone === "concise") {
      draftText = "Thank you for your response. Please confirm availability and send payment details.\n\nBest,\nJustin";
    } else if (opts?.tone === "formal") {
      draftText = draftText.replace("Dear [Operator],", "Dear Sir/Madam,").replace("Kind regards,", "Yours faithfully,");
    }
    if (opts?.length === "short") {
      draftText = draftText.split("\n")[0] + "\n\nBest,\nJustin";
    }

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
  const pinnedMessages = messages.filter((m) => pinnedMessageIds.has(m.id));

  return (
    <>
      {/* Thread header */}
      <div className="px-6 py-4 border-b border-[#E5E0D8] bg-white flex items-center justify-between shrink-0 select-none">
        <div>
          <div className="flex items-center gap-2">
            <ChannelIcon channel={initialThread.channel} />
            <h3 className="text-sm font-semibold text-[#1C2B4A]">
              {initialThread.operatorName}
            </h3>
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

        {/* Right-side controls */}
        <div className="flex items-center gap-2">
          {/* Notes panel toggle */}
          <button
            type="button"
            onClick={() => {
              setNotesPanelOpen((o) => !o);
              if (!notesPanelOpen) setCrmPanelOpen(false);
            }}
            className={`size-7 flex items-center justify-center rounded-lg border transition-colors ${
              notesPanelOpen
                ? "bg-[#1C2B4A] text-white border-[#1C2B4A]"
                : "text-[#7A7265] border-[#E5E0D8] hover:bg-[#F0EDE8] hover:text-[#1C2B4A]"
            }`}
            title="Trip notes"
          >
            <NotebookPen className="size-3.5" />
          </button>

          {/* CRM panel toggle */}
          <button
            type="button"
            onClick={() => {
              setCrmPanelOpen((o) => !o);
              if (!crmPanelOpen) setNotesPanelOpen(false);
            }}
            className={`size-7 flex items-center justify-center rounded-lg border transition-colors ${
              crmPanelOpen
                ? "bg-[#1C2B4A] text-white border-[#1C2B4A]"
                : "text-[#7A7265] border-[#E5E0D8] hover:bg-[#F0EDE8] hover:text-[#1C2B4A]"
            }`}
            title="CRM contact"
          >
            <Building2 className="size-3.5" />
          </button>

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
      </div>

      {/* "Logged to CRM" confirmation banner */}
      {loggedToCrm && (
        <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-xs text-emerald-700 font-medium select-none animate-in slide-in-from-top-1 duration-200">
          <Upload className="size-3" />
          Thread summary logged to CRM ✓
        </div>
      )}

      {/* Pinned messages banner */}
      {pinnedMessageIds.size > 0 && (
        <div className="bg-amber-50/60 border-b border-amber-200 select-none">
          <button
            type="button"
            className="w-full px-4 py-2 flex items-center gap-2 text-xs text-[#8B6914]"
            onClick={() => setPinnedBannerExpanded((e) => !e)}
          >
            <Pin className="size-3 fill-[#C9A84C] text-[#C9A84C] shrink-0" />
            {pinnedBannerExpanded ? (
              <span className="font-semibold flex-1 text-left">Pinned</span>
            ) : (
              <span className="flex-1 text-left font-medium">
                {pinnedMessageIds.size} pinned message{pinnedMessageIds.size > 1 ? "s" : ""}
              </span>
            )}
            {pinnedBannerExpanded ? (
              <ChevronUp className="size-3.5 shrink-0" />
            ) : (
              <ChevronDown className="size-3.5 shrink-0" />
            )}
          </button>
          {pinnedBannerExpanded && (
            <div className="border-t border-amber-200 divide-y divide-amber-100">
              {pinnedMessages.map((m) => (
                <div key={m.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => { scrollToMessage(m.id); setPinnedBannerExpanded(false); }}
                    className="flex-1 min-w-0 px-4 py-2 text-left hover:bg-amber-100/50 transition-colors"
                  >
                    <span className="text-[10px] font-medium text-[#8B6914]">{m.sender}</span>
                    <span className="text-[10px] text-[#7A7265] ml-1.5">
                      · &quot;{m.body.slice(0, 60)}{m.body.length > 60 ? "…" : ""}&quot;
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePin(m.id)}
                    className="size-5 flex items-center justify-center rounded text-[#A09380] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 mr-3"
                    title="Unpin"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main content — flex row to accommodate side panels */}
      <div className="flex flex-1 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-[#F8F7F4]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(msg.id, el);
                  else messageRefs.current.delete(msg.id);
                }}
              >
                <MessageBubble
                  message={msg}
                  onEditDraft={handleEditDraft}
                  onPerformScheduledCall={handlePerformScheduledCall}
                  onMarkCallRead={handleMarkCallRead}
                  onTogglePin={!msg.isAiDraft && msg.messageType !== "scheduled_call" && msg.messageType !== "call_transcript" ? handleTogglePin : undefined}
                  isPinned={pinnedMessageIds.has(msg.id)}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose bar */}
          <ComposeBar
            channel={initialThread.channel}
            operatorName={initialThread.operatorName}
            onSend={handleSend}
            onGenerateAiDraft={(opts) => handleGenerateAiDraft(opts)}
            draftBody={draftBody}
            onDraftBodyConsumed={() => setDraftBody(undefined)}
            travelers={travelers}
            templates={templates}
          />
        </div>

        {/* CRM Contact Sidebar Panel */}
        {crmPanelOpen && (
          <div className="w-64 shrink-0 border-l border-[#E5E0D8] bg-white flex flex-col">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-[#1C2B4A]" />
                <span className="text-xs font-semibold text-[#1C2B4A]">CRM</span>
              </div>
              <button
                type="button"
                onClick={() => setCrmPanelOpen(false)}
                className="size-5 flex items-center justify-center rounded text-[#A09380] hover:text-[#1C2B4A] transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Business identity */}
              <div className="px-4 py-3 border-b border-[#E5E0D8]">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="size-8 rounded-lg bg-[#F0EDE8] flex items-center justify-center shrink-0">
                    <Building2 className="size-4 text-[#1C2B4A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1C2B4A] truncate">{initialThread.operatorName}</p>
                    <p className="text-[10px] text-[#7A7265]">Vendor / Operator</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">CRM ID</span>
                    <span className="text-[#1C2B4A] font-medium">#1234</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">Deal stage</span>
                    <span className="text-emerald-700 font-medium">Active</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">Owner</span>
                    <span className="text-[#1C2B4A]">Justin Shieh</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">Last activity</span>
                    <span className="text-[#1C2B4A]">Feb 17, 2025</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">Contact</span>
                    <span className="text-[#1C2B4A] truncate max-w-[110px] text-right">Sofía Herrera</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7A7265]">Email</span>
                    <span className="text-[#1C2B4A] truncate max-w-[110px] text-right">reservations@operator.com</span>
                  </div>
                </div>
              </div>

              {/* Activity section */}
              <div className="px-4 py-3 border-b border-[#E5E0D8]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265] mb-2">Activity</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-[#1C2B4A]">Booking confirmed</p>
                      <p className="text-[10px] text-[#A09380]">Feb 17, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="size-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-[#1C2B4A]">Documents received</p>
                      <p className="text-[10px] text-[#A09380]">Feb 17, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="size-1.5 rounded-full bg-[#C9A84C] shrink-0 mt-1.5" />
                    <div>
                      <p className="text-[#1C2B4A]">Initial inquiry</p>
                      <p className="text-[10px] text-[#A09380]">Feb 14, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="px-4 py-3 border-t border-[#E5E0D8] space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => setLoggedToCrm(true)}
                className="w-full flex items-center justify-center gap-1.5 h-7 text-xs font-medium text-white bg-[#1C2B4A] hover:bg-[#243459] rounded-lg transition-colors"
              >
                <Upload className="size-3" />
                Sync to CRM
              </button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-full flex items-center justify-center gap-1.5 h-7 text-xs font-medium text-[#1C2B4A] border border-[#E5E0D8] hover:bg-[#F0EDE8] rounded-lg transition-colors"
              >
                Open in CRM →
              </a>
            </div>
          </div>
        )}

        {/* Notes Sidebar Panel */}
        {notesPanelOpen && (
          <div className="w-64 shrink-0 border-l border-[#E5E0D8] bg-white flex flex-col">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <NotebookPen className="size-4 text-[#1C2B4A]" />
                <span className="text-xs font-semibold text-[#1C2B4A]">Trip Notes</span>
              </div>
              <button
                type="button"
                onClick={() => setNotesPanelOpen(false)}
                className="size-5 flex items-center justify-center rounded text-[#A09380] hover:text-[#1C2B4A] transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Notes body */}
            <div className="flex-1 flex flex-col min-h-0 p-3 gap-2">
              <textarea
                value={notesText}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add trip notes…"
                className="flex-1 resize-none bg-[#F8F7F4] border border-[#E5E0D8] rounded-xl px-3 py-2.5 text-xs text-[#1C2B4A] placeholder:text-[#A8A099] focus:outline-none focus:ring-2 focus:ring-[#1C2B4A]/20 focus:border-[#1C2B4A]/40 transition-all leading-relaxed"
              />
            </div>

            {/* Panel footer */}
            <div className="px-3 pb-3 flex items-center justify-between gap-2 shrink-0">
              <span className={`text-[10px] ${notesSaved ? "text-[#A09380]" : "text-[#8B6914] font-medium"}`}>
                {notesSaved ? "Saved" : "Unsaved changes"}
              </span>
              <button
                type="button"
                onClick={handleSyncToCrm}
                className="flex items-center gap-1 h-6 px-2.5 text-[10px] font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 rounded-lg hover:bg-[#F0EDE8] transition-colors"
              >
                {crmSynced ? (
                  <>
                    <RefreshCw className="size-2.5" />
                    Synced ✓
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-2.5" />
                    Sync to CRM
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
