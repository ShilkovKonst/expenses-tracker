"use client";
import { useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { Year } from "@/lib/types/dataTypes";
import { TRACKER_IDS } from "@/constants";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import ModalBase from "../ModalBase";
import { t } from "@/locales/locale";
import TagDeleteBlock from "./TagDeleteBlock";
import RecordDeleteBlock from "./RecordDeleteBlock";
import TrackerDeleteBlock from "./TrackerDeleteBlock";
import { ValidateButton } from "@/components/buttonComponents";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { TrackerId } from "@/lib/types/brand";

const DeleteModal = ({
  entityType,
  entity,
  onConfirm,
  onClose,
}: ModalMap["delete"] & { onClose: () => void }) => {
  const { locale } = useGlobal();
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

  const handleConfirm = async () => {
    try {
      const { updatedAt } = await onConfirm();
      if (trackerMeta) setTrackerMeta({ ...trackerMeta, updatedAt });
      if (entityType === "record") {
        const records = await getAllRecords(trackerId);
        const years: Record<number, Year> = populateYears(records);
        setTrackerYears(years);
      }
      if (entityType === "tracker") {
        if (localStorage) {
          const raw = localStorage.getItem(TRACKER_IDS);
          if (raw) {
            const ids: TrackerId[] = JSON.parse(raw);
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
      if (entityType === "tag") {
        //TODO: cleanse of deleted tag from records
      }
      addFlash(
        "info",
        t(locale, `body.flash.deleted`, {
          entity: t(locale, `body.modal.deleteEntity.${entityType}`),
          id: "id" in entity ? entity.id : entity.trackerId,
        })
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

export default DeleteModal;
