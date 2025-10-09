"use client"
import { Locale } from "@/locales/locale";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

interface GlobalContextType {
  locale: Locale;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();

  return (
    <GlobalContext.Provider value={{ locale }}>
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
