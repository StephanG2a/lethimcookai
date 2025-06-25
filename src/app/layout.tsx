import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetHimCookAI - Plateforme culinaire IA",
  description: "Mise en relation entre clients et prestataires du domaine culinaire avec assistance IA",
  keywords: ["cuisine", "chef", "traiteur", "restaurateur", "prestataires", "marketplace", "IA", "chat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-neutral-50`}
      >
        {children}
      </body>
    </html>
  );
}
