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
  const [selectedType, setSelectedType] = useState<TrackerType>({
    id: 0,
    title: "default",
  });
  const [recordTags, setRecordTags] = useState<RecordTag[]>([
    { title: "card", tracker: selectedType.title },
    { title: "cash", tracker: selectedType.title },
    { title: "food", tracker: selectedType.title },
    { title: "clothes", tracker: selectedType.title },
    { title: "service", tracker: selectedType.title },
  ]);

  useEffect(() => {
    if (localStorage) {
      let raw = localStorage.getItem(selectedType.title);
      const newTracker = initEmptyTracker(selectedType.title);
      if (!raw) {
        localStorage.setItem(selectedType.title, JSON.stringify(newTracker));
        setTracker(newTracker);
      } else setTracker(JSON.parse(raw));

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

  // useEffect(() => {
  //   if (localStorage) {
  //     localStorage.setItem("recordTags", JSON.stringify(recordTags));
  //   }
  // }, [recordTags]);

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

  // useEffect(() => {
  //   console.log("data", data);
  // }, [data]);

  return (
    <GlobalContext.Provider
      value={{
        locale,
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
