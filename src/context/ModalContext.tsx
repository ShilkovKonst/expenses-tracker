"use client";
import ModalRoot, { ModalMap } from "@/components/modals/ModalRoot";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ModalType = keyof ModalMap;

type ModalItem<T extends ModalType = ModalType> = {
  type: T;
  props: ModalMap[T];
};

type ModalContextValue = {
  modal: ModalItem | null;
  openModal: <T extends ModalType>(type: T, props: ModalMap[T]) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue>(null!);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalItem | null>(null);

  const openModal = useCallback(
    <T extends ModalType>(type: T, props: ModalMap[T]) => {
      setModal({ type, props });
    },
    [],
  );

  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo(
    () => ({ modal, openModal, closeModal }),
    [modal, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRoot />
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
