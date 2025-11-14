"use client";
import { TrackerName, MonthRecord, RecordTag } from "@/types/formTypes";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ModalBodyType = "crt" | "del" | "upd";

export type FormModalBodyType = {
  type: ModalBodyType;
  yearId: number;
  monthId: number;
  record: MonthRecord;
};
export type SettingsModalBodyType = {
  types: TrackerName[];
  tags: RecordTag[];
};

interface ModalContextType {
  isModal: boolean;
  setIsModal: Dispatch<SetStateAction<boolean>>;
  formModalBody: FormModalBodyType | null;
  setFormModalBody: Dispatch<SetStateAction<FormModalBodyType | null>>;
  isSettingsModal: boolean;
  setIsSettingsModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [formModalBody, setFormModalBody] = useState<FormModalBodyType | null>(
    null
  );
  const [isSettingsModal, setIsSettingsModal] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
        isModal,
        setIsModal,
        formModalBody,
        setFormModalBody,
        isSettingsModal,
        setIsSettingsModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
}
