"use client";
import { useEffect, useState } from "react";
import { requestPersistentStorage } from "@/idb/IDBManager";

export function useStoragePersistence() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    requestPersistentStorage().then((granted) => {
      if (!granted) setShowWarning(true);
    });
  }, []);

  return { showWarning, dismissWarning: () => setShowWarning(false) };
}
