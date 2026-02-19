"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ReadContextValue {
  readThreadIds: Set<string>;
  markRead: (threadId: string) => void;
}

const ReadContext = createContext<ReadContextValue>({
  readThreadIds: new Set(),
  markRead: () => {},
});

export function ReadProvider({ children }: { children: React.ReactNode }) {
  const [readThreadIds, setReadThreadIds] = useState<Set<string>>(new Set());

  const markRead = useCallback((threadId: string) => {
    setReadThreadIds((prev) => {
      if (prev.has(threadId)) return prev;
      const next = new Set(prev);
      next.add(threadId);
      return next;
    });
  }, []);

  return (
    <ReadContext.Provider value={{ readThreadIds, markRead }}>
      {children}
    </ReadContext.Provider>
  );
}

export function useReadContext() {
  return useContext(ReadContext);
}
