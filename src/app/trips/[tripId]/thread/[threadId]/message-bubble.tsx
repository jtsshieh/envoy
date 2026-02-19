"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Message } from "@/lib/data";
import { Sparkles, Check, Pencil, X } from "lucide-react";
import { AttachmentChip } from "./attachment-chip";

interface MessageBubbleProps {
  message: Message;
  onEditDraft?: (body: string) => void;
}

export function MessageBubble({ message, onEditDraft }: MessageBubbleProps) {
  const [approved, setApproved] = useState(false);
  const [discarded, setDiscarded] = useState(false);

  if (discarded) return null;

  if (message.isAiDraft) {
    const isLoading = message.body === "AI is drafting a response…";

    if (approved) {
      return (
        <div className="flex justify-end">
          <div className="max-w-[68%]">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-[10px] text-[#7A7265]">
                {message.timestamp}
              </span>
              <span className="text-[10px] font-medium text-emerald-700">
                Approved &amp; sent
              </span>
            </div>
            <div className="bg-[#1C2B4A] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
              {message.body}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end">
        <div className="max-w-[72%]">
          <div className="flex items-center justify-end gap-2 mb-1.5">
            <span className="text-[10px] text-[#7A7265]">
              {message.timestamp}
            </span>
            <span className="text-[10px] font-semibold text-[#8B6914] flex items-center gap-1">
              <Sparkles className="size-2.5" />
              AI Draft
            </span>
          </div>
          <div className={`border-2 border-dashed border-[#C9A84C] bg-amber-50/60 rounded-2xl rounded-tr-sm px-4 py-3 ${isLoading ? "animate-pulse" : ""}`}>
            <p className="text-sm leading-relaxed text-[#1C2B4A] whitespace-pre-wrap">
              {message.body}
            </p>
            {!isLoading && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#C9A84C]/30">
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
        <div
          className={`flex items-center gap-2 mb-1 ${isOutbound ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[10px] font-medium text-[#7A7265]">
            {message.sender}
          </span>
          <span className="text-[10px] text-[#7A7265]">
            {message.timestamp}
          </span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isOutbound
              ? "bg-[#1C2B4A] text-white rounded-tr-sm"
              : "bg-white text-[#1C2B4A] rounded-tl-sm ring-1 ring-[#E5E0D8]"
          }`}
        >
          {message.body && (
            <p className="whitespace-pre-wrap">{message.body}</p>
          )}

          {hasAttachments && (
            <div
              className={`flex flex-wrap gap-2 ${message.body ? "mt-3 pt-3 border-t" : ""} ${
                isOutbound ? "border-white/15" : "border-[#E5E0D8]"
              }`}
            >
              {message.attachments!.map((att) => (
                <AttachmentChip
                  key={att.id}
                  attachment={att}
                  outbound={isOutbound}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
