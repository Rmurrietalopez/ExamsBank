import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./exam/providers"; // client wrapper with ReadingExamProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reading Exams",
  description: "Reading exam flow",
};

export default function ReadingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ⛔️ Do NOT render <html> or <body> here — only in app/layout.tsx
  return (
    <Providers>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
    </Providers>
  );
}

