"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  FileText,
  Languages,
  MessageSquarePlus,
  Paperclip,
  PhoneCall,
  Send,
  Sparkles,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import type { Channel, Message, Traveler } from "@/lib/data";
import type { Template } from "@/app/_read-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StagedFile {
  name: string;
  size: string;
  type: "image" | "pdf" | "other";
  previewUrl?: string;
}

type ActivePanel = "attach" | "translate" | "travelers" | "ai_draft" | "templates" | null;
type InsertFormat = "plain" | "list" | "table";
type DraftTone = "professional" | "friendly" | "concise" | "detailed" | "formal";
type DraftLength = "short" | "medium" | "long";

// ─── Traveler helpers ─────────────────────────────────────────────────────────

const TRAVELER_FIELDS: { id: string; label: string }[] = [
  { id: "full_name", label: "Full Name" },
  { id: "dob", label: "Date of Birth" },
  { id: "gender", label: "Gender" },
  { id: "nationality", label: "Nationality" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "passport", label: "Passport" },
  { id: "drivers_license", label: "Driver's Licence" },
  { id: "visa", label: "Visa" },
  { id: "notes", label: "Notes" },
];
const PERSONAL_FIELD_IDS = ["full_name", "dob", "gender", "nationality", "email", "phone", "notes"];
const DOCUMENT_FIELD_IDS = ["passport", "drivers_license", "visa"];

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
};

function formatDobShort(dob: string): string {
  const d = new Date(dob + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function buildTravelerText(traveler: Traveler, fields: string[], format: InsertFormat): string {
  const rows: [string, string][] = [];

  if (fields.includes("full_name")) {
    const name = [traveler.firstName, traveler.middleName, traveler.lastName].filter(Boolean).join(" ");
    rows.push(["Name", name]);
  }
  if (fields.includes("dob") && traveler.dateOfBirth) rows.push(["DOB", formatDobShort(traveler.dateOfBirth)]);
  if (fields.includes("gender") && traveler.gender) rows.push(["Gender", GENDER_LABELS[traveler.gender] ?? traveler.gender]);
  if (fields.includes("nationality") && traveler.nationality) rows.push(["Nationality", traveler.nationality]);
  if (fields.includes("email") && traveler.email) rows.push(["Email", traveler.email]);
  if (fields.includes("phone") && traveler.phone) rows.push(["Phone", traveler.phone]);

  const passportDocs = traveler.documents.filter((d) => d.type === "passport");
  if (fields.includes("passport") && passportDocs.length > 0) {
    for (const doc of passportDocs) {
      const val = [doc.number, doc.expiryDate ? `exp ${doc.expiryDate}` : ""].filter(Boolean).join(" ");
      rows.push(["Passport", val || doc.label]);
    }
  }
  const dlDocs = traveler.documents.filter((d) => d.type === "drivers_license");
  if (fields.includes("drivers_license") && dlDocs.length > 0) {
    for (const doc of dlDocs) rows.push(["Driver's Licence", doc.number ?? doc.label]);
  }
  const visaDocs = traveler.documents.filter((d) => d.type === "visa");
  if (fields.includes("visa") && visaDocs.length > 0) {
    for (const doc of visaDocs) {
      const val = [doc.label, doc.number, doc.expiryDate ? `exp ${doc.expiryDate}` : ""].filter(Boolean).join(" · ");
      rows.push(["Visa", val]);
    }
  }
  if (fields.includes("notes") && traveler.notes) rows.push(["Notes", traveler.notes]);

  if (rows.length === 0) return "";

  if (format === "plain") return rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  if (format === "list") {
    const name = rows.find(([k]) => k === "Name")?.[1] ?? `${traveler.firstName} ${traveler.lastName}`;
    const rest = rows.filter(([k]) => k !== "Name");
    return [`• ${name}`, ...rest.map(([k, v]) => `  - ${k}: ${v}`)].join("\n");
  }

  return [`| Field | Value |`, `|---|---|`, ...rows.map(([k, v]) => `| ${k} | ${v} |`)].join("\n");
}

function buildInsertText(travelers: Traveler[], selectedIds: string[], fields: string[], format: InsertFormat): string {
  const selected = travelers.filter((t) => selectedIds.includes(t.id));
  if (selected.length === 0) return "";

  if (format === "table" && selected.length > 1) {
    const headerCols = fields.map((f) => TRAVELER_FIELDS.find((tf) => tf.id === f)?.label ?? f);
    const header = `| ${headerCols.join(" | ")} |`;
    const sep = `|${headerCols.map(() => "---|").join("")}`;
    const rows = selected.map((t) => {
      const text = buildTravelerText(t, fields, "plain");
      const vals = fields.map((f) => {
        const line = text.split("\n").find((l) => {
          const key = l.split(":")[0].trim().toLowerCase();
          const fieldLabel = TRAVELER_FIELDS.find((tf) => tf.id === f)?.label.toLowerCase() ?? f;
          return key === fieldLabel;
        });
        return line ? line.split(":").slice(1).join(":").trim() : "";
      });
      return `| ${vals.join(" | ")} |`;
    });
    return [header, sep, ...rows].join("\n");
  }

  return selected.map((t) => buildTravelerText(t, fields, format)).filter(Boolean).join("\n\n");
}

// ─── Phone call helpers ───────────────────────────────────────────────────────

function buildPrompt(input: { objective: string; participants: string; mustCover: string; outcome: string; constraints: string }): string {
  return [
    "Automated operator call requirements",
    "",
    `Primary objective: ${input.objective || "Confirm final operational details and lock execution."}`,
    `Participants: ${input.participants || "Travel agent and operator dispatch or reservations lead."}`,
    "",
    "Topics to cover:",
    `- ${input.mustCover || "timings, pickup points, inclusions, exclusions, payment and cancellation terms"}`,
    "- Confirm guest handling details (dietary, baggage, accessibility, emergency contact).",
    "- Confirm escalation path and duty manager contact.",
    "",
    `Required outcome: ${input.outcome || "Written confirmation with named operations owner and final schedule."}`,
    `Constraints: ${input.constraints || "Keep call concise, factual, and operationally specific."}`,
    "",
    "Output format required from AI call:",
    "- final commitments",
    "- unresolved items",
    "- follow-up owner and deadline",
  ].join("\n");
}

function buildTranscriptTurns(operatorName: string, objective: string) {
  return [
    { id: `turn-${Date.now()}-1`, speaker: "AI Agent", role: "agent" as const, body: `Opening the call and confirming today's objective: ${objective || "finalize all operational details"}.` },
    { id: `turn-${Date.now()}-2`, speaker: operatorName, role: "operator" as const, body: "Confirmed. We can proceed line by line through timing, transfer logistics, and service inclusions." },
    { id: `turn-${Date.now()}-3`, speaker: "AI Agent", role: "agent" as const, body: "Requested exact pickup points, timing windows, and named on-ground contact for operations." },
    { id: `turn-${Date.now()}-4`, speaker: operatorName, role: "operator" as const, body: "Provided confirmed times, dispatch contact, and reconfirmation procedure for day-of-service." },
  ];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── AI draft response builder (mockup) ──────────────────────────────────────

const TONE_OPENERS: Record<DraftTone, string> = {
  professional: "Dear [Operator],\n\nThank you for your prompt response.",
  friendly: "Hi there!\n\nThanks so much for getting back to us.",
  concise: "Thank you.",
  detailed: "Dear [Operator],\n\nThank you very much for your detailed response and for taking the time to address all our requirements.",
  formal: "Dear Sir/Madam,\n\nI write to acknowledge receipt of your correspondence.",
};

const TONE_CLOSINGS: Record<DraftTone, string> = {
  professional: "\n\nKind regards,\nJustin Shieh\nEnvoy Travel",
  friendly: "\n\nLooking forward to hearing from you!\n\nBest,\nJustin",
  concise: "\n\nBest,\nJustin",
  detailed: "\n\nPlease don't hesitate to reach out should you require any further information from our side.\n\nKind regards,\nJustin Shieh\nEnvoy Travel",
  formal: "\n\nYours faithfully,\nJustin Shieh\nEnvoy Travel",
};

function buildAiDraftText(
  channel: Channel,
  tone: DraftTone,
  length: DraftLength,
  customPrompt: string,
  context: string,
  operatorName: string,
): string {
  if (channel === "whatsapp" || channel === "sms") {
    const short = "Thanks for the quick update. Please confirm final pricing and payment steps so I can lock this in.";
    const med = `Thanks for your reply! I'd like to confirm the details and proceed with the booking. Could you send across final pricing and any payment instructions?\n\nLooking forward to confirming this.`;
    return length === "short" ? short : med;
  }

  const opener = TONE_OPENERS[tone];
  const closing = TONE_CLOSINGS[tone];

  const bodyLines: string[] = [];

  if (customPrompt) {
    bodyLines.push(`\n\n${customPrompt}`);
  } else {
    bodyLines.push("\n\nI am pleased to confirm that we'd like to proceed as discussed.");
    if (length !== "short") {
      bodyLines.push("\n\nCould you please provide:");
      bodyLines.push("• Confirmation documentation");
      bodyLines.push("• Payment details and deposit requirements");
      if (length === "long") {
        bodyLines.push("• Any pre-arrival information for my clients");
        bodyLines.push("• Cancellation policy and amendment terms");
        bodyLines.push("• On-ground emergency contact details");
        if (context) bodyLines.push(`\n\nFor context: ${context}`);
      }
    }
  }

  return opener + bodyLines.join("\n") + closing;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ComposeBarProps {
  channel: Channel;
  operatorName: string;
  onSend: (message: Message) => void;
  onGenerateAiDraft: (opts: { tone: DraftTone; length: DraftLength; customPrompt: string; context: string }) => void;
  draftBody?: string;
  onDraftBodyConsumed?: () => void;
  travelers?: Traveler[];
  templates?: Template[];
}

// ─── Tab button component ─────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
  activeClass,
  idleClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClass: string;
  idleClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-colors select-none border ${active ? activeClass : idleClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ComposeBar({
  channel,
  operatorName,
  onSend,
  onGenerateAiDraft,
  draftBody,
  onDraftBodyConsumed,
  travelers = [],
  templates = [],
}: ComposeBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [staged, setStaged] = useState<StagedFile[]>([]);

  // Active tool panel — null means all collapsed
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  // Translate state
  const [sourceLanguage, setSourceLanguage] = useState("Auto-detect");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");

  // AI Draft state
  const [draftTone, setDraftTone] = useState<DraftTone>("professional");
  const [draftLength, setDraftLength] = useState<DraftLength>("medium");
  const [draftCustomPrompt, setDraftCustomPrompt] = useState("");
  const [draftContext, setDraftContext] = useState("");
  const [draftIncludeHistory, setDraftIncludeHistory] = useState(true);
  const [draftGenerating, setDraftGenerating] = useState(false);

  // Traveler state
  const [selectedTravelerIds, setSelectedTravelerIds] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(["full_name", "dob", "passport"]);
  const [insertFormat, setInsertFormat] = useState<InsertFormat>("plain");

  // Phone call state
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [objective, setObjective] = useState("");
  const [participants, setParticipants] = useState("");
  const [mustCover, setMustCover] = useState("");
  const [outcome, setOutcome] = useState("");
  const [constraints, setConstraints] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [callWhen, setCallWhen] = useState("");

  // Template search state
  const [templateQuery, setTemplateQuery] = useState("");

  const detailedPrompt = useMemo(
    () => buildPrompt({ objective, participants, mustCover, outcome, constraints }),
    [objective, participants, mustCover, outcome, constraints],
  );

  // Sync draft body from parent (approve/edit flow)
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
      if (canSend) handleSendText();
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

  const handleSendText = useCallback(() => {
    const body = text.trim();
    if (!body && staged.length === 0) return;

    const stamp = Date.now();
    const newMsg: Message = {
      id: `msg-${stamp}`,
      role: "outbound",
      sender: "You",
      timestamp: "Just now",
      body,
      attachments:
        staged.length > 0
          ? staged.map((f, i) => ({
              id: `staged-${stamp}-${i}`,
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
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [text, staged, onSend]);

  const handleCreateAiCall = useCallback(() => {
    const turns = buildTranscriptTurns(operatorName, objective.trim());

    if (scheduleEnabled && callWhen) {
      onSend({
        id: `scheduled-call-${Date.now()}`,
        role: "outbound",
        sender: "AI Call Planner",
        timestamp: "Just now",
        body: `AI call scheduled for ${callWhen}.`,
        messageType: "scheduled_call",
        callTitle: `Scheduled call with ${operatorName}`,
        callPrompt: detailedPrompt,
        callScheduledFor: callWhen,
      });
      setCallDialogOpen(false);
      return;
    }

    onSend({
      id: `call-${Date.now()}`,
      role: "inbound",
      sender: "AI Call Assistant",
      timestamp: "Just now",
      body: "Automated call completed. Expand to review transcript.",
      messageType: "call_transcript",
      callTitle: `Completed call with ${operatorName}`,
      callPrompt: detailedPrompt,
      unreadCall: true,
      transcriptTurns: turns,
    });
    setCallDialogOpen(false);
  }, [callWhen, detailedPrompt, objective, onSend, operatorName, scheduleEnabled]);

  function handleGenerateDraft() {
    setDraftGenerating(true);
    // Insert draft text directly into the textarea
    const draftText = buildAiDraftText(channel, draftTone, draftLength, draftCustomPrompt, draftContext, operatorName);
    setTimeout(() => {
      setText(draftText);
      setTimeout(() => {
        autoResize(textareaRef.current);
        textareaRef.current?.focus();
      }, 0);
      setDraftGenerating(false);
      setActivePanel(null);
    }, 400);
    // Also trigger the chat-thread draft bubble
    onGenerateAiDraft({
      tone: draftTone,
      length: draftLength,
      customPrompt: draftCustomPrompt,
      context: draftContext,
    });
  }

  function translateInline() {
    const src = text.trim();
    if (!src) return;
    setText(`[Translated ${sourceLanguage} → ${targetLanguage}]\n${src}`);
    setTimeout(() => autoResize(textareaRef.current), 0);
  }

  function togglePanel(panel: ActivePanel) {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  const canSend = text.trim().length > 0 || staged.length > 0;

  // ── Phone channel ─────────────────────────────────────────────────────────

  if (channel === "phone") {
    return (
      <div className="shrink-0 bg-white border-t border-[#E5E0D8] px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#7A7265]">Call-only thread</p>
          <Button
            type="button"
            size="sm"
            onClick={() => setCallDialogOpen(true)}
            className="h-7 px-3 gap-1.5 bg-[#1C2B4A] text-white hover:bg-[#243459] text-xs"
          >
            <WandSparkles className="size-3" />
            Generate AI Call
          </Button>
        </div>

        <AlertDialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
          <AlertDialogContent className="!w-[min(1320px,96vw)] !max-w-[min(1320px,96vw)] p-0 overflow-hidden">
            <AlertDialogHeader className="px-5 pt-5 pb-3 border-b border-[#E5E0D8] text-left items-start">
              <AlertDialogTitle className="text-sm font-semibold text-[#1C2B4A]">AI Call Builder</AlertDialogTitle>
              <AlertDialogDescription>
                Build requirements for an automated call with {operatorName}. You can run now or schedule it.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-[72vh] overflow-y-auto">
              <div className="space-y-3 lg:col-span-7">
                {[
                  { id: "call-objective", label: "Objective", value: objective, set: setObjective, placeholder: "e.g. Lock transfer timings and handoff owners" },
                  { id: "call-participants", label: "Participants", value: participants, set: setParticipants, placeholder: "e.g. Agent, reservations manager, dispatch lead" },
                ].map(({ id, label, value, set, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs font-medium text-[#1C2B4A] mb-1">{label}</label>
                    <input id={id} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                      className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors" />
                  </div>
                ))}
                <div>
                  <label htmlFor="call-must-cover" className="block text-xs font-medium text-[#1C2B4A] mb-1">Must-cover topics</label>
                  <textarea id="call-must-cover" value={mustCover} onChange={(e) => setMustCover(e.target.value)} rows={3}
                    placeholder="e.g. pickup points, permit references, cancellations, payment terms"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "call-outcome", label: "Success outcome", value: outcome, set: setOutcome, placeholder: "e.g. written reconfirmation" },
                    { id: "call-constraints", label: "Constraints", value: constraints, set: setConstraints, placeholder: "e.g. keep under 8 minutes" },
                  ].map(({ id, label, value, set, placeholder }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-xs font-medium text-[#1C2B4A] mb-1">{label}</label>
                      <input id={id} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                        className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-[#E5E0D8] bg-[#F8F7F4] p-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#1C2B4A]">
                    <input type="checkbox" checked={scheduleEnabled} onChange={(e) => setScheduleEnabled(e.target.checked)} />
                    Schedule this call
                  </label>
                  {scheduleEnabled && (
                    <input type="datetime-local" value={callWhen} onChange={(e) => setCallWhen(e.target.value)}
                      className="mt-2 w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors" />
                  )}
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-lg border border-[#D9D4CA] bg-[#FAF9F6] p-3 h-full">
                  <p className="text-[11px] font-semibold text-[#7A7265] mb-1">Detailed prompt preview</p>
                  <pre className="text-[11px] text-[#4F4A40] whitespace-pre-wrap leading-relaxed">{detailedPrompt}</pre>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="px-5 py-4 border-t border-[#E5E0D8]">
              <AlertDialogCancel className="h-8 px-3 border-[#E5E0D8] text-[#7A7265]">Cancel</AlertDialogCancel>
              <AlertDialogAction className="h-8 px-3 bg-[#1C2B4A] text-white hover:bg-[#243459]" onClick={handleCreateAiCall}>
                <PhoneCall className="size-3.5" />
                {scheduleEnabled ? "Schedule AI Call" : "Run AI Call"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ── Normal text/email/whatsapp/sms channel ────────────────────────────────

  return (
    <div className="shrink-0 bg-white border-t border-[#E5E0D8]">

      {/* Tool panels — shown above the textarea, inside the compose area */}
      {activePanel !== null && (
        <div className="border-b border-[#E5E0D8]">

          {/* ── Attach panel ── */}
          {activePanel === "attach" && (
            <div className="px-4 py-3 bg-[#FAFAF8] space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">Attachments</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {staged.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {staged.map((f) => (
                    <div key={f.name} className="flex items-center gap-1.5 bg-white border border-[#E5E0D8] rounded-lg pl-2 pr-1 py-1">
                      {f.type === "image" && f.previewUrl ? (
                        <img src={f.previewUrl} alt={f.name} className="size-5 rounded object-cover shrink-0" />
                      ) : (
                        <FileText className="size-3.5 text-red-500 shrink-0" />
                      )}
                      <span className="text-[10px] text-[#1C2B4A] font-medium max-w-[100px] truncate">{f.name}</span>
                      <span className="text-[10px] text-[#7A7265]">{f.size}</span>
                      <button type="button" onClick={() => removeStaged(f.name)}
                        className="size-4 flex items-center justify-center rounded text-[#7A7265] hover:text-red-600 hover:bg-red-50 transition-colors">
                        <X className="size-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A09380]">No files attached yet.</p>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-[#E5E0D8] bg-white text-xs text-[#1C2B4A] hover:bg-[#F0EDE8] transition-colors">
                <Paperclip className="size-3.5" />
                Choose files…
              </button>
            </div>
          )}

          {/* ── Translate panel ── */}
          {activePanel === "translate" && (
            <div className="px-4 py-3 bg-indigo-50/30 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-900/70">Translate</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-indigo-900 font-medium">From</span>
                <Select value={sourceLanguage} onValueChange={(v) => v && setSourceLanguage(v)}>
                  <SelectTrigger className="h-7 text-xs border-indigo-200 bg-white text-[#1C2B4A] w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Auto-detect", "English", "Spanish", "French", "Italian", "Portuguese", "Swahili", "Japanese", "Arabic"].map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-indigo-900 font-medium">to</span>
                <Select value={targetLanguage} onValueChange={(v) => v && setTargetLanguage(v)}>
                  <SelectTrigger className="h-7 text-xs border-indigo-200 bg-white text-[#1C2B4A] w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["English", "Spanish", "French", "Italian", "Portuguese", "Swahili", "Japanese", "Arabic"].map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" onClick={translateInline}
                  className="h-7 px-3 text-xs bg-indigo-600 text-white hover:bg-indigo-700">
                  Translate message
                </Button>
              </div>
              <p className="text-[10px] text-indigo-700/70">Applies translation prefix to your current message text.</p>
            </div>
          )}

          {/* ── AI Draft panel ── */}
          {activePanel === "ai_draft" && (
            <div className="px-4 py-3 bg-amber-50/40 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-900/70">AI Draft Settings</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Tone */}
                <div>
                  <label className="block text-[10px] font-medium text-[#7A7265] mb-1.5">Tone</label>
                  <div className="flex flex-wrap gap-1">
                    {(["professional", "friendly", "concise", "detailed", "formal"] as DraftTone[]).map((t) => (
                      <button key={t} type="button" onClick={() => setDraftTone(t)}
                        className={`h-6 px-2 rounded-md text-[10px] font-medium capitalize transition-colors border ${
                          draftTone === t
                            ? "bg-amber-200 text-amber-900 border-amber-400"
                            : "bg-white text-[#7A7265] border-[#E5E0D8] hover:border-amber-300 hover:text-amber-800"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label className="block text-[10px] font-medium text-[#7A7265] mb-1.5">Length</label>
                  <div className="flex gap-1">
                    {(["short", "medium", "long"] as DraftLength[]).map((l) => (
                      <button key={l} type="button" onClick={() => setDraftLength(l)}
                        className={`h-6 px-2.5 rounded-md text-[10px] font-medium capitalize transition-colors border ${
                          draftLength === l
                            ? "bg-amber-200 text-amber-900 border-amber-400"
                            : "bg-white text-[#7A7265] border-[#E5E0D8] hover:border-amber-300 hover:text-amber-800"
                        }`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom prompt */}
              <div>
                <label className="block text-[10px] font-medium text-[#7A7265] mb-1">
                  Custom instruction <span className="font-normal text-[#A09380]">(optional)</span>
                </label>
                <input
                  value={draftCustomPrompt}
                  onChange={(e) => setDraftCustomPrompt(e.target.value)}
                  placeholder="e.g. Ask for updated availability on the 14th and request a group discount"
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-amber-200 bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Context / background */}
              <div>
                <label className="block text-[10px] font-medium text-[#7A7265] mb-1">
                  Additional context <span className="font-normal text-[#A09380]">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={draftContext}
                  onChange={(e) => setDraftContext(e.target.value)}
                  placeholder="e.g. Client has a gluten allergy and prefers morning departures"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-[#7A7265]">
                  <input
                    type="checkbox"
                    checked={draftIncludeHistory}
                    onChange={(e) => setDraftIncludeHistory(e.target.checked)}
                    className="rounded"
                  />
                  Include thread history as context
                </label>

                <Button
                  type="button"
                  size="sm"
                  disabled={draftGenerating}
                  onClick={handleGenerateDraft}
                  className="h-7 px-3 gap-1.5 text-xs bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  <Sparkles className="size-3" />
                  {draftGenerating ? "Generating…" : "Generate"}
                </Button>
              </div>
            </div>
          )}

          {/* ── Travelers panel ── */}
          {activePanel === "travelers" && travelers.length > 0 && (
            <div className="px-4 py-3 bg-teal-50/30 space-y-3">
              {/* Panel header with Insert button */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-900/70">Insert Traveler Info</p>
                <Button type="button" size="sm"
                  disabled={selectedTravelerIds.length === 0 || selectedFields.length === 0}
                  onClick={() => {
                    const insertText = buildInsertText(travelers, selectedTravelerIds, selectedFields, insertFormat);
                    if (!insertText) return;
                    setText((prev) => (prev ? `${prev}\n\n${insertText}` : insertText));
                    setTimeout(() => { autoResize(textareaRef.current); textareaRef.current?.focus(); }, 0);
                  }}
                  className="h-6 px-2.5 text-[10px] bg-[#1C2B4A] text-white hover:bg-[#243459] disabled:opacity-40">
                  Insert
                </Button>
              </div>

              {/* Traveler chips */}
              <div>
                <p className="text-[10px] font-medium text-[#7A7265] mb-1.5">Select travelers</p>
                <div className="flex flex-wrap gap-1.5">
                  {travelers.map((t) => {
                    const active = selectedTravelerIds.includes(t.id);
                    return (
                      <button key={t.id} type="button"
                        onClick={() => setSelectedTravelerIds((prev) => active ? prev.filter((id) => id !== t.id) : [...prev, t.id])}
                        className={`h-6 px-2.5 rounded-full text-xs font-medium transition-colors border ${
                          active ? "bg-teal-200 text-teal-900 border-teal-400" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"
                        }`}>
                        {t.firstName} {t.lastName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fields as pill toggles */}
              <div>
                <p className="text-[10px] font-medium text-[#7A7265] mb-1.5">Personal info</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRAVELER_FIELDS.filter((f) => PERSONAL_FIELD_IDS.includes(f.id)).map((f) => {
                    const active = selectedFields.includes(f.id);
                    return (
                      <button key={f.id} type="button"
                        onClick={() => setSelectedFields((prev) => active ? prev.filter((id) => id !== f.id) : [...prev, f.id])}
                        className={`h-6 px-2.5 rounded-full text-xs font-medium transition-colors border ${
                          active ? "bg-teal-200 text-teal-900 border-teal-400" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"
                        }`}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-teal-100">
                <p className="text-[10px] font-medium text-[#7A7265] mb-1.5">Documents</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRAVELER_FIELDS.filter((f) => DOCUMENT_FIELD_IDS.includes(f.id)).map((f) => {
                    const active = selectedFields.includes(f.id);
                    return (
                      <button key={f.id} type="button"
                        onClick={() => setSelectedFields((prev) => active ? prev.filter((id) => id !== f.id) : [...prev, f.id])}
                        className={`h-6 px-2.5 rounded-full text-xs font-medium transition-colors border ${
                          active ? "bg-teal-200 text-teal-900 border-teal-400" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"
                        }`}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#7A7265] mt-2">
                  Tip: If a document isn&apos;t available here, add it in the trip&apos;s Travelers tab first.
                </p>
              </div>

              {/* Format */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-medium text-[#7A7265]">Format:</span>
                {(["plain", "list", "table"] as InsertFormat[]).map((fmt) => (
                  <button key={fmt} type="button" onClick={() => setInsertFormat(fmt)}
                    className={`h-6 px-2.5 rounded-full text-xs font-medium transition-colors border ${
                      insertFormat === fmt ? "bg-teal-200 text-teal-900 border-teal-400" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"
                    }`}>
                    {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* ── Templates panel ── */}
          {activePanel === "templates" && (
            <div className="px-4 py-3 bg-[#F8F7F4] space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">Quick Reply Templates</p>
              <input
                value={templateQuery}
                onChange={(e) => setTemplateQuery(e.target.value)}
                placeholder="Search templates…"
                className="w-full h-7 px-2.5 text-xs rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#1C2B4A]/20 transition-colors"
              />
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {templates
                  .filter((t) => {
                    const q = templateQuery.toLowerCase();
                    return !q || t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
                  })
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setText((prev) => (prev.trim() === "" ? t.body : `${prev}\n\n${t.body}`));
                        setTimeout(() => { autoResize(textareaRef.current); textareaRef.current?.focus(); }, 0);
                        setActivePanel(null);
                      }}
                      className="w-full text-left rounded-lg border border-[#E5E0D8] bg-white hover:bg-[#F0EDE8] px-3 py-2 transition-colors"
                    >
                      <p className="text-xs font-medium text-[#1C2B4A]">{t.name}</p>
                      <p className="text-[10px] text-[#7A7265] mt-0.5 truncate">{t.body.slice(0, 60)}{t.body.length > 60 ? "…" : ""}</p>
                    </button>
                  ))}
                {templates.filter((t) => {
                  const q = templateQuery.toLowerCase();
                  return !q || t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
                }).length === 0 && (
                  <p className="text-xs text-[#A09380] py-1">No templates match your search.</p>
                )}
              </div>
              <a
                href="/settings"
                className="block text-[10px] text-[#7A7265] hover:text-[#1C2B4A] underline transition-colors"
              >
                Manage in Settings →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Toolbar row (tabs at top of compose area) */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-1.5">
          {/* Attach */}
          <TabButton
            active={activePanel === "attach"}
            onClick={() => togglePanel("attach")}
            icon={<Paperclip className="size-3.5" />}
            label={staged.length > 0 ? `Attach (${staged.length})` : "Attach"}
            activeClass="bg-[#F0EDE8] text-[#1C2B4A] border-[#D8D2C8]"
            idleClass="text-[#7A7265] hover:text-[#1C2B4A] hover:bg-[#F0EDE8] border-transparent"
          />

          {/* Translate */}
          <TabButton
            active={activePanel === "translate"}
            onClick={() => togglePanel("translate")}
            icon={<Languages className="size-3.5" />}
            label="Translate"
            activeClass="bg-indigo-200 text-indigo-900 border-indigo-300"
            idleClass="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 border-transparent"
          />

          {/* Travelers — only if trip has travelers */}
          {travelers.length > 0 && (
            <TabButton
              active={activePanel === "travelers"}
              onClick={() => togglePanel("travelers")}
              icon={<Users className="size-3.5" />}
              label="Travelers"
              activeClass="bg-teal-200 text-teal-900 border-teal-300"
              idleClass="text-teal-700 hover:text-teal-800 hover:bg-teal-50 border-transparent"
            />
          )}

          {/* AI Draft */}
          <TabButton
            active={activePanel === "ai_draft"}
            onClick={() => togglePanel("ai_draft")}
            icon={<Sparkles className="size-3.5" />}
            label="AI Draft"
            activeClass="bg-amber-200 text-amber-900 border-amber-300"
            idleClass="text-[#8B6914] hover:text-[#6B4E10] hover:bg-amber-50 border-transparent"
          />

          {/* Templates */}
          {templates.length > 0 && (
            <TabButton
              active={activePanel === "templates"}
              onClick={() => togglePanel("templates")}
              icon={<MessageSquarePlus className="size-3.5" />}
              label="Templates"
              activeClass="bg-[#F0EDE8] text-[#1C2B4A] border-[#D8D2C8]"
              idleClass="text-[#7A7265] hover:text-[#1C2B4A] hover:bg-[#F0EDE8] border-transparent"
            />
          )}
        </div>
      </div>

      {/* Textarea + send row */}
      <div className="px-4 py-3 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message… (Cmd+Enter to send)"
          rows={1}
          className="flex-1 resize-none bg-[#F8F7F4] border border-[#E5E0D8] rounded-xl px-3.5 py-2.5 text-sm text-[#1C2B4A] placeholder:text-[#A8A099] focus:outline-none focus:ring-2 focus:ring-[#1C2B4A]/20 focus:border-[#1C2B4A]/40 transition-all leading-relaxed"
          style={{ minHeight: "40px", maxHeight: "200px" }}
        />
        <Button
          type="button"
          size="sm"
          disabled={!canSend}
          onClick={handleSendText}
          className="h-7 px-3 gap-1.5 bg-[#1C2B4A] text-white hover:bg-[#243459] text-xs disabled:opacity-40 shrink-0"
        >
          <Send className="size-3" />
          Send
        </Button>
      </div>
    </div>
  );
}
