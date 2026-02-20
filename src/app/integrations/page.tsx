"use client";

import { useState } from "react";
import { Building2, FileText, Plug, RefreshCw } from "lucide-react";
import { integrations, type Integration, type IntegrationConfig } from "@/lib/integrations-data";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
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

// ─── Section ──────────────────────────────────────────────────────────────────

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
      <div className="divide-y divide-[#E5E0D8]">{children}</div>
    </div>
  );
}

// ─── Config Panel ──────────────────────────────────────────────────────────────

function ConfigPanel({
  configs,
  onSave,
  onClose,
}: {
  configs: IntegrationConfig[];
  onSave: (updated: IntegrationConfig[]) => void;
  onClose: () => void;
}) {
  const [localConfigs, setLocalConfigs] = useState<IntegrationConfig[]>(configs);

  function updateConfig(key: string, value: boolean | string) {
    setLocalConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  }

  return (
    <div className="px-6 py-4 bg-[#F8F7F4] border-t border-[#E5E0D8]">
      <div className="space-y-3 mb-4">
        {localConfigs.map((config) => (
          <div key={config.key}>
            {config.type === "textarea" ? (
              <div>
                <p className="text-sm font-medium text-[#1C2B4A] mb-0.5">{config.label}</p>
                <p className="text-xs text-[#7A7265] mb-1.5">{config.description}</p>
                <textarea
                  rows={3}
                  value={config.value as string}
                  onChange={(e) => updateConfig(config.key, e.target.value)}
                  className="w-full resize-none border border-[#E5E0D8] rounded-xl px-3 py-2 text-sm text-[#1C2B4A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] font-mono bg-white"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between select-none">
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-sm font-medium text-[#1C2B4A]">{config.label}</p>
                  <p className="text-xs text-[#7A7265] mt-0.5">{config.description}</p>
                </div>
                {config.type === "boolean" ? (
                  <Toggle
                    enabled={config.value as boolean}
                    onChange={(v) => updateConfig(config.key, v)}
                  />
                ) : (
                  <div className="text-sm text-[#1C2B4A] font-medium shrink-0">
                    {config.value as string}
                    <button
                      type="button"
                      className="ml-2 text-[10px] text-[#7A7265] hover:text-[#1C2B4A] underline transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { onSave(localConfigs); onClose(); }}
          className="h-7 px-3 text-xs text-white font-medium bg-[#1C2B4A] hover:bg-[#243459] rounded-lg transition-colors"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-7 px-3 text-xs text-[#7A7265] hover:text-[#1C2B4A] border border-[#E5E0D8] rounded-lg hover:bg-[#F0EDE8] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Integration Card ──────────────────────────────────────────────────────────

const PROVIDER_COLORS: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  whatsapp: "bg-green-100 text-green-700",
  sms: "bg-purple-100 text-purple-700",
  phone: "bg-amber-100 text-amber-700",
  salesforce: "bg-sky-100 text-sky-700",
  hubspot: "bg-orange-100 text-orange-700",
  travefy: "bg-red-100 text-red-700",
  tern: "bg-lime-100 text-lime-700",
  zoho: "bg-teal-100 text-teal-700",
  stripe: "bg-violet-100 text-violet-700",
  quickbooks: "bg-emerald-100 text-emerald-700",
  xero: "bg-cyan-100 text-cyan-700",
};

const PROVIDER_INITIALS: Record<string, string> = {
  email: "EM",
  whatsapp: "WA",
  sms: "SM",
  phone: "PH",
  salesforce: "SF",
  hubspot: "HS",
  travefy: "TF",
  tern: "TN",
  zoho: "ZO",
  stripe: "ST",
  quickbooks: "QB",
  xero: "XR",
};

function IntegrationCard({
  integration,
  configOpen,
  onToggleConfig,
  onUpdateConfigs,
  connectingId,
  onConnect,
  onDisconnect,
}: {
  integration: Integration;
  configOpen: boolean;
  onToggleConfig: () => void;
  onUpdateConfigs: (configs: IntegrationConfig[]) => void;
  connectingId: string | null;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}) {
  const isConnected = integration.status === "connected";
  const colorCls = PROVIDER_COLORS[integration.id] ?? "bg-[#F0EDE8] text-[#1C2B4A]";
  const initials = PROVIDER_INITIALS[integration.id] ?? integration.name.slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Icon box */}
        <div className={`size-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${colorCls}`}>
          {initials}
        </div>

        {/* Name + sublabel */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1C2B4A]">{integration.name}</p>
          <p className="text-xs text-[#7A7265] mt-0.5 truncate">
            {integration.connectedAccount ?? integration.description}
          </p>
        </div>

        {/* Status badge + action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <>
              <div className="flex items-center gap-1.5 mr-1">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs text-emerald-700 font-medium">Connected</span>
              </div>
              <button
                type="button"
                onClick={onToggleConfig}
                className="h-7 px-3 text-xs font-medium text-[#1C2B4A] border border-[#1C2B4A]/30 rounded-lg hover:bg-[#F0EDE8] transition-colors"
              >
                {configOpen ? "Close" : "Configure"}
              </button>
              <button
                type="button"
                onClick={() => onDisconnect(integration.id)}
                className="h-7 px-3 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 mr-1">
                <span className="size-1.5 rounded-full bg-[#C8C3BB] shrink-0" />
                <span className="text-xs text-[#7A7265] font-medium">Available</span>
              </div>
              {connectingId === integration.id ? (
                <span className="h-7 flex items-center gap-1.5 px-3 text-xs text-[#7A7265] italic">
                  <RefreshCw className="size-3 animate-spin" />
                  Coming soon
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onConnect(integration.id)}
                  className="h-7 px-3 text-xs font-medium text-white bg-[#1C2B4A] hover:bg-[#243459] rounded-lg transition-colors"
                >
                  Connect
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Config panel — inline expand */}
      {configOpen && integration.config.length > 0 && (
        <ConfigPanel
          configs={integration.config}
          onSave={onUpdateConfigs}
          onClose={onToggleConfig}
        />
      )}
    </div>
  );
}

// ─── Tab content ───────────────────────────────────────────────────────────────

type TabId = "messaging" | "crm" | "payments";

function TabContent({
  tab,
  integrationsList,
  openConfigId,
  onToggleConfig,
  onUpdateConfigs,
  connectingId,
  onConnect,
  onDisconnect,
}: {
  tab: TabId;
  integrationsList: Integration[];
  openConfigId: string | null;
  onToggleConfig: (id: string) => void;
  onUpdateConfigs: (id: string, configs: IntegrationConfig[]) => void;
  connectingId: string | null;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}) {
  const filtered = integrationsList.filter((i) => i.category === tab);
  const sectionIcon = tab === "messaging" ? Plug : tab === "crm" ? Building2 : FileText;
  const sectionTitle =
    tab === "messaging"
      ? "Messaging Providers"
      : tab === "crm"
      ? "CRM Connections"
      : "Payments & Invoicing";

  return (
    <Section icon={sectionIcon} title={sectionTitle}>
      {filtered.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          configOpen={openConfigId === integration.id}
          onToggleConfig={() => onToggleConfig(integration.id)}
          onUpdateConfigs={(configs) => onUpdateConfigs(integration.id, configs)}
          connectingId={connectingId}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      ))}
    </Section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "messaging", label: "Messaging", icon: Plug },
  { id: "crm", label: "CRM", icon: Building2 },
  { id: "payments", label: "Payments", icon: FileText },
];

export default function IntegrationsPage() {
  const [allIntegrations, setAllIntegrations] = useState<Integration[]>(integrations);
  const [openConfigId, setOpenConfigId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("messaging");

  function handleToggleConfig(id: string) {
    setOpenConfigId((prev) => (prev === id ? null : id));
  }

  function handleUpdateConfigs(id: string, configs: IntegrationConfig[]) {
    setAllIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, config: configs } : i))
    );
  }

  function handleConnect(id: string) {
    setConnectingId(id);
    setTimeout(() => setConnectingId(null), 2500);
  }

  function handleDisconnect(id: string) {
    setAllIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "available", connectedAccount: undefined } : i
      )
    );
    setOpenConfigId((prev) => (prev === id ? null : prev));
  }

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    setOpenConfigId(null);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E5E0D8] bg-white shrink-0 select-none">
        <h1 className="text-xl font-semibold text-[#1C2B4A]">Integrations</h1>
        <p className="text-sm text-[#7A7265] mt-1">
          Connect your tools and communication channels
        </p>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 flex gap-8 items-start">
          {/* ── Left tab nav ────────────────────────────────────────────────── */}
          <nav className="w-44 shrink-0 sticky top-6">
            <ul className="space-y-0.5">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => handleTabChange(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        isActive
                          ? "text-[#1C2B4A] font-semibold bg-[#F0EDE8]"
                          : "text-[#7A7265] hover:text-[#1C2B4A] hover:bg-[#F0EDE8]"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Tab content ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <TabContent
              tab={activeTab}
              integrationsList={allIntegrations}
              openConfigId={openConfigId}
              onToggleConfig={handleToggleConfig}
              onUpdateConfigs={handleUpdateConfigs}
              connectingId={connectingId}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
