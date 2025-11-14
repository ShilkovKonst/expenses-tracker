"use client";
import { GlobalDataType, Year } from "@/types/formTypes";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type TrackerYears = Year[] | null;
export type TrackerMeta = {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
} | null;
export type TrackerTags = Record<string, string> | null;

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

  // useEffect(() => {
  //   if (localStorage) {
  //     const raw = localStorage.getItem("trackerIds");
  //     if (raw) {
  //       const parsed = JSON.parse(raw) as string[];
  //       const activeTrackerId = parsed[0];
  //       const rawTracker = localStorage.getItem(activeTrackerId);
  //       if (rawTracker) {
  //         const parsedTracker = JSON.parse(rawTracker) as GlobalDataType;
  //         setTrackerId(parsedTracker.id);
  //         setTrackerMeta({ ...parsedTracker.meta });
  //         setTrackerTags({ ...parsedTracker.tagsPool });
  //         setTrackerYears({ ...parsedTracker.years });
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    console.log(
      "id",
      trackerId,
      "meta",
      trackerMeta,
      "tags",
      trackerTags,
      "years",
      trackerYears
    );
    if (
      localStorage &&
      trackerId &&
      trackerMeta &&
      trackerTags &&
      trackerYears
    ) {
      const raw = localStorage.getItem(trackerId);
      if (raw) {
        const parsedTracker: GlobalDataType = JSON.parse(raw);
        const updTracker: GlobalDataType = {
          ...parsedTracker,
          meta: trackerMeta,
          tagsPool: trackerTags,
          years: trackerYears,
          totalAmount: trackerYears.reduce((acc, y) => acc + y.totalAmount, 0),
        };
        localStorage.setItem(trackerId, JSON.stringify(updTracker));
      } else {
        const tracker: GlobalDataType = {
          id: trackerId,
          meta: trackerMeta,
          tagsPool: trackerTags,
          years: trackerYears,
          totalAmount: trackerYears.reduce((acc, y) => acc + y.totalAmount, 0),
        };
        localStorage.setItem(trackerId, JSON.stringify(tracker));
      }
    }
  }, [trackerId, trackerMeta, trackerTags, trackerYears]);

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
