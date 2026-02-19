"use client";

import { useState } from "react";
import { MessageSquarePlus, Pencil, Plus, Sparkles, Bell, Trash2, User, X } from "lucide-react";
import { useReadContext } from "@/app/_read-context";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? "bg-[#1C2B4A]" : "bg-[#E5E0D8]"
      }`}
    >
      <span
        className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 select-none">
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm font-medium text-[#1C2B4A]">{label}</p>
        <p className="text-xs text-[#7A7265] mt-0.5">{description}</p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center gap-2.5 select-none">
        <div className="size-7 rounded-lg bg-[#F0EDE8] flex items-center justify-center">
          <Icon className="size-4 text-[#1C2B4A]" />
        </div>
        <h2 className="text-sm font-semibold text-[#1C2B4A]">{title}</h2>
      </div>
      <div className="px-6 divide-y divide-[#E5E0D8]">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Justin Shieh");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("Justin Shieh");

  // Notification preferences
  const [emailDigests, setEmailDigests] = useState(true);
  const [draftReady, setDraftReady] = useState(true);
  const [operatorReply, setOperatorReply] = useState(true);

  // AI preferences
  const [autoDraft, setAutoDraft] = useState(false);
  const [draftTone, setDraftTone] = useState<"formal" | "friendly" | "concise">("formal");

  // Template editing state
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useReadContext();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBody, setEditBody] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBody, setNewBody] = useState("");

  function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) setName(trimmed);
    setEditingName(false);
  }

  function startEditTemplate(id: string) {
    const t = templates.find((t) => t.id === id);
    if (!t) return;
    setEditingTemplateId(id);
    setEditName(t.name);
    setEditBody(t.body);
  }

  function saveEditTemplate() {
    if (!editingTemplateId) return;
    updateTemplate(editingTemplateId, { name: editName.trim(), body: editBody });
    setEditingTemplateId(null);
  }

  function saveNewTemplate() {
    if (!newName.trim() || !newBody.trim()) return;
    addTemplate({ name: newName.trim(), body: newBody });
    setNewName("");
    setNewBody("");
    setAddingNew(false);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white shrink-0 select-none">
        <h1 className="text-xl font-semibold text-[#1C2B4A]">Settings</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="px-8 py-6 max-w-2xl space-y-5">
        {/* Profile */}
        <Section icon={User} title="Profile">
          <div className="py-4 flex items-center gap-4">
            <div className="size-14 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1C2B4A] font-bold text-lg shrink-0 select-none">
              JS
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="text-sm font-semibold text-[#1C2B4A] border border-[#C9A84C] rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30"
                  />
                  <button
                    type="button"
                    onClick={saveName}
                    className="text-xs text-[#1C2B4A] font-medium bg-[#F0EDE8] hover:bg-[#E5E0D8] px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    className="text-xs text-[#7A7265] hover:text-[#1C2B4A] px-1 py-1 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 select-none">
                  <p className="text-sm font-semibold text-[#1C2B4A]">{name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(name);
                      setEditingName(true);
                    }}
                    className="text-[10px] text-[#7A7265] hover:text-[#1C2B4A] underline transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-xs text-[#7A7265] mt-0.5 select-none">Senior Travel Advisor</p>
              <p className="text-xs text-[#7A7265] select-none">justin.shieh@conciergetravel.com</p>
            </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <SettingRow
            label="Email digests"
            description="Receive a daily summary of all pending items and new messages"
            enabled={emailDigests}
            onChange={setEmailDigests}
          />
          <SettingRow
            label="Draft ready alerts"
            description="Notify me when an AI draft is ready for review"
            enabled={draftReady}
            onChange={setDraftReady}
          />
          <SettingRow
            label="Operator reply alerts"
            description="Notify me immediately when an operator sends a new message"
            enabled={operatorReply}
            onChange={setOperatorReply}
          />
        </Section>

        {/* AI Preferences */}
        <Section icon={Sparkles} title="AI Preferences">
          <SettingRow
            label="Auto-draft enabled"
            description="Automatically generate a draft reply when an operator message is received"
            enabled={autoDraft}
            onChange={setAutoDraft}
          />
          <div className="py-3.5 select-none">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-[#1C2B4A]">Draft tone</p>
                <p className="text-xs text-[#7A7265] mt-0.5">
                  The default writing style used when generating AI drafts
                </p>
              </div>
              <div className="flex items-center gap-1 bg-[#F8F7F4] border border-[#E5E0D8] rounded-xl p-0.5 shrink-0">
                {(["formal", "friendly", "concise"] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setDraftTone(tone)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                      draftTone === tone
                        ? "bg-white text-[#1C2B4A] shadow-sm border border-[#E5E0D8]"
                        : "text-[#7A7265] hover:text-[#1C2B4A]"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Quick Reply Templates */}
        <Section icon={MessageSquarePlus} title="Quick Reply Templates">
          <div className="py-3 space-y-2">
            {templates.map((t) =>
              editingTemplateId === t.id ? (
                <div key={t.id} className="rounded-xl border border-[#C9A84C] bg-amber-50/40 p-3 space-y-2">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Template name"
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-colors"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={4}
                    placeholder="Template body"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-colors resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={saveEditTemplate}
                      className="h-7 px-3 text-xs bg-[#1C2B4A] text-white rounded-lg hover:bg-[#243459] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTemplateId(null)}
                      className="h-7 px-3 text-xs text-[#7A7265] hover:text-[#1C2B4A] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-[#E5E0D8] bg-[#FAFAF8] px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1C2B4A]">{t.name}</p>
                    <p className="text-[10px] text-[#7A7265] mt-0.5 truncate">{t.body.slice(0, 80)}{t.body.length > 80 ? "…" : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditTemplate(t.id)}
                      className="size-6 flex items-center justify-center rounded text-[#7A7265] hover:text-[#1C2B4A] hover:bg-[#F0EDE8] transition-colors"
                      title="Edit"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTemplate(t.id)}
                      className="size-6 flex items-center justify-center rounded text-[#7A7265] hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              )
            )}

            {addingNew ? (
              <div className="rounded-xl border border-[#C9A84C] bg-amber-50/40 p-3 space-y-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Template name"
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-colors"
                />
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={4}
                  placeholder="Template body"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-colors resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveNewTemplate}
                    className="h-7 px-3 text-xs bg-[#1C2B4A] text-white rounded-lg hover:bg-[#243459] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddingNew(false); setNewName(""); setNewBody(""); }}
                    className="h-7 px-3 text-xs text-[#7A7265] hover:text-[#1C2B4A] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingNew(true)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-dashed border-[#D8D2C8] text-xs text-[#7A7265] hover:text-[#1C2B4A] hover:border-[#1C2B4A] transition-colors w-full"
              >
                <Plus className="size-3.5" />
                Add template
              </button>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
