/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import {
  TrackerName,
  MonthRecord,
  RecordTag,
  GlobalDataType,
} from "@/types/formTypes";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type RecordModalType = "crt" | "del" | "upd";

export type ModalBodyType = {
  type: RecordModalType;
  yearId: number;
  monthId: number;
  record: MonthRecord;
};
export type SettingsModalBodyType = {
  types: TrackerName[];
  tags: RecordTag[];
};

export type ModalTypeType =
  | ""
  | "recordFormBlock"
  | "mergeTrackerBlock"
  | "settingsBlock";

interface ModalContextType {
  isModal: boolean;
  setIsModal: Dispatch<SetStateAction<boolean>>;
  modalBody: ModalBodyType | GlobalDataType | null;
  setModalBody: Dispatch<SetStateAction<ModalBodyType | GlobalDataType | null>>;
  modalType: ModalTypeType;
  setModalType: Dispatch<SetStateAction<ModalTypeType>>;
  handleClear: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [modalBody, setModalBody] = useState<ModalBodyType | GlobalDataType | null>(null);
  const [modalType, setModalType] = useState<ModalTypeType>("");

  const handleClear = () => {
    isModal && setIsModal(false);
    modalBody && setModalBody(null);
    modalType && setModalType("");
  };

  return (
    <ModalContext.Provider
      value={{
        isModal,
        setIsModal,
        modalBody,
        setModalBody,
        modalType,
        setModalType,
        handleClear,
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
