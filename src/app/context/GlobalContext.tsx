/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { CURRENT_YEAR } from "@/lib/constants";
import { initEmptyMonths } from "@/lib/utils/monthHelper";
import { Locale } from "@/locales/locale";
import { Data, DataType, Year } from "@/types/formTypes";
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
  selectedType: DataType;
  setSelectedType: Dispatch<SetStateAction<DataType>>;
  data: Data;
  setData: Dispatch<SetStateAction<Data>>;
  operationTags: Set<string>;
  setOperationTags: Dispatch<SetStateAction<Set<string>>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: Locale }>();
  const [data, setData] = useState<Data>({
    id: "default",
    years: [
      {
        id: CURRENT_YEAR,
        months: initEmptyMonths(),
        totalAmount: 0,
      },
    ] as Year[],
    totalAmount: 0,
  });
  const [selectedType, setSelectedType] = useState<DataType>({
    id: 0,
    title: "default",
  });
  const [operationTags, setOperationTags] = useState<Set<string>>(
    new Set([
      "online",
      "offline",
      "bank transfer",
      "card",
      "cash",
      "food",
      "alcohol",
      "goods",
      "service",
    ])
  );

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem(`${selectedType.title}`);
      setData(raw ? JSON.parse(raw) : data);
    }
  }, [selectedType]);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem("operationTags");
      if (!raw || !Array.isArray(JSON.parse(raw))) {
        localStorage.setItem(
          "operationTags",
          JSON.stringify(operationTags.values().toArray())
        );
      } else {
        setOperationTags(new Set(JSON.parse(raw)));
      }
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        selectedType,
        setSelectedType,
        data,
        setData,
        operationTags,
        setOperationTags,
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
