"use client";
import { getAllMeta } from "@/idb/IDBManager";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { Locale } from "@/locales/locale";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalContextType {
  locale: Locale;
  allTrackersMeta: TrackerMeta[];
  setAllTrackersMeta: Dispatch<SetStateAction<TrackerMeta[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isCharts: boolean;
  setIsCharts: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [allTrackersMeta, setAllTrackersMeta] = useState<TrackerMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCharts, setIsCharts] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadTrackers(setAllTrackersMeta, setIsLoading, cancelled);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        allTrackersMeta,
        setAllTrackersMeta,
        isLoading,
        setIsLoading,
        isCharts,
        setIsCharts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return ctx;
}

export async function loadTrackers(
  setAllTrackersMeta: Dispatch<SetStateAction<TrackerMeta[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  cancelled?: boolean,
) {
  if (cancelled) return;
  try {
    const validMetas = await getAllMeta();
    setAllTrackersMeta(validMetas);
  } catch (error) {
    console.error("Failed to load trackers:", error);
  } finally {
    setIsLoading(false);
  }
}
