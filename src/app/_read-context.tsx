"use client";

import { createContext, useContext, useState, useCallback } from "react";

const DEFAULT_SIGNATURE = "Best regards,\nJustin Shieh\nSenior Travel Advisor · Envoy Travel";

export interface Template {
  id: string;
  name: string;
  body: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Booking Request",
    body: "Dear [Operator],\n\nI would like to make a booking enquiry for the following...\n\nKind regards,\nJustin Shieh",
  },
  {
    id: "t2",
    name: "Confirmation Follow-up",
    body: "Dear [Operator],\n\nI'm following up on our recent correspondence. Could you please confirm the booking details at your earliest convenience?\n\nKind regards,\nJustin Shieh",
  },
  {
    id: "t3",
    name: "Payment Request",
    body: "Dear [Operator],\n\nPlease find attached payment details for the above booking. Kindly confirm receipt.\n\nKind regards,\nJustin Shieh",
  },
  {
    id: "t4",
    name: "Final Itinerary Send",
    body: "Dear [Operator],\n\nPlease find the confirmed itinerary details below for your records. Do not hesitate to contact us with any questions.\n\nKind regards,\nJustin Shieh",
  },
];

interface AppContextValue {
  readThreadIds: Set<string>;
  markRead: (threadId: string) => void;
  signature: string;
  setSignature: (sig: string) => void;
  templates: Template[];
  addTemplate: (template: Omit<Template, "id">) => void;
  updateTemplate: (id: string, updates: Partial<Omit<Template, "id">>) => void;
  deleteTemplate: (id: string) => void;
}

const AppContext = createContext<AppContextValue>({
  readThreadIds: new Set(),
  markRead: () => {},
  signature: DEFAULT_SIGNATURE,
  setSignature: () => {},
  templates: DEFAULT_TEMPLATES,
  addTemplate: () => {},
  updateTemplate: () => {},
  deleteTemplate: () => {},
});

export function ReadProvider({ children }: { children: React.ReactNode }) {
  const [readThreadIds, setReadThreadIds] = useState<Set<string>>(new Set());
  const [signature, setSignature] = useState(DEFAULT_SIGNATURE);
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  const markRead = useCallback((threadId: string) => {
    setReadThreadIds((prev) => {
      if (prev.has(threadId)) return prev;
      const next = new Set(prev);
      next.add(threadId);
      return next;
    });
  }, []);

  const addTemplate = useCallback((template: Omit<Template, "id">) => {
    setTemplates((prev) => [...prev, { ...template, id: `t-${Date.now()}` }]);
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<Template, "id">>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ readThreadIds, markRead, signature, setSignature, templates, addTemplate, updateTemplate, deleteTemplate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useReadContext() {
  return useContext(AppContext);
}
