"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type FlashType = "success" | "error" | "warning" | "info";

export type Flash = {
  id: string;
  type: FlashType;
  message: string | string[];
};

interface FlashContextType {
  flash: Flash[];
  addFlash: (type: FlashType, message: string | string[]) => void;
  closeFlash: (idx: string) => void;
}

export const FlashContext = createContext<FlashContextType | undefined>(
  undefined,
);

export function FlashProvider({ children }: { children: ReactNode }) {
  const [flash, setFlash] = useState<Flash[]>([]);

  const addFlash = useCallback(
    (type: FlashType, message: string | string[]) => {
      setFlash((prevFlash) => {
        return [
          ...prevFlash,
          { id: generateUniqueId(prevFlash), type, message },
        ];
      });
    },
    [],
  );

  const closeFlash = useCallback(
    (id: string) =>
      setFlash((prevFlash) => prevFlash.filter((f) => f.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({ flash, addFlash, closeFlash }),
    [flash, addFlash, closeFlash],
  );

  return (
    <FlashContext.Provider value={value}>{children}</FlashContext.Provider>
  );
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return ctx;
}

const generateUniqueId = (activeFlashes: Flash[]): string => {
  let id: string;
  let attempts = 0;

  const generateNewId = () =>
    Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

  do {
    id = generateNewId();
    attempts++;

    if (attempts > 10) {
      console.error("Failed to generate a unique flash ID after 10 attempts.");
      return generateNewId();
    }
  } while (activeFlashes.some((f) => f.id === id));

  return id;
};
