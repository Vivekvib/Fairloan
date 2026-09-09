import type { Metadata } from "next";
import "./globals.css";
import PrototypeBanner from "@/components/layout/PrototypeBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "FairLoan — Transparent Digital Lending Prototype",
  description:
    "A responsible lending reference design built on RBI Digital Lending Guidelines. Synthetic data only. Not a real lending product.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50" suppressHydrationWarning>
        <PrototypeBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
