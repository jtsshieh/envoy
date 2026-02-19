"use client";

import { useState } from "react";
import { type Traveler, type TravelerDocument, type TravelerGender } from "@/lib/data";
import { mockCrmContacts, type CrmContact } from "@/lib/integrations-data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Plus, FileText, Trash2, ChevronDown, ChevronUp, Upload, PenLine, User, Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Constants ─────────────────────────────────────────────────────────────────

const GENDER_LABELS: Record<TravelerGender, string> = {
  male: "Male",
  female: "Female",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
};

const DOC_TYPE_LABELS: Record<TravelerDocument["type"], string> = {
  passport: "Passport",
  drivers_license: "Driver's Licence",
  visa: "Visa",
  other: "Other",
};

const INPUT_CLS =
  "w-full h-8 px-2.5 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(dob: string): number {
  const birth = new Date(dob + "T00:00:00");
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function initials(t: Traveler) {
  return `${t.firstName[0] ?? ""}${t.lastName[0] ?? ""}`.toUpperCase();
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewDocForm {
  type: TravelerDocument["type"];
  label: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  issuingAuthority: string;
  notes: string;
  scanFileName: string;
}

const EMPTY_DOC_FORM: NewDocForm = {
  type: "passport",
  label: "",
  number: "",
  issueDate: "",
  expiryDate: "",
  issuingCountry: "",
  issuingAuthority: "",
  notes: "",
  scanFileName: "",
};

function formFromDocument(doc: TravelerDocument): NewDocForm {
  return {
    type: doc.type,
    label: doc.label,
    number: doc.number ?? "",
    issueDate: doc.issueDate ?? "",
    expiryDate: doc.expiryDate ?? "",
    issuingCountry: doc.issuingCountry ?? "",
    issuingAuthority: doc.issuingAuthority ?? "",
    notes: doc.notes ?? "",
    scanFileName: doc.scanFileName ?? "",
  };
}

// ─── Doc add form ─────────────────────────────────────────────────────────────

function DocAddForm({
  mode,
  docForm,
  setDocForm,
  onSave,
  onCancel,
  title,
  saveLabel,
}: {
  mode: "upload" | "manual";
  docForm: NewDocForm;
  setDocForm: React.Dispatch<React.SetStateAction<NewDocForm>>;
  onSave: () => void;
  onCancel: () => void;
  title?: string;
  saveLabel?: string;
}) {
  const [fileRef, setFileRef] = useState<HTMLInputElement | null>(null);

  return (
    <div className="bg-white rounded-xl border border-[#C9A84C]/50 p-4 space-y-3">
      <p className="text-xs font-semibold text-[#1C2B4A]">
        {title ?? (mode === "upload" ? "Upload & Fill Document" : "Fill Document Manually")}
      </p>

      {/* Type + Label */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Type</label>
          <Select
            value={docForm.type}
            onValueChange={(v) => setDocForm((f) => ({ ...f, type: v as TravelerDocument["type"] }))}
          >
            <SelectTrigger className="h-8 text-sm border-[#E5E0D8] bg-white text-[#1C2B4A] w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(DOC_TYPE_LABELS) as TravelerDocument["type"][]).map((t) => (
                <SelectItem key={t} value={t}>{DOC_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Label</label>
          <input
            value={docForm.label}
            onChange={(e) => setDocForm((f) => ({ ...f, label: e.target.value }))}
            placeholder={DOC_TYPE_LABELS[docForm.type]}
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Upload drop zone — only in upload mode */}
      {mode === "upload" && (
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Scan / File</label>
          <div
            className="border-2 border-dashed border-[#D9D4CA] rounded-lg px-4 py-4 flex flex-col items-center gap-2 bg-[#FAFAF8] hover:border-[#C9A84C]/60 transition-colors"
            onClick={() => fileRef?.click()}
          >
            <Upload className="size-5 text-[#A09380]" />
            <p className="text-xs text-[#7A7265] text-center">
              {docForm.scanFileName
                ? <span className="font-medium text-[#1C2B4A]">{docForm.scanFileName}</span>
                : <><span className="font-medium text-[#1C2B4A]">Choose a file</span> or drag it here</>
              }
            </p>
            <p className="text-[10px] text-[#A09380]">PDF, JPG, PNG — max 20 MB</p>
            <input
              ref={(el) => setFileRef(el)}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setDocForm((f) => ({ ...f, scanFileName: file.name }));
              }}
            />
          </div>
        </div>
      )}

      {/* Number + Country */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Document Number</label>
          <input value={docForm.number} onChange={(e) => setDocForm((f) => ({ ...f, number: e.target.value }))} placeholder="e.g. GB1234567" className={INPUT_CLS} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Issuing Country</label>
          <input value={docForm.issuingCountry} onChange={(e) => setDocForm((f) => ({ ...f, issuingCountry: e.target.value }))} placeholder="e.g. United Kingdom" className={INPUT_CLS} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Issue Date</label>
          <input type="date" value={docForm.issueDate} onChange={(e) => setDocForm((f) => ({ ...f, issueDate: e.target.value }))} className={INPUT_CLS} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Expiry Date</label>
          <input type="date" value={docForm.expiryDate} onChange={(e) => setDocForm((f) => ({ ...f, expiryDate: e.target.value }))} className={INPUT_CLS} />
        </div>
      </div>

      {/* Authority + Notes */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Issuing Authority <span className="font-normal text-[#A09380]">(optional)</span></label>
          <input value={docForm.issuingAuthority} onChange={(e) => setDocForm((f) => ({ ...f, issuingAuthority: e.target.value }))} placeholder="e.g. HMPO" className={INPUT_CLS} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Notes <span className="font-normal text-[#A09380]">(optional)</span></label>
          <input value={docForm.notes} onChange={(e) => setDocForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any notes…" className={INPUT_CLS} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button type="button" size="sm" onClick={onSave} className="h-7 px-3 text-xs bg-[#1C2B4A] text-white hover:bg-[#243459]">
          {saveLabel ?? "Save Document"}
        </Button>
        <button type="button" onClick={onCancel} className="h-7 px-3 text-xs text-[#7A7265] hover:text-[#1C2B4A] border border-[#E5E0D8] rounded-lg hover:bg-[#F0EDE8] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function TravelerManager({
  travelers: initialTravelers,
  tripId: _tripId,
}: {
  travelers: Traveler[];
  tripId: string;
}) {
  const [travelers, setTravelers] = useState<Traveler[]>(initialTravelers);
  const [selectedId, setSelectedId] = useState<string | null>(initialTravelers[0]?.id ?? null);
  const [crmLinkedIds, setCrmLinkedIds] = useState<Set<string>>(
    new Set(initialTravelers.map((t) => t.id)),
  );

  const [addOpen, setAddOpen] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");

  const [crmOpen, setCrmOpen] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const [selectedCrmContact, setSelectedCrmContact] = useState<CrmContact | null>(null);

  const crmResults = mockCrmContacts.filter((c) => {
    const q = crmSearchQuery.toLowerCase();
    if (!q) return true;
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  const [addDocMode, setAddDocMode] = useState<"upload" | "manual" | null>(null);
  const [docForm, setDocForm] = useState<NewDocForm>(EMPTY_DOC_FORM);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [expandedDocIds, setExpandedDocIds] = useState<Set<string>>(new Set());

  const selected = travelers.find((t) => t.id === selectedId) ?? null;

  function importFromCrm() {
    if (!selectedCrmContact) return;
    const c = selectedCrmContact;
    const id = `crm-${c.id}`;
    const newTraveler: Traveler = {
      id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      nationality: c.nationality,
      notes: c.notes,
      documents: [],
    };
    setTravelers((prev) => [...prev, newTraveler]);
    setSelectedId(id);
    setCrmLinkedIds((prev) => new Set([...prev, id]));
    setCrmOpen(false);
    setCrmSearchQuery("");
    setSelectedCrmContact(null);
  }

  function addTraveler() {
    const f = newFirst.trim();
    const l = newLast.trim();
    if (!f || !l) return;
    const id = `traveler-${Date.now()}`;
    setTravelers((prev) => [...prev, { id, firstName: f, lastName: l, documents: [] }]);
    setSelectedId(id);
    setAddOpen(false);
    setNewFirst("");
    setNewLast("");
  }

  function updateSelected(patch: Partial<Traveler>) {
    if (!selectedId) return;
    setTravelers((prev) => prev.map((t) => (t.id === selectedId ? { ...t, ...patch } : t)));
  }

  function deleteTraveler(id: string) {
    const remaining = travelers.filter((t) => t.id !== id);
    setTravelers(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
  }

  function clearDocComposer() {
    setDocForm(EMPTY_DOC_FORM);
    setAddDocMode(null);
    setEditingDocId(null);
  }

  function saveDocument() {
    if (!selected) return;
    const label = docForm.label.trim() || DOC_TYPE_LABELS[docForm.type];
    if (editingDocId) {
      updateSelected({
        documents: selected.documents.map((d) =>
          d.id === editingDocId
            ? {
                ...d,
                type: docForm.type,
                label,
                number: docForm.number || undefined,
                issueDate: docForm.issueDate || undefined,
                expiryDate: docForm.expiryDate || undefined,
                issuingCountry: docForm.issuingCountry || undefined,
                issuingAuthority: docForm.issuingAuthority || undefined,
                notes: docForm.notes || undefined,
                scanFileName: docForm.scanFileName || undefined,
              }
            : d
        ),
      });
      clearDocComposer();
      return;
    }

    const newDoc: TravelerDocument = {
      id: `doc-${Date.now()}`,
      type: docForm.type,
      label,
      number: docForm.number || undefined,
      issueDate: docForm.issueDate || undefined,
      expiryDate: docForm.expiryDate || undefined,
      issuingCountry: docForm.issuingCountry || undefined,
      issuingAuthority: docForm.issuingAuthority || undefined,
      notes: docForm.notes || undefined,
      scanFileName: docForm.scanFileName || undefined,
    };
    updateSelected({ documents: [...selected.documents, newDoc] });
    clearDocComposer();
  }

  function deleteDocument(docId: string) {
    if (!selected) return;
    updateSelected({ documents: selected.documents.filter((d) => d.id !== docId) });
    if (editingDocId === docId) clearDocComposer();
  }

  function toggleDocExpanded(docId: string) {
    setExpandedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  }

  function startEditDocument(doc: TravelerDocument) {
    setEditingDocId(doc.id);
    setDocForm(formFromDocument(doc));
    setAddDocMode(doc.scanFileName ? "upload" : "manual");
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#F8F7F4]">

      {/* ── Traveler avatar row ── */}
      <div className="shrink-0 bg-white border-b border-[#E5E0D8] px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265] flex-1">
            Travelers
          </p>
          <button
            type="button"
            onClick={() => setCrmOpen(true)}
            className="flex items-center gap-1 h-6 px-2.5 rounded-lg text-[10px] font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 hover:bg-[#F0EDE8] transition-colors"
          >
            <Download className="size-3" />
            Import from CRM
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1 h-6 px-2.5 rounded-lg bg-[#1C2B4A] text-white text-[10px] font-medium hover:bg-[#243459] transition-colors"
          >
            <Plus className="size-3" />
            Add Traveler
          </button>
        </div>

        {travelers.length === 0 ? (
          <p className="text-xs text-[#A09380]">No travelers yet. Add one to get started.</p>
        ) : (
          <div className="flex items-start gap-4 flex-wrap">
            {travelers.map((t) => {
              const active = t.id === selectedId;
              const isCrmLinked = crmLinkedIds.has(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className="flex flex-col items-center gap-1.5 w-14 group"
                >
                  <div className="relative">
                    <div className={`size-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      active
                        ? "bg-[#1C2B4A] text-white ring-2 ring-[#C9A84C] ring-offset-2"
                        : "bg-[#F0EDE8] text-[#4F4A40] group-hover:bg-[#E8E3DC]"
                    }`}>
                      {initials(t)}
                    </div>
                    {isCrmLinked && (
                      <div className="absolute bottom-0 right-0 size-4 rounded-full bg-white border border-[#1C2B4A]/30 flex items-center justify-center">
                        <Building2 className="size-2.5 text-[#1C2B4A]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-[10px] leading-tight text-center w-full truncate ${
                    active ? "font-semibold text-[#1C2B4A]" : "text-[#7A7265]"
                  }`}>
                    {t.firstName}
                  </p>
                  <div className={`h-1 w-1 rounded-full ${active ? "bg-[#C9A84C]" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail panel ── */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-[#7A7265]">
            <User className="size-10 mb-3 opacity-20" />
            <p className="text-sm text-[#A09380]">Select a traveler above to view details</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">

            {/* Personal Information */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">
                  Personal Information
                </h3>
                <button
                  type="button"
                  onClick={() => deleteTraveler(selected.id)}
                  className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Trash2 className="size-3" />
                  Remove Traveler
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E0D8] p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">First Name</label>
                    <input value={selected.firstName} onChange={(e) => updateSelected({ firstName: e.target.value })} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Middle Name</label>
                    <input value={selected.middleName ?? ""} onChange={(e) => updateSelected({ middleName: e.target.value || undefined })} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Last Name</label>
                    <input value={selected.lastName} onChange={(e) => updateSelected({ lastName: e.target.value })} className={INPUT_CLS} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">
                      Date of Birth
                      {selected.dateOfBirth && (
                        <span className="ml-1 font-normal text-[#A09380]">(age {calcAge(selected.dateOfBirth)})</span>
                      )}
                    </label>
                    <input type="date" value={selected.dateOfBirth ?? ""} onChange={(e) => updateSelected({ dateOfBirth: e.target.value || undefined })} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Gender</label>
                    <Select value={selected.gender ?? ""} onValueChange={(v) => updateSelected({ gender: v ? (v as TravelerGender) : undefined })}>
                      <SelectTrigger className="h-8 text-sm border-[#E5E0D8] bg-white text-[#1C2B4A] w-full">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(GENDER_LABELS) as TravelerGender[]).map((g) => (
                          <SelectItem key={g} value={g}>{GENDER_LABELS[g]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Nationality</label>
                    <input value={selected.nationality ?? ""} onChange={(e) => updateSelected({ nationality: e.target.value || undefined })} placeholder="e.g. British" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Email</label>
                    <input type="email" value={selected.email ?? ""} onChange={(e) => updateSelected({ email: e.target.value || undefined })} placeholder="email@example.com" className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Phone</label>
                    <input type="tel" value={selected.phone ?? ""} onChange={(e) => updateSelected({ phone: e.target.value || undefined })} placeholder="+44 7700 000000" className={INPUT_CLS} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#7A7265] mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={selected.notes ?? ""}
                    onChange={(e) => updateSelected({ notes: e.target.value || undefined })}
                    placeholder="Dietary requirements, preferences, accessibility needs…"
                    className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>
              </div>
            </section>

            {/* CRM Status */}
            <section>
              {crmLinkedIds.has(selected.id) ? (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emerald-800">Linked to Salesforce</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCrmLinkedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(selected.id);
                        return next;
                      })
                    }
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 underline transition-colors shrink-0"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-[#F8F7F4] border border-[#E5E0D8] rounded-xl px-4 py-2.5">
                  <span className="size-2 rounded-full bg-[#C8C3BB] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#7A7265]">Not linked to CRM</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCrmLinkedIds((prev) => new Set([...prev, selected.id]))
                    }
                    className="h-6 px-2.5 text-[10px] font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 rounded-lg hover:bg-[#F0EDE8] transition-colors shrink-0"
                  >
                    Link to CRM
                  </button>
                </div>
              )}
            </section>

            {/* Documents */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#7A7265]">Documents</h3>
                {addDocMode === null && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingDocId(null); setDocForm(EMPTY_DOC_FORM); setAddDocMode("upload"); }}
                      className="flex items-center gap-1 text-[10px] font-medium text-[#1C2B4A] hover:bg-[#F0EDE8] px-2 py-1 rounded-lg transition-colors border border-[#E5E0D8]"
                    >
                      <Upload className="size-3" />
                      Upload + Fill
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingDocId(null); setDocForm(EMPTY_DOC_FORM); setAddDocMode("manual"); }}
                      className="flex items-center gap-1 text-[10px] font-medium text-[#1C2B4A] hover:bg-[#F0EDE8] px-2 py-1 rounded-lg transition-colors border border-[#E5E0D8]"
                    >
                      <PenLine className="size-3" />
                      Manual Fill
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {selected.documents.map((doc) => {
                  const expanded = expandedDocIds.has(doc.id);
                  return (
                    <div key={doc.id} className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden">
                      <div className="flex items-center gap-2.5 px-4 py-2.5">
                        <FileText className="size-3.5 text-[#A09380] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1C2B4A] truncate">{doc.label}</p>
                          <p className="text-[10px] text-[#7A7265]">
                            {DOC_TYPE_LABELS[doc.type]}
                            {doc.number && ` · ${doc.number}`}
                            {doc.expiryDate && ` · Exp ${doc.expiryDate}`}
                          </p>
                        </div>
                        <button type="button" onClick={() => toggleDocExpanded(doc.id)} className="text-[#A09380] hover:text-[#1C2B4A] p-1 rounded transition-colors">
                          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                        </button>
                        <button type="button" onClick={() => startEditDocument(doc)} className="text-[#A09380] hover:text-[#1C2B4A] p-1 rounded transition-colors">
                          <PenLine className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => deleteDocument(doc.id)} className="text-[#A09380] hover:text-red-500 p-1 rounded transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {expanded && (
                        <div className="border-t border-[#E5E0D8] px-4 py-3 bg-[#FAFAF8] grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                          {doc.issuingCountry && <div><span className="text-[#7A7265]">Issuing Country: </span><span className="text-[#1C2B4A]">{doc.issuingCountry}</span></div>}
                          {doc.issuingAuthority && <div><span className="text-[#7A7265]">Authority: </span><span className="text-[#1C2B4A]">{doc.issuingAuthority}</span></div>}
                          {doc.issueDate && <div><span className="text-[#7A7265]">Issued: </span><span className="text-[#1C2B4A]">{doc.issueDate}</span></div>}
                          {doc.expiryDate && <div><span className="text-[#7A7265]">Expires: </span><span className="text-[#1C2B4A]">{doc.expiryDate}</span></div>}
                          {doc.scanFileName && <div className="col-span-2"><span className="text-[#7A7265]">Scan: </span><span className="text-[#1C2B4A] font-medium">{doc.scanFileName}</span></div>}
                          {doc.notes && <div className="col-span-2"><span className="text-[#7A7265]">Notes: </span><span className="text-[#1C2B4A]">{doc.notes}</span></div>}
                        </div>
                      )}
                    </div>
                  );
                })}

                {selected.documents.length === 0 && addDocMode === null && (
                  <p className="text-xs text-[#A09380] py-1">No documents added yet.</p>
                )}

                {addDocMode !== null && (
                  <DocAddForm
                    mode={addDocMode}
                    docForm={docForm}
                    setDocForm={setDocForm}
                    onSave={saveDocument}
                    onCancel={clearDocComposer}
                    title={editingDocId ? "Edit Document" : undefined}
                    saveLabel={editingDocId ? "Update Document" : undefined}
                  />
                )}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* CRM Import Modal */}
      {crmOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-[#E5E0D8] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1C2B4A]">Import from CRM</h3>
                <p className="text-xs text-[#7A7265] mt-0.5">Search and select a contact to import as a traveler</p>
              </div>
              <button
                type="button"
                onClick={() => { setCrmOpen(false); setCrmSearchQuery(""); setSelectedCrmContact(null); }}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-[#F0EDE8] text-[#7A7265] hover:text-[#1C2B4A] transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#A09380]" />
                <input
                  autoFocus
                  value={crmSearchQuery}
                  onChange={(e) => setCrmSearchQuery(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto px-2 pb-2">
              {crmResults.length === 0 ? (
                <p className="text-xs text-[#A09380] px-3 py-4 text-center">No contacts found</p>
              ) : (
                crmResults.map((contact) => {
                  const isSelected = selectedCrmContact?.id === contact.id;
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setSelectedCrmContact(isSelected ? null : contact)}
                      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isSelected ? "bg-[#1C2B4A] text-white" : "hover:bg-[#F8F7F4]"
                      }`}
                    >
                      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#F0EDE8] text-[#4F4A40]"
                      }`}>
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-[#1C2B4A]"}`}>
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-[#7A7265]"}`}>
                          {contact.email ?? "—"}{contact.phone ? ` · ${contact.phone}` : ""}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-5 py-4 border-t border-[#E5E0D8] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { setCrmOpen(false); setCrmSearchQuery(""); setSelectedCrmContact(null); }}
                className="h-8 px-3 text-xs text-[#7A7265] border border-[#E5E0D8] rounded-lg hover:bg-[#F0EDE8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={importFromCrm}
                disabled={!selectedCrmContact}
                className="h-8 px-4 text-xs font-medium text-white bg-[#1C2B4A] hover:bg-[#243459] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Import Traveler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Traveler Dialog */}
      <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
        <AlertDialogContent className="!w-[min(420px,94vw)] !max-w-[min(420px,94vw)] p-0 overflow-hidden">
          <AlertDialogHeader className="px-5 pt-5 pb-3 border-b border-[#E5E0D8] text-left items-start">
            <AlertDialogTitle className="text-sm font-semibold text-[#1C2B4A]">Add Traveler</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the traveler&apos;s name. You can fill in further details after creating the record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-5 py-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#1C2B4A] mb-1">First Name</label>
              <input value={newFirst} onChange={(e) => setNewFirst(e.target.value)} placeholder="e.g. Sarah"
                className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1C2B4A] mb-1">Last Name</label>
              <input value={newLast} onChange={(e) => setNewLast(e.target.value)} placeholder="e.g. Thornton"
                className="w-full h-9 px-3 text-sm rounded-lg border border-[#E5E0D8] bg-white text-[#1C2B4A] placeholder:text-[#B8B09E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-colors" />
            </div>
          </div>
          <AlertDialogFooter className="px-5 py-4 border-t border-[#E5E0D8]">
            <AlertDialogCancel className="h-8 px-3 border-[#E5E0D8] text-[#7A7265]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 px-3 bg-[#1C2B4A] text-white hover:bg-[#243459]"
              onClick={addTraveler}
              disabled={!newFirst.trim() || !newLast.trim()}
            >
              Add Traveler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
