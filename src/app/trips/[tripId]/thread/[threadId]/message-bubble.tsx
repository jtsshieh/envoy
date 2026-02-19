"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/data";
import { Check, ChevronDown, Pencil, PhoneCall, Pin, Sparkles, X } from "lucide-react";
import { AttachmentChip } from "./attachment-chip";

interface MessageBubbleProps {
  message: Message;
  onEditDraft?: (body: string) => void;
  onPerformScheduledCall?: (messageId: string) => void;
  onMarkCallRead?: (messageId: string) => void;
  onTogglePin?: (id: string) => void;
  isPinned?: boolean;
}

export function MessageBubble({
  message,
  onEditDraft,
  onPerformScheduledCall,
  onMarkCallRead,
  onTogglePin,
  isPinned,
}: MessageBubbleProps) {
  const [approved, setApproved] = useState(false);
  const [discarded, setDiscarded] = useState(false);
  const [collapsed, setCollapsed] = useState(message.messageType === "call_transcript");

  if (discarded) return null;

  if (message.messageType === "scheduled_call") {
    return (
      <div className="flex justify-start select-none">
        <div className="max-w-[76%] w-full">
          <div className="text-[10px] text-[#7A7265] mb-1">{message.timestamp}</div>
          <div className="rounded-2xl border-2 border-dashed border-[#C9A84C] bg-amber-50/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B6914] mb-1">
              Scheduled AI Call
            </p>
            <p className="text-sm font-medium text-[#1C2B4A]">{message.callTitle ?? "Scheduled call"}</p>
            {message.callScheduledFor && (
              <p className="text-xs text-[#7A7265] mt-1">Scheduled for {message.callScheduledFor}</p>
            )}
            <div className="mt-3">
              <Button
                size="sm"
                type="button"
                onClick={() => onPerformScheduledCall?.(message.id)}
                className="h-7 px-3 text-xs bg-[#1C2B4A] text-white hover:bg-[#243459]"
              >
                Mark Call as Performed
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.messageType === "call_transcript") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] w-full">
          <div className="text-[10px] text-[#7A7265] mb-1 flex items-center gap-2 select-none">
            <span>{message.timestamp}</span>
            {message.unreadCall && (
              <span className="inline-flex items-center gap-1 text-[#1C2B4A] font-semibold">
                <span className="size-1.5 rounded-full bg-[#1C2B4A]" />Unread
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-[#D3E0F5] bg-[#EEF3FB] px-3 py-2.5">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left select-none"
              onClick={() => {
                setCollapsed((prev) => {
                  const next = !prev;
                  if (!next && message.unreadCall) onMarkCallRead?.(message.id);
                  return next;
                });
              }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#385C97] flex items-center gap-1.5">
                  <PhoneCall className="size-3" />
                  Call Transcript
                </p>
                <p className="text-sm text-[#1C2B4A] font-medium mt-0.5">
                  {message.callTitle ?? "Operator Call"}
                </p>
              </div>
              <ChevronDown className={`size-4 text-[#385C97] transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>

            {!collapsed && (
              <div className="mt-3 space-y-2.5 border-t border-[#D3E0F5] pt-3">
                {message.transcriptTurns && message.transcriptTurns.length > 0 ? (
                  message.transcriptTurns.map((turn) => (
                    <div
                      key={turn.id}
                      className={`flex ${turn.role === "agent" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                          turn.role === "agent"
                            ? "bg-[#1C2B4A] text-white"
                            : "bg-white text-[#1C2B4A] ring-1 ring-[#D3E0F5]"
                        }`}
                      >
                        <p className="text-[10px] opacity-70 mb-1 select-none">{turn.speaker}</p>
                        <p className="whitespace-pre-wrap message-body">{turn.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#1C2B4A] whitespace-pre-wrap message-body">{message.body}</p>
                )}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="pt-2 border-t border-[#D3E0F5] flex flex-wrap gap-2 select-none">
                    {message.attachments.map((att) => (
                      <AttachmentChip
                        key={att.id}
                        attachment={att}
                        outbound={false}
                        sourceBadge="Automatically discovered in email"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (message.isAiDraft) {
    const isLoading = message.body === "AI is drafting a response…";

    if (approved) {
      return (
        <div className="flex justify-end">
          <div className="max-w-[68%]">
            <div className="flex items-center justify-end gap-2 mb-1 select-none">
              <span className="text-[10px] text-[#7A7265]">{message.timestamp}</span>
              <span className="text-[10px] font-medium text-emerald-700">Approved &amp; sent</span>
            </div>
            <div className="bg-[#1C2B4A] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap message-body">
              {message.body}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end">
        <div className="max-w-[72%]">
          <div className="flex items-center justify-end gap-2 mb-1.5 select-none">
            <span className="text-[10px] text-[#7A7265]">{message.timestamp}</span>
            <span className="text-[10px] font-semibold text-[#8B6914] flex items-center gap-1">
              <Sparkles className="size-2.5" />
              AI Draft
            </span>
          </div>
          <div
            className={`border-2 border-dashed border-[#C9A84C] bg-amber-50/60 rounded-2xl rounded-tr-sm px-4 py-3 ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            <p className="text-sm leading-relaxed text-[#1C2B4A] whitespace-pre-wrap message-body">{message.body}</p>
            {!isLoading && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#C9A84C]/30 select-none">
                <Button
                  size="sm"
                  className="h-6 px-3 text-[10px] bg-[#1C2B4A] text-white hover:bg-[#243459] gap-1"
                  onClick={() => setApproved(true)}
                >
                  <Check className="size-2.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-3 text-[10px] border-[#C9A84C] text-[#8B6914] hover:bg-amber-100 gap-1"
                  onClick={() => {
                    onEditDraft?.(message.body);
                    setDiscarded(true);
                  }}
                >
                  <Pencil className="size-2.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-3 text-[10px] text-[#7A7265] hover:text-red-600 hover:bg-red-50 gap-1"
                  onClick={() => setDiscarded(true)}
                >
                  <X className="size-2.5" />
                  Discard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isOutbound = message.role === "outbound";
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[68%]">
        <div className={`flex items-center gap-2 mb-1 select-none ${isOutbound ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] font-medium text-[#7A7265]">{message.sender}</span>
          <span className="text-[10px] text-[#7A7265]">{message.timestamp}</span>
        </div>

        <div className="group relative">
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              isOutbound
                ? "bg-[#1C2B4A] text-white rounded-tr-sm"
                : "bg-white text-[#1C2B4A] rounded-tl-sm ring-1 ring-[#E5E0D8]"
            }`}
          >
            {message.body && <p className="whitespace-pre-wrap message-body">{message.body}</p>}

            {hasAttachments && (
              <div
                className={`flex flex-wrap gap-2 select-none ${message.body ? "mt-3 pt-3 border-t" : ""} ${
                  isOutbound ? "border-white/15" : "border-[#E5E0D8]"
                }`}
              >
                {message.attachments?.map((att) => (
                  <AttachmentChip key={att.id} attachment={att} outbound={isOutbound} />
                ))}
              </div>
            )}
          </div>

          {/* Pin button — shown on hover or when pinned */}
          {onTogglePin && (
            <button
              type="button"
              onClick={() => onTogglePin(message.id)}
              title={isPinned ? "Unpin" : "Pin message"}
              className={`absolute -top-1.5 ${isOutbound ? "-left-6" : "-right-6"} size-5 flex items-center justify-center rounded-full transition-all ${
                isPinned
                  ? "opacity-100 text-[#C9A84C]"
                  : "opacity-0 group-hover:opacity-100 text-[#A09380] hover:text-[#C9A84C]"
              }`}
            >
              <Pin className={`size-3.5 ${isPinned ? "fill-[#C9A84C]" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
