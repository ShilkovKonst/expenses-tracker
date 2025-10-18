"use client";
import { Operation } from "@/types/formTypes";
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
  operation: Operation;
};
export type FormConfirmType = {
  yearId: number;
  monthId: number;
  operation: Operation;
};

interface ModalContextType {
  isModal: boolean;
  setIsModal: Dispatch<SetStateAction<boolean>>;
  formModalBody: FormModalBodyType | null;
  setFormModalBody: Dispatch<SetStateAction<FormModalBodyType | null>>;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [formModalBody, setFormModalBody] = useState<FormModalBodyType | null>(
    null
  );

  return (
    <ModalContext.Provider
      value={{
        isModal,
        setIsModal,
        formModalBody,
        setFormModalBody,
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
