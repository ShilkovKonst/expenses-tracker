"use client";
import { Locale } from "@/locales/locale";
import { TagType } from "@/types/formTypes";
import { useParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface GlobalContextType {
  locale: Locale;
  selectedTag: TagType;
  setSelectedTag: Dispatch<SetStateAction<TagType>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [selectedTag, setSelectedTag] = useState<TagType>({
    id: 0,
    type: "default",
    withBudget: false,
  });

  return (
    <GlobalContext.Provider value={{ locale, selectedTag, setSelectedTag }}>
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
