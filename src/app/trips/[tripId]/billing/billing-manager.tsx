"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type AttachmentWithContext, type Thread } from "@/lib/data";
import { Building2, FileText, RefreshCw } from "lucide-react";

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function TagPill({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    invoice: "bg-violet-50 text-violet-700 border-violet-200",
    receipt: "bg-emerald-50 text-emerald-700 border-emerald-200",
    confirmation: "bg-sky-50 text-sky-700 border-sky-200",
    document: "bg-[#F0EDE8] text-[#7A7265] border-[#E5E0D8]",
  };
  const cls = colors[tag] ?? colors.document;
  return (
    <span className={`inline-flex items-center h-4 px-1.5 rounded text-[10px] font-medium border ${cls}`}>
      {tag}
    </span>
  );
}

export function BillingManager({
  tripId,
  invoices,
  threads: _threads,
}: {
  tripId: string;
  invoices: AttachmentWithContext[];
  threads: Thread[];
}) {
  const [syncedToCrm, setSyncedToCrm] = useState<string | null>(null);
  const [exportedToInvoicing, setExportedToInvoicing] = useState<string | null>(null);
  const [headerSyncedToCrm, setHeaderSyncedToCrm] = useState(false);
  const [headerExported, setHeaderExported] = useState(false);

  useEffect(() => {
    if (!syncedToCrm) return;
    const t = setTimeout(() => setSyncedToCrm(null), 2500);
    return () => clearTimeout(t);
  }, [syncedToCrm]);

  useEffect(() => {
    if (!exportedToInvoicing) return;
    const t = setTimeout(() => setExportedToInvoicing(null), 2500);
    return () => clearTimeout(t);
  }, [exportedToInvoicing]);

  useEffect(() => {
    if (!headerSyncedToCrm) return;
    const t = setTimeout(() => setHeaderSyncedToCrm(false), 2500);
    return () => clearTimeout(t);
  }, [headerSyncedToCrm]);

  useEffect(() => {
    if (!headerExported) return;
    const t = setTimeout(() => setHeaderExported(false), 2500);
    return () => clearTimeout(t);
  }, [headerExported]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F7F4]">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#1C2B4A]">Billing</h2>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Invoice documents from trip threads
            </p>
          </div>
          <div className="flex items-center gap-2">
            {headerSyncedToCrm ? (
              <span className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                <RefreshCw className="size-3" />
                Synced to CRM
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setHeaderSyncedToCrm(true)}
                className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 rounded-lg hover:bg-[#F0EDE8] transition-colors"
              >
                <Building2 className="size-3.5" />
                Sync all to CRM
              </button>
            )}
            {headerExported ? (
              <span className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                <RefreshCw className="size-3" />
                Exported
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setHeaderExported(true)}
                className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-[#1C2B4A] hover:bg-[#243459] rounded-lg transition-colors"
              >
                <FileText className="size-3.5" />
                Export to Invoicing
              </button>
            )}
          </div>
        </div>

        {/* Invoice list */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] px-6 py-12 text-center">
            <FileText className="size-8 mx-auto text-[#C8C3BB] mb-3" />
            <p className="text-sm text-[#7A7265]">No invoice documents found.</p>
            <p className="text-xs text-[#A09380] mt-1">
              Invoice PDFs from your threads will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden divide-y divide-[#E5E0D8]">
            {invoices.map((invoice) => {
              const isSynced = syncedToCrm === invoice.id;
              const isExported = exportedToInvoicing === invoice.id;
              const primaryTag = invoice.tags?.find((t) =>
                ["invoice", "receipt", "confirmation"].includes(t),
              ) ?? invoice.tags?.[0];

              return (
                <div key={invoice.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    {/* PDF icon */}
                    <div className="size-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="size-4 text-red-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-[#1C2B4A] truncate">{invoice.name}</p>
                        {primaryTag && <TagPill tag={primaryTag} />}
                      </div>
                      <p className="text-[11px] text-[#7A7265] mt-0.5">{invoice.size}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-[11px] text-[#A09380]">
                          From:{" "}
                          <Link
                            href={`/trips/${tripId}/thread/${invoice.threadId}`}
                            className="text-[#1C2B4A] font-medium hover:underline"
                          >
                            {invoice.operatorName}
                          </Link>
                        </span>
                        <span className="text-[11px] text-[#A09380]">
                          {formatTimestamp(invoice.messageTimestamp)}
                        </span>
                      </div>

                      {/* Per-invoice actions */}
                      <div className="flex items-center gap-2 mt-2.5">
                        {isSynced ? (
                          <span className="flex items-center gap-1 h-6 px-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <RefreshCw className="size-2.5" />
                            Synced to CRM
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSyncedToCrm(invoice.id)}
                            className="flex items-center gap-1 h-6 px-2 text-[10px] font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 rounded-lg hover:bg-[#F0EDE8] transition-colors"
                          >
                            <Building2 className="size-2.5" />
                            Sync to CRM
                          </button>
                        )}
                        {isExported ? (
                          <span className="flex items-center gap-1 h-6 px-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <RefreshCw className="size-2.5" />
                            Sent to QuickBooks
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setExportedToInvoicing(invoice.id)}
                            className="flex items-center gap-1 h-6 px-2 text-[10px] font-medium text-[#1C2B4A] border border-[#E5E0D8] rounded-lg hover:bg-[#F0EDE8] transition-colors"
                          >
                            <FileText className="size-2.5" />
                            Send to QuickBooks
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
