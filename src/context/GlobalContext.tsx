/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { initEmptyTracker } from "@/lib/utils/initEmptyTracker";
import { Locale } from "@/locales/locale";
import { Data, DataType } from "@/types/formTypes";
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
  const [data, setData] = useState<Data>(initEmptyTracker("default"));
  const [selectedType, setSelectedType] = useState<DataType>({
    id: 0,
    title: "default",
  });
  const [operationTags, setOperationTags] = useState<Set<string>>(
    new Set(["card", "cash", "food", "clothes", "service"])
  );

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem(`${selectedType.title}`);
      setData(raw ? JSON.parse(raw) : initEmptyTracker(selectedType.title));
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

  useEffect(() => {
    console.log("data", data);
  }, [data]);

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
