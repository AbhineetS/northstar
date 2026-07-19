import type { Metadata } from "next";
import { Toaster } from "sonner";
import { OfflineDetector } from "@/components/ui/OfflineDetector";
import { RoleSwitcher } from "@/components/ui/RoleSwitcher";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Pulse AI OS",
  description: "FIFA World Cup 2026 Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.variable}`}>
      <body className="min-h-full flex flex-col font-sans relative text-neutral-900 bg-white overflow-hidden selection:bg-primary/20 selection:text-primary">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <OfflineDetector />
        
        {/* Subtle dynamic breathing background for light mode (120fps optimized) */}
        <div className="fixed inset-0 z-[-2] bg-white" />
        <div className="fixed inset-0 z-[-1] opacity-50 pointer-events-none overflow-hidden transform-gpu">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full animate-blob bg-[radial-gradient(circle,rgba(24,24,27,0.05)_0%,transparent_70%)]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full animate-blob animation-delay-2000 bg-[radial-gradient(circle,rgba(30,41,59,0.05)_0%,transparent_70%)]" />
          <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full animate-blob animation-delay-4000 bg-[radial-gradient(circle,rgba(51,65,85,0.05)_0%,transparent_70%)]" />
        </div>
        
        {children}
        
        <RoleSwitcher />
        <Toaster theme="light" position="top-center" />
      </body>
    </html>
  );
}
