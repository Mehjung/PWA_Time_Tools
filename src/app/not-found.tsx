// million-ignore
"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Leite zur Hauptseite zurück
    window.location.href = "/";
  }, []);

  return null;
}
