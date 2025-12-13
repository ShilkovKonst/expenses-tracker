"use client";
import { getMetadata } from "@/idb/CRUD/metaCRUD";
import { TrackerId } from "@/lib/types/brand";
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
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [allTrackersMeta, setAllTrackersMeta] = useState<TrackerMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (localStorage) {
      loadTrackers(setAllTrackersMeta, setIsLoading, cancelled);
    }
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
  cancelled?: boolean
) {
  if (cancelled) return;
  try {
    const databases = await indexedDB.databases();
    const metadataPromises = databases
      .filter((db) => db.name)
      .map(async (db) => {
        try {
          const meta = await getMetadata(db.name as TrackerId);
          if (meta && (!("id" in meta) || !("title" in meta))) {
            return {
              ...(meta as TrackerMeta),
              id: db.name as TrackerId,
              title: db.name,
            };
          }
          return meta;
        } catch (error) {
          console.warn(`Failed to load metadata for ${db.name}:`, error);
          return undefined;
        }
      });
    const results = await Promise.all(metadataPromises);
    console.log(results);
    const validMeta = results.filter(
      (meta): meta is TrackerMeta => meta !== undefined
    );
    setAllTrackersMeta(validMeta);
  } catch (error) {
    console.error("Failed to load trackers:", error);
  } finally {
    setIsLoading(false);
  }
}
