/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { initEmptyTracker } from "@/lib/utils/initEmptyTracker";
import { Locale } from "@/locales/locale";
import { RecordTag, Tracker, TrackerType } from "@/types/formTypes";
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
  trackerTypes: TrackerType[];
  setTrackerTypes: Dispatch<SetStateAction<TrackerType[]>>;
  selectedType: TrackerType;
  setSelectedType: Dispatch<SetStateAction<TrackerType>>;
  tracker: Tracker;
  setTracker: Dispatch<SetStateAction<Tracker>>;
  recordTags: RecordTag[];
  setRecordTags: Dispatch<SetStateAction<RecordTag[]>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [tracker, setTracker] = useState<Tracker>(initEmptyTracker("default"));
  const [trackerTypes, setTrackerTypes] = useState<TrackerType[]>([]);
  const [selectedType, setSelectedType] = useState<TrackerType>({
    id: 0,
    title: "default",
  });
  const [recordTags, setRecordTags] = useState<RecordTag[]>([
    { tracker: "default", title: "card" },
    { tracker: "default", title: "cash" },
    { tracker: "default", title: "food" },
    { tracker: "default", title: "clothes" },
    { tracker: "default", title: "service" },
  ]);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem("recordTags");
      if (!raw) {
        localStorage.setItem("recordTags", JSON.stringify(recordTags));
      } else {
        setRecordTags(JSON.parse(raw));
      }
    }
  }, []);

  useEffect(() => {
    const type = trackerTypes.some((t) => t.title === selectedType.title);
    console.log(trackerTypes)
    if (trackerTypes.length > 0 && !type) {
      setSelectedType(trackerTypes[0]);
    }
  }, [trackerTypes]);

  useEffect(() => {
    if (localStorage) {
      let raw = localStorage.getItem(selectedType.title);
      if (!raw) {
        localStorage.setItem(selectedType.title, JSON.stringify(tracker));
      } else {
        const trackerParsed = JSON.parse(raw) as Tracker;
        setTracker(trackerParsed);
      }

      raw = localStorage.getItem("trackerTypes");
      if (!raw) {
        localStorage.setItem(
          "trackerTypes",
          JSON.stringify({ id: 0, title: "default" })
        );
      } else {
        const trackerTypes = JSON.parse(raw) as TrackerType[];
        if (!trackerTypes.some((t) => t.title === selectedType.title)) {
          localStorage.setItem(
            "trackerTypes",
            JSON.stringify([...trackerTypes, selectedType])
          );
        }
      }
    }
  }, [selectedType]);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        trackerTypes,
        setTrackerTypes,
        selectedType,
        setSelectedType,
        tracker,
        setTracker,
        recordTags,
        setRecordTags,
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
