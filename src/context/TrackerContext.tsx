"use client";
import { TrackerId } from "@/lib/types/brand";
import { TrackerMeta, TrackerTags, TrackerYears } from "@/lib/types/dataTypes";
import { getAllData } from "@/idb/massImportHelper";
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
import { useGlobal } from "./GlobalContext";

interface TrackerContextType {
  trackerId: TrackerId;
  setTrackerId: Dispatch<SetStateAction<TrackerId>>;
  trackerMeta: TrackerMeta | null;
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>;
  trackerTags: TrackerTags | null;
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>;
  trackerYears: TrackerYears | null;
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>;
}

export const TrackerContext = createContext<TrackerContextType | undefined>(
  undefined,
);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { allTrackersMeta } = useGlobal();
  const [trackerId, setTrackerId] = useState<TrackerId>("" as TrackerId);
  const [trackerMeta, setTrackerMeta] = useState<TrackerMeta | null>(null);
  const [trackerTags, setTrackerTags] = useState<TrackerTags | null>(null);
  const [trackerYears, setTrackerYears] = useState<TrackerYears | null>(null);

  useEffect(() => {
    if (allTrackersMeta.length > 0 && !trackerId) {
      const activeTrackerId = allTrackersMeta[0].id;
      let cancelled = false;

      async function getDataFromDB() {
        try {
          const tracker = await getAllData(activeTrackerId);
          if (!cancelled && tracker.meta && tracker.tags && tracker.years) {
            setTrackerId(activeTrackerId);
            setTrackerMeta(tracker.meta);
            setTrackerTags(tracker.tags);
            setTrackerYears(tracker.years);
          }
        } catch (error) {
          console.error("Failed to load tracker data:", error);
        }
      }

      getDataFromDB();

      return () => {
        cancelled = true;
      };
    }
  }, [allTrackersMeta, trackerId]);

  const value = useMemo(
    () => ({
      trackerId,
      setTrackerId,
      trackerMeta,
      setTrackerMeta,
      trackerTags,
      setTrackerTags,
      trackerYears,
      setTrackerYears,
    }),
    [trackerId, trackerMeta, trackerTags, trackerYears],
  );

  return (
    <TrackerContext.Provider value={value}>
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
