// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootLayoutClient } from "./root-layout-client";

const APP_NAME = "PWA Time Tools";
const APP_DEFAULT_TITLE = "PWA Time Tools";
const APP_TITLE_TEMPLATE = "%s - PWA Time Tools";
const APP_DESCRIPTION = "Ihre All-in-One Zeitmanagement-Lösung";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/PWA_Time_Tools/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout() {
  return <RootLayoutClient />;
}
