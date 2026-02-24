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

type ModalActionsContextValue = {
  openModal: <T extends ModalType>(type: T, props: ModalMap[T]) => void;
  closeModal: () => void;
};

type ModalStateContextValue = {
  modal: ModalItem | null;
};

const ModalActionsContext = createContext<ModalActionsContextValue>(null!);
const ModalStateContext = createContext<ModalStateContextValue>(null!);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalItem | null>(null);

  const openModal = useCallback(
    <T extends ModalType>(type: T, props: ModalMap[T]) => {
      setModal({ type, props });
    },
    [],
  );

  const closeModal = useCallback(() => setModal(null), []);

  // stable — never changes because openModal and closeModal are stable useCallbacks
  const actionsValue = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  // changes only when modal opens or closes
  const stateValue = useMemo(() => ({ modal }), [modal]);

  return (
    <ModalActionsContext.Provider value={actionsValue}>
      <ModalStateContext.Provider value={stateValue}>
        {children}
        <ModalRoot />
      </ModalStateContext.Provider>
    </ModalActionsContext.Provider>
  );
}

/** Full hook — use only in ModalRoot or when you need to READ modal state. */
export function useModal() {
  const actions = useContext(ModalActionsContext);
  const state = useContext(ModalStateContext);
  if (!actions || !state) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return { ...actions, ...state };
}

/**
 * Lightweight hook that returns only openModal / closeModal.
 * Subscribers NEVER re-render when a modal opens or closes —
 * use this in every component that only calls openModal/closeModal.
 */
export function useModalActions() {
  const ctx = useContext(ModalActionsContext);
  if (!ctx) {
    throw new Error("useModalActions must be used within a ModalProvider");
  }
  return ctx;
}
