"use client";

import { useEffect } from "react";

export default function PwaInit() {
  useEffect(() => {
    // Ensure manifest link is in <head> — Next.js streams metadata late,
    // so Chrome may not detect it for PWA installability.
    if (!document.head.querySelector('link[rel="manifest"]')) {
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.webmanifest";
      document.head.appendChild(link);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
