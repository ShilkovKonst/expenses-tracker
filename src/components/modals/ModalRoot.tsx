"use client";
import { ModalType, useModal } from "@/context/ModalContext";
import { Tracker, MonthRecord, TrackerMeta } from "@/lib/types/dataTypes";
import RecordModal from "./record/RecordModal";
import DeleteModal from "./delete/DeleteModal";
import SettingsModal from "./settings/SettingsModal";
import TrackerModal from "./tracker/TrackerModal";
import ShareModal from "./share/ShareModal";

export type ModalMap = {
  record: {
    record: MonthRecord;
    onConfirm: (record: MonthRecord) => Promise<void>;
  };
  delete: {
    entityType: "record" | "tag" | "tracker";
    entity: MonthRecord | { id: number; title: string } | { trackerId: string };
    onConfirm: () => Promise<void>;
  };
  settings: object;
  share: object;
  merge: {
    importTrackerBody: Tracker;
    oldTrackerMeta: TrackerMeta | null;
    onConfirm: (data: Tracker) => Promise<void>;
  };
};

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  if (!modal) return null;

  const Component = modalRegistry[modal.type] as React.FC<
    ModalMap[typeof modal.type] & { onClose: () => void }
  >;
  return <Component {...modal.props} onClose={closeModal} />;
}

const modalRegistry: {
  [K in ModalType]: React.FC<ModalMap[K] & { onClose: () => void }>;
} = {
  record: RecordModal,
  delete: DeleteModal,
  settings: SettingsModal,
  share: ShareModal,
  merge: TrackerModal,
};
