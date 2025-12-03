import { ModalType, useModal } from "@/context/ModalContext";
import ModalBase from "./ModalBase";
import RecordForm from "./RecordCreateUpdateBlock";
import { Tracker, MonthRecord, TrackerMeta, Year } from "@/lib/types/dataTypes";
import SettingsBlock from "./SettingsBlock";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import RecordDeleteBlock from "./RecordDeleteBlock";
import TagDeleteBlock from "./TagDeleteBlock";
import { useTracker } from "@/context/TrackerContext";
import TrackerDeleteBlock from "./TrackerDeleteBlock";
import TrackerMergeBlock from "./TrackerMergeBlock";
import { ValidateButton } from "../buttonComponents";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import { TRACKER_IDS } from "@/constants";
import { useState } from "react";
import {
  decimalToInputString,
  inputStringToDecimal,
} from "@/lib/utils/amountHelper";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";

export type ModalMap = {
  record: {
    record: MonthRecord;
    onConfirm: (record: MonthRecord) => Promise<{
      id: number;
      updatedAt: string;
    }>;
  };
  delete: {
    entityType: "record" | "tag" | "tracker";
    entity: MonthRecord | { id: number; title: string } | { trackerId: string };
    onConfirm: () => Promise<{
      message: string;
      updatedAt: string;
    }>;
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  settings: {};
  merge: {
    importTrackerBody: Tracker;
    oldTrackerMeta: TrackerMeta;
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

const RecordModal = ({
  record,
  onClose,
  onConfirm,
}: ModalMap["record"] & { onClose: () => void }) => {
  const { locale } = useGlobal();
  const { trackerId, trackerMeta, setTrackerMeta, setTrackerYears } =
    useTracker();

  const [currentRecord, setCurrentRecord] = useState<MonthRecord>(record);
  const [amountString, setAmountString] = useState<string>(
    decimalToInputString(record.amount ?? 0)
  );

  const handleConfirm = async () => {
    const updRecord = {
      ...currentRecord,
      amount: inputStringToDecimal(amountString),
    };
    const { id, updatedAt } = await onConfirm(updRecord);
    updRecord.id = id;
    if (trackerMeta) setTrackerMeta({ ...trackerMeta, updatedAt });

    const records = await getAllRecords(trackerId);
    const years: Record<number, Year> = populateYears(records);
    setTrackerYears(years);
    onClose();
  };

  return (
    <ModalBase
      title={
        record.id === -1
          ? t(locale, "body.modal.titleCreate")
          : t(locale, "body.modal.titleUpdate")
      }
      sectionGridCols={2}
      cancelButtonTitle={t(locale, "body.buttons.cancel")}
      onClose={onClose}
    >
      <RecordForm
        currentRecord={currentRecord}
        setCurrentRecord={setCurrentRecord}
        amountString={amountString}
        setAmountString={setAmountString}
      />
      <ValidateButton
        title={t(locale, "body.buttons.confirm")}
        customStyle="col-span-2 bg-green-300 hover:bg-green-400 border-green-400"
        handleClick={handleConfirm}
      />
    </ModalBase>
  );
};

const DeleteModal = ({
  entityType,
  entity,
  onConfirm,
  onClose,
}: ModalMap["delete"] & { onClose: () => void }) => {
  const { locale } = useGlobal();
  const { openModal } = useModal();
  const {
    trackerId,
    trackerMeta,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears,
  } = useTracker();

  const handleConfirm = async () => {
    try {
      const { updatedAt } = await onConfirm();
      if (trackerMeta) setTrackerMeta({ ...trackerMeta, updatedAt });
    } catch (err) {
      console.error(err);
      throw new Error(
        `Something went wrong while deleting ${entityType} '${entity}'`
      );
    } finally {
      if (entityType === "record") {
        try {
          const records = await getAllRecords(trackerId);
          const years: Record<number, Year> = populateYears(records);
          setTrackerYears(years);
        } catch (err) {
          console.error("Failed to refresh records after deletion:", err);
        }
      }
    }

    if (entityType === "tracker") {
      if (localStorage) {
        const raw = localStorage.getItem(TRACKER_IDS);
        if (raw) {
          const ids: string[] = JSON.parse(raw);
          const newActiveId = ids[0] ?? "";
          populateTrackerContex(
            newActiveId,
            setTrackerId,
            setTrackerMeta,
            setTrackerTags,
            setTrackerYears
          );
        }
      }
    }
    handleClose();
  };

  const handleClose = () => {
    if (entityType === "tag") {
      openModal("settings", { onClose: onClose });
    } else {
      onClose();
    }
  };

  return (
    <ModalBase
      title={t(locale, "body.modal.titleDelete", {
        deleteEntity: t(locale, `body.modal.deleteEntity.${entityType}`),
      })}
      desc={""}
      sectionGridCols={2}
      cancelButtonTitle={t(locale, "body.buttons.cancel")}
      onClose={handleClose}
    >
      {"title" in entity && <TagDeleteBlock entity={entity} />}
      {"year" in entity && <RecordDeleteBlock entity={entity} />}
      {"trackerId" in entity && (
        <TrackerDeleteBlock entityType={entityType} entity={entity} />
      )}
      <ValidateButton
        title={t(locale, "body.buttons.delete")}
        customStyle="col-span-2 bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleConfirm}
      />
    </ModalBase>
  );
};

const SettingsModal = ({
  onClose,
}: ModalMap["settings"] & { onClose: () => void }) => {
  const { locale } = useGlobal();

  return (
    <ModalBase
      title={t(locale, "body.personnalisation.title")}
      desc={t(locale, "body.personnalisation.description")}
      sectionGridCols={2}
      cancelButtonTitle={t(locale, "body.buttons.close")}
      onClose={onClose}
    >
      <SettingsBlock onClose={onClose} />
    </ModalBase>
  );
};

const TrackerMergeModal = ({
  importTrackerBody,
  oldTrackerMeta,
  onClose,
}: ModalMap["merge"] & { onClose: () => void }) => {
  const { locale } = useGlobal();

  return (
    <ModalBase
      sectionGridCols={2}
      title={t(locale, `body.form.tracker.mergeTitle`, {
        trackerId: importTrackerBody ? importTrackerBody?.id : "",
      })}
      cancelButtonTitle={t(locale, "body.buttons.cancel")}
      onClose={onClose}
    >
      <TrackerMergeBlock
        importTrackerBody={importTrackerBody}
        oldTrackerMeta={oldTrackerMeta}
      />
    </ModalBase>
  );
};

const modalRegistry: {
  [K in ModalType]: React.FC<ModalMap[K] & { onClose: () => void }>;
} = {
  record: RecordModal,
  delete: DeleteModal,
  settings: SettingsModal,
  merge: TrackerMergeModal,
};
