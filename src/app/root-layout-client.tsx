// src/components/layout/root-layout-client.tsx
"use client";
// million-ignore
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClientLayout } from "@/components/layout/client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function RootLayoutClient() {
  return (
    <html lang="de" className="h-full select-none">
      <head>
        <link
          rel="apple-touch-icon"
          href="/PWA_Time_Tools/icons/icon-192x192.png"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full select-none`}
      >
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="beforeInteractive"
          />
        )}
        <ClientLayout />
      </body>
    </html>
  );
}
