"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Sparkles, X, FileText } from "lucide-react";
import { type Message } from "@/lib/data";

interface StagedFile {
  name: string;
  size: string;
  type: "image" | "pdf" | "other";
  previewUrl?: string;
}

interface ComposeBarProps {
  onSend: (message: Message) => void;
  onGenerateAiDraft: () => void;
  draftBody?: string;
  onDraftBodyConsumed?: () => void;
}

export function ComposeBar({ onSend, onGenerateAiDraft, draftBody, onDraftBodyConsumed }: ComposeBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [staged, setStaged] = useState<StagedFile[]>([]);

  // When a draft body is passed in (from "Edit"), populate the textarea
  const prevDraftBody = useRef<string | undefined>(undefined);
  if (draftBody !== prevDraftBody.current) {
    prevDraftBody.current = draftBody;
    if (draftBody !== undefined) {
      setText(draftBody);
      setTimeout(() => {
        textareaRef.current?.focus();
        autoResize(textareaRef.current);
        onDraftBodyConsumed?.();
      }, 0);
    }
  }

  function autoResize(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    autoResize(e.target);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: StagedFile[] = [];
    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      next.push({
        name: file.name,
        size: formatSize(file.size),
        type: isImage ? "image" : isPdf ? "pdf" : "other",
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    }
    setStaged((prev) => [...prev, ...next]);
  }

  function removeStaged(name: string) {
    setStaged((prev) => prev.filter((f) => f.name !== name));
  }

  const handleSend = useCallback(() => {
    const body = text.trim();
    if (!body && staged.length === 0) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "outbound",
      sender: "You",
      timestamp: "Just now",
      body,
      attachments: staged.length > 0
        ? staged.map((f, i) => ({
            id: `staged-${Date.now()}-${i}`,
            name: f.name,
            type: f.type === "image" ? "image" : "pdf",
            size: f.size,
            previewUrl: f.previewUrl,
          }))
        : undefined,
    };

    onSend(newMsg);
    setText("");
    setStaged([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [text, staged, onSend]);

  const canSend = text.trim().length > 0 || staged.length > 0;

  return (
    <div className="shrink-0 bg-white border-t border-[#E5E0D8] px-4 py-3">
      {/* Staged file chips */}
      {staged.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {staged.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-1.5 bg-[#F0EDE8] rounded-lg pl-2 pr-1 py-1"
            >
              {f.type === "image" && f.previewUrl ? (
                // biome-ignore lint/a11y/useAltText: thumbnail
                <img
                  src={f.previewUrl}
                  alt={f.name}
                  className="size-5 rounded object-cover shrink-0"
                />
              ) : (
                <FileText className="size-3.5 text-red-500 shrink-0" />
              )}
              <span className="text-[10px] text-[#1C2B4A] font-medium max-w-[100px] truncate">
                {f.name}
              </span>
              <span className="text-[10px] text-[#7A7265]">{f.size}</span>
              <button
                type="button"
                onClick={() => removeStaged(f.name)}
                className="size-4 flex items-center justify-center rounded text-[#7A7265] hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write a message… (⌘↵ to send)"
        rows={1}
        className="w-full resize-none bg-[#F8F7F4] border border-[#E5E0D8] rounded-xl px-3.5 py-2.5 text-sm text-[#1C2B4A] placeholder:text-[#A8A099] focus:outline-none focus:ring-2 focus:ring-[#1C2B4A]/20 focus:border-[#1C2B4A]/40 transition-all leading-relaxed"
        style={{ minHeight: "40px", maxHeight: "200px" }}
      />

      {/* Action row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[#7A7265] hover:text-[#1C2B4A] hover:bg-[#F0EDE8] transition-colors text-xs"
          >
            <Paperclip className="size-3.5" />
            Attach
          </button>
          <button
            type="button"
            onClick={onGenerateAiDraft}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[#8B6914] hover:text-[#6B4E10] hover:bg-amber-50 transition-colors text-xs font-medium"
          >
            <Sparkles className="size-3.5" />
            AI Draft
          </button>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={!canSend}
          onClick={handleSend}
          className="h-7 px-3 gap-1.5 bg-[#1C2B4A] text-white hover:bg-[#243459] text-xs disabled:opacity-40"
        >
          <Send className="size-3" />
          Send
        </Button>
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
