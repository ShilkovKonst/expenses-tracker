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
  useMemo,
  useState,
} from "react";

interface GlobalContextType {
  locale: Locale;
  allTrackersMeta: TrackerMeta[];
  setAllTrackersMeta: Dispatch<SetStateAction<TrackerMeta[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [allTrackersMeta, setAllTrackersMeta] = useState<TrackerMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const validMetas = await getAllMeta();
        if (!cancelled) {
          setAllTrackersMeta(validMetas);
        }
      } catch (error) {
        console.error("Failed to load trackers:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      locale,
      allTrackersMeta,
      setAllTrackersMeta,
      isLoading,
      setIsLoading,
    }),
    [locale, allTrackersMeta, isLoading],
  );

  return (
    <GlobalContext.Provider value={value}>
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
) {
  try {
    const validMetas = await getAllMeta();
    setAllTrackersMeta(validMetas);
  } catch (error) {
    console.error("Failed to load trackers:", error);
  } finally {
    setIsLoading(false);
  }
}
