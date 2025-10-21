"use client";
import { TrackerType, Record, RecordTag } from "@/types/formTypes";
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
  record: Record;
};
export type SettingsModalBodyType = {
  types: TrackerType[];
  tags: RecordTag[];
};

interface ModalContextType {
  isModal: boolean;
  setIsModal: Dispatch<SetStateAction<boolean>>;
  formModalBody: FormModalBodyType | null;
  setFormModalBody: Dispatch<SetStateAction<FormModalBodyType | null>>;
  isSettingsModal: boolean;
  setIsSettingsModal: Dispatch<SetStateAction<boolean>>;
  settingsModalBody: SettingsModalBodyType | null;
  setSettingsModalBody: Dispatch<SetStateAction<SettingsModalBodyType | null>>;
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
  const [settingsModalBody, setSettingsModalBody] =
    useState<SettingsModalBodyType | null>(null);

  return (
    <ModalContext.Provider
      value={{
        isModal,
        setIsModal,
        formModalBody,
        setFormModalBody,
        isSettingsModal,
        setIsSettingsModal,
        settingsModalBody,
        setSettingsModalBody,
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
