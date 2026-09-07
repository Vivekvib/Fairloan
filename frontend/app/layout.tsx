import type { Metadata } from "next";
import "./globals.css";
import PrototypeBanner from "@/components/layout/PrototypeBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "FairLoan — Transparent Digital Lending Prototype",
  description:
    "An educational fintech prototype demonstrating transparent, responsible digital lending. Synthetic data only. Not a real lending product.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        {/* Persistent disclaimer — never removed, never collapsible on key screens */}
        <PrototypeBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
