"use client";
import { TRACKER_IDS } from "@/constants";
import { getMetadata } from "@/idb/metaCRUD";
import { getAllRecords } from "@/idb/recordsCRUD";
import { getAllTags } from "@/idb/tagsCRUD";
import { MetadataType, Year } from "@/lib/types/dataTypes";
import { populateYears } from "@/lib/utils/yearsTransformer";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type TrackerYears = Record<number, Year> | null;
export type TrackerMeta = MetadataType | null;
export type TrackerTags = Record<number, string> | null;

interface TrackerContextType {
  trackerId: string;
  setTrackerId: Dispatch<SetStateAction<string>>;
  trackerMeta: TrackerMeta;
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>;
  trackerTags: TrackerTags;
  setTrackerTags: Dispatch<SetStateAction<TrackerTags>>;
  trackerYears: TrackerYears;
  setTrackerYears: Dispatch<SetStateAction<TrackerYears>>;
}

export const TrackerContext = createContext<TrackerContextType | undefined>(
  undefined
);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [trackerId, setTrackerId] = useState<string>("");
  const [trackerMeta, setTrackerMeta] = useState<TrackerMeta>(null);
  const [trackerTags, setTrackerTags] = useState<TrackerTags>(null);
  const [trackerYears, setTrackerYears] = useState<TrackerYears>(null);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem(TRACKER_IDS);
      if (raw) {
        const parsed: string[] = JSON.parse(raw) as string[];
        const activeTrackerId = parsed[0];
        let cancelled = false;
        async function getDataFromDB() {
          if (!cancelled) {
            const meta = await getMetadata(activeTrackerId);
            const tags = await getAllTags(activeTrackerId);
            const records = await getAllRecords(activeTrackerId);

            if (meta && tags && records) {
              const years = populateYears(records);
              setTrackerId(activeTrackerId);
              setTrackerMeta(meta);
              setTrackerTags(tags);
              setTrackerYears(years);
            }
          }
        }

        getDataFromDB();

        return () => {
          cancelled = true;
        };
      }
    }
  }, []);

  return (
    <TrackerContext.Provider
      value={{
        trackerId,
        setTrackerId,
        trackerMeta,
        setTrackerMeta,
        trackerTags,
        setTrackerTags,
        trackerYears,
        setTrackerYears,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return ctx;
}
