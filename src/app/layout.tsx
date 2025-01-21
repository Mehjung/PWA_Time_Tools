import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PWA Time Tools",
  description: "Ihre All-in-One Zeitmanagement-Lösung",
};

export default function RootLayout() {
  return (
    <html lang="de" className="h-full select-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full select-none`}
      >
        <ClientLayout />
      </body>
    </html>
  );
}
