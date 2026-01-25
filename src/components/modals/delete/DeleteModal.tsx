"use client";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { MonthRecord, TrackerMeta, Year } from "@/lib/types/dataTypes";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import ModalBase from "../ModalBase";
import { t } from "@/locales/locale";
import TagDeleteBlock from "./TagDeleteBlock";
import RecordDeleteBlock from "./RecordDeleteBlock";
import TrackerDeleteBlock from "./TrackerDeleteBlock";
import { ValidateButton } from "@/components/buttonComponents";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { getAllTags } from "@/idb/CRUD/tagsCRUD";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { TagId, TrackerId } from "@/lib/types/brand";

type Entities = {
  tag: {
    id: TagId;
    title: string;
  };
  tracker: {
    id: TrackerId;
    title: string;
  };
  record: MonthRecord;
};

const DeleteModal = ({
  entityType,
  entity,
  onConfirm,
  onClose,
}: ModalMap["delete"] & { onClose: () => void }) => {
  const { locale, allTrackersMeta, setAllTrackersMeta, setIsLoading } =
    useGlobal();
  const { openModal } = useModal();
  const { addFlash } = useFlash();
  const {
    trackerId,
    trackerMeta,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears,
  } = useTracker();

  const updMeta = async () => {
    if (trackerMeta) {
      const updatedAt = formatDatetoMeta(new Date());
      const newMeta: TrackerMeta = {
        id: trackerMeta.id ?? trackerId,
        title: trackerMeta.title ?? trackerId,
        createdAt: trackerMeta.createdAt ?? updatedAt,
        backupAt: trackerMeta.backupAt ?? updatedAt,
        updatedAt,
      };
      await updateMetadata(trackerId, newMeta);
      setTrackerMeta(newMeta);
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
      if (entityType === "tracker") {
        await loadTrackers(setAllTrackersMeta, setIsLoading);
        setTrackerId("" as TrackerId);
        setTrackerMeta(null);
        setTrackerTags(null);
        setTrackerYears(null);
      }
      if (entityType === "record") {
        const records = await getAllRecords(trackerId);
        const years: Record<number, Year> = populateYears(records);
        setTrackerYears(years);
        updMeta();
      }
      if (entityType === "tag") {
        const tags = await getAllTags(trackerId);
        setTrackerTags(tags);
        const records = await getAllRecords(trackerId);
        const years = populateYears(records);
        setTrackerYears(years);
        updMeta();
      }
      addFlash(
        "info",
        t(locale, `body.flash.deleted`, {
          entity: t(locale, `body.modal.deleteEntity.${entityType}`),
          id: "title" in entity ? entity.title : entity.id,
        }),
      );
    } catch (error) {
      console.error(error);
      addFlash("error", getErrorMessage(error, ""));
    }
    handleClose();
  };

  const handleClose = () =>
    entityType === "tag" ? openModal("settings", { onClose }) : onClose();

  return (
    <ModalBase
      title={t(locale, "body.modal.titleDelete", {
        deleteEntity: t(locale, `body.modal.deleteEntity.${entityType}`),
      })}
      desc={""}
      sectionGridCols={2}
      closeButtonTitle={t(locale, "body.buttons.close")}
      cancelButtonTitle={t(locale, "body.buttons.cancel")}
      onClose={handleClose}
    >
      {entityType === "tag" && (
        <TagDeleteBlock entity={entity as Entities["tag"]} />
      )}
      {entityType === "record" && (
        <RecordDeleteBlock entity={entity as Entities["record"]} />
      )}
      {entityType === "tracker" && (
        <TrackerDeleteBlock
          entityType={entityType}
          entity={entity as Entities["tracker"]}
        />
      )}
      <ValidateButton
        title={t(locale, "body.buttons.delete")}
        customStyle="col-span-2 bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleConfirm}
      />
    </ModalBase>
  );
};

export default DeleteModal;
