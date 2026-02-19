"use client";

import { usePathname } from "next/navigation";

export function TripBodyClient({
  threadList,
  children,
}: {
  threadList: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Show the thread-list side panel only when on a thread route
  const isThreadView = pathname.includes("/thread/");

  if (isThreadView) {
    return (
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {threadList}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  // Attachments (or any other future tab) — full width
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
