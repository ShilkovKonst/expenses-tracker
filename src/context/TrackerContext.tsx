"use client";
import { TRACKER_IDS } from "@/constants";
import { TrackerMeta, TrackerTags, TrackerYears } from "@/lib/types/dataTypes";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface TrackerContextType {
  trackerId: string;
  setTrackerId: Dispatch<SetStateAction<string>>;
  trackerMeta: TrackerMeta | null;
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>;
  trackerTags: TrackerTags | null;
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>;
  trackerYears: TrackerYears | null;
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>;
}

export const TrackerContext = createContext<TrackerContextType | undefined>(
  undefined
);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [trackerId, setTrackerId] = useState<string>("");
  const [trackerMeta, setTrackerMeta] = useState<TrackerMeta | null>(null);
  const [trackerTags, setTrackerTags] = useState<TrackerTags | null>(null);
  const [trackerYears, setTrackerYears] = useState<TrackerYears | null>(null);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem(TRACKER_IDS);
      if (raw) {
        const parsed: string[] = JSON.parse(raw) as string[];
        const activeTrackerId = parsed[0];
        let cancelled = false;

        async function getDataFromDB() {
          if (!cancelled) {
            await populateTrackerContex(
              activeTrackerId,
              setTrackerId,
              setTrackerMeta,
              setTrackerTags,
              setTrackerYears
            );
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
