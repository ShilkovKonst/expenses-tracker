"use client";
import { CURRENT_YEAR } from "@/lib/constants";
import { initEmptyMonths } from "@/lib/utils/monthHelper";
import { Locale } from "@/locales/locale";
import { FormDataType, TagType, YearFormType } from "@/types/formTypes";
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
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [formData, setFormData] = useState<FormDataType>({
    id: "default",
    years: [
      {
        id: CURRENT_YEAR,
        months: initEmptyMonths(),
        costs: 0,
        budget: 0,
        balance: 0,
      },
    ] as YearFormType[],
    totalCosts: 0,
  });
  const [selectedTag, setSelectedTag] = useState<TagType>({
    id: 0,
    type: "default",
    withBudget: false,
  });

  return (
    <GlobalContext.Provider
      value={{ locale, selectedTag, setSelectedTag, formData, setFormData }}
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
