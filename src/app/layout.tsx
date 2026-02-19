import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./_sidebar";
import { CommandPalette } from "./_command-palette";
import { ReadProvider } from "./_read-context";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Envoy — AI Travel Communications",
  description: "AI communication assistant for luxury travel advisors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        <ReadProvider>
          <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7F4]">
            <Sidebar />
            <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
              {children}
            </main>
          </div>
          <CommandPalette />
        </ReadProvider>
      </body>
    </html>
  );
}
