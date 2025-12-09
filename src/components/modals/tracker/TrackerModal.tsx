import { useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import ModalBase from "../ModalBase";
import { t } from "@/locales/locale";
import TrackerMergeBlock from "./TrackerMergeBlock";

const TrackerModal = ({
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
      closeButtonTitle={t(locale, "body.buttons.close")}
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

export default TrackerModal;
