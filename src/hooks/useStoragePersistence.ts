"use client";
import { useEffect, useState } from "react";
import { requestPersistentStorage } from "@/idb/IDBManager";

export function useStoragePersistence() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    async function check() {
      // If already persisted, no warning needed
      if (navigator.storage && navigator.storage.persisted) {
        const already = await navigator.storage.persisted();
        if (already) return;
      }

      const granted = await requestPersistentStorage();
      if (!granted) setShowWarning(true);
    }
    check();
  }, []);

  return { showWarning, dismissWarning: () => setShowWarning(false) };
}
