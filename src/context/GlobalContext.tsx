"use client";
import { TRACKER_IDS } from "@/constants";
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
  trackerIds: string[];
  setTrackerIds: Dispatch<SetStateAction<string[]>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [trackerIds, setTrackerIds] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem(TRACKER_IDS);
      if (raw) {
        setTrackerIds(JSON.parse(raw));
      }
    }
  }, []);

  // useEffect(() => {
  //   console.log(trackerIds);
  // }, [trackerIds]);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        trackerIds,
        setTrackerIds,
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
