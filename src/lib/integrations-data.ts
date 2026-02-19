export type IntegrationStatus = "connected" | "available" | "error";
export type IntegrationCategory = "messaging" | "crm" | "payments";

export interface IntegrationConfig {
  key: string;
  label: string;
  description: string;
  type: "boolean" | "string" | "textarea";
  value: boolean | string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  connectedAccount?: string;
  config: IntegrationConfig[];
}

export const integrations: Integration[] = [
  {
    id: "email",
    name: "Email (IMAP/SMTP)",
    description: "Send and receive emails via your connected mailbox",
    category: "messaging",
    status: "connected",
    connectedAccount: "justin.shieh@conciergetravel.com",
    config: [
      { key: "syncInbound", label: "Sync inbound mail", description: "Automatically sync incoming emails to threads", type: "boolean", value: true },
      { key: "sendFromAlias", label: "Send from alias", description: "Send emails using your configured alias address", type: "boolean", value: false },
      { key: "signatureEnabled", label: "Signature enabled", description: "Append your signature to outbound emails", type: "boolean", value: true },
      { key: "signature", label: "Email signature", description: "Appended to the bottom of every outbound email", type: "textarea", value: "Kind regards,\nJustin Shieh\nEnvoy Travel" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect with operators via WhatsApp Business API",
    category: "messaging",
    status: "connected",
    connectedAccount: "+44 7700 900000",
    config: [
      { key: "autoReply", label: "Auto-reply", description: "Send an automatic acknowledgement when a new message arrives", type: "boolean", value: false },
      { key: "readReceipts", label: "Read receipts", description: "Send read receipts to contacts when messages are viewed", type: "boolean", value: true },
      { key: "mediaAutoDownload", label: "Media auto-download", description: "Automatically download images and documents", type: "boolean", value: true },
      { key: "signature", label: "Message sign-off", description: "Short sign-off appended to outbound WhatsApp messages", type: "textarea", value: "– Justin @ Envoy Travel" },
    ],
  },
  {
    id: "sms",
    name: "SMS",
    description: "Send and receive SMS messages with operators",
    category: "messaging",
    status: "connected",
    connectedAccount: "+44 7700 900001",
    config: [
      { key: "deliveryReports", label: "Delivery reports", description: "Receive delivery confirmation for sent SMS messages", type: "boolean", value: true },
      { key: "unicode", label: "Unicode support", description: "Enable unicode characters in SMS (reduces message length)", type: "boolean", value: false },
      { key: "signature", label: "SMS sign-off", description: "Short sign-off appended to outbound SMS messages (160-char context)", type: "textarea", value: "– Justin, Envoy Travel" },
    ],
  },
  {
    id: "phone",
    name: "Phone & AI Calling",
    description: "Automated AI calling agent for operator communications",
    category: "messaging",
    status: "connected",
    connectedAccount: "Envoy AI Call Agent",
    config: [
      { key: "callRecording", label: "Call recording", description: "Record all calls for transcription and review", type: "boolean", value: true },
      { key: "transcription", label: "Auto-transcription", description: "Automatically transcribe call recordings to text", type: "boolean", value: true },
      { key: "voicemail", label: "Voicemail fallback", description: "Leave a voicemail message if the call is not answered", type: "boolean", value: false },
      { key: "signature", label: "Call closing", description: "Closing statement used in AI call scripts", type: "textarea", value: "Thank you for your time. We look forward to working with you." },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync client records and trips to Salesforce CRM",
    category: "crm",
    status: "connected",
    connectedAccount: "conciergetravel.my.salesforce.com",
    config: [
      { key: "syncContacts", label: "Sync contacts", description: "Automatically sync traveler records to Salesforce contacts", type: "boolean", value: true },
      { key: "syncDeals", label: "Sync trips as opportunities", description: "Create or update Salesforce opportunities for each trip", type: "boolean", value: true },
      { key: "pushNotes", label: "Push thread summaries", description: "Log thread summaries as activity notes on CRM records", type: "boolean", value: false },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect HubSpot contacts and deal pipeline",
    category: "crm",
    status: "available",
    config: [],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Manage deals and operator contacts in Pipedrive",
    category: "crm",
    status: "available",
    config: [],
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Sync traveler data and notes with Zoho CRM",
    category: "crm",
    status: "available",
    config: [],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage invoices via Stripe",
    category: "payments",
    status: "connected",
    connectedAccount: "acct_conciergetravel",
    config: [
      { key: "paymentLinks", label: "Payment links", description: "Generate shareable payment links for client invoices", type: "boolean", value: true },
      { key: "autoReceipts", label: "Auto receipts", description: "Automatically send receipts to clients on payment", type: "boolean", value: true },
      { key: "saveCards", label: "Save cards", description: "Allow clients to save card details for future payments", type: "boolean", value: false },
    ],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync invoices and expenses with QuickBooks Online",
    category: "payments",
    status: "available",
    config: [],
  },
  {
    id: "xero",
    name: "Xero",
    description: "Push invoices and reconcile payments with Xero",
    category: "payments",
    status: "available",
    config: [],
  },
];

export interface CrmContact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  notes?: string;
}

export const mockCrmContacts: CrmContact[] = [
  {
    id: "crm-001",
    firstName: "Sarah",
    lastName: "Pemberton",
    email: "sarah.pemberton@pembertongroup.co.uk",
    phone: "+44 7700 112233",
    nationality: "British",
    notes: "Prefers business class. Gluten-free dietary requirement.",
  },
  {
    id: "crm-002",
    firstName: "James",
    lastName: "Whitfield",
    email: "james.whitfield@wm-partners.co.uk",
    phone: "+44 7911 445566",
    nationality: "British",
    notes: "Frequent traveller. Prefers aisle seats. No shellfish.",
  },
  {
    id: "crm-003",
    firstName: "Charlotte",
    lastName: "Hargreaves",
    email: "charlotte.h@hargreavesfamily.com",
    phone: "+44 7800 778899",
    nationality: "British",
    notes: "Family trips with two children. Requires connecting rooms.",
  },
  {
    id: "crm-004",
    firstName: "Oliver",
    lastName: "Blackwood",
    email: "oliver.blackwood@blackwoodlegal.com",
    phone: "+44 7732 334455",
    nationality: "British",
    notes: "Solo business traveller. Prefers premium economy minimum.",
  },
  {
    id: "crm-005",
    firstName: "Emily",
    lastName: "Forsythe",
    email: "e.forsythe@forsythedesign.co.uk",
    phone: "+44 7801 556677",
    nationality: "British",
    notes: "Keen photographer. Requests early morning departures and eco lodges.",
  },
  {
    id: "crm-006",
    firstName: "William",
    lastName: "Stanhope",
    email: "william.stanhope@stanhopeinvest.com",
    phone: "+44 7920 889900",
    nationality: "British",
    notes: "Requires quiet rooms away from lifts. Vegetarian.",
  },
  {
    id: "crm-007",
    firstName: "Sophia",
    lastName: "Alderton",
    email: "sophia.alderton@gmail.com",
    phone: "+44 7770 223344",
    nationality: "British",
    notes: "Honeymoon and anniversary trips. Enjoys wine and fine dining.",
  },
  {
    id: "crm-008",
    firstName: "George",
    lastName: "Rawlings",
    email: "g.rawlings@rawlingscapital.co.uk",
    phone: "+44 7833 667788",
    nationality: "British",
    notes: "Adventure traveller. No dietary restrictions. Trekking experience.",
  },
];
