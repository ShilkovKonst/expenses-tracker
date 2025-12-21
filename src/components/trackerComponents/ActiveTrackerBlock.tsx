"use client";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import { DeleteIcon, SaveIcon, SettingsIcon, ShareIcon } from "@/lib/icons";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { saveFiletoLocal, shareFile } from "@/lib/utils/fileContentHelper";
import { useMemo } from "react";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
// import { getAllData } from "@/idb/massImportHelper";

const ActiveTrackerBlock = () => {
  return (
    <div className="w-full pb-2 flex justify-between gap-2 items-center border-b-6 border-blue-400">
      <ActiveTrackerData />
    </div>
  );
};

export default ActiveTrackerBlock;

const ActiveTrackerData = () => {
  const { locale, setAllTrackersMeta, setIsLoading } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();
  const { openModal } = useModal();
  const { addFlash } = useFlash();

  const contentData = useMemo(
    () =>
      trackerId && trackerTags && trackerMeta && trackerYears
        ? {
            id: trackerId,
            meta: trackerMeta,
            tags: trackerTags,
            years: trackerYears,
            totalAmount: trackerYears
              ? Object.values(trackerYears).reduce(
                  (acc, y) => acc + y.totalAmount,
                  0
                )
              : 0,
          }
        : null,
    [trackerId, trackerTags, trackerMeta, trackerYears]
  );

  const handleSettings = () => {
    openModal("settings", {});
  };

  const handleRemove = () => {
    const onDelete = async () => {
      try {
        await deleteTrackerUtil(trackerId);
        await loadTrackers(setAllTrackersMeta, setIsLoading);
      } catch (error) {
        console.log(error);
        addFlash(
          "error",
          getErrorMessage(
            error,
            `Something went wrong while deleting tracker ${trackerId}`
          )
        );
      }
    };
    openModal("delete", {
      entityType: "tracker",
      entity: { trackerId },
      onConfirm: onDelete,
    });
  };

  const handleShareClick = async () => {
    if (contentData)
      try {
        await shareFile<"tracker">(contentData);
      } catch (error) {
        addFlash("error", getErrorMessage(error, ""));
      }
  };

  return (
    <>
      <div className="text-xs font-semibold w-full flex flex-wrap gap-0 md:gap-2 justify-between items-start">
        <div className="text-blue-950 flex flex-row gap-1 md:flex-col md:gap-0">
          <h2 className="underline">{t(locale, `body.form.title`)}:</h2>
          <p className="max-w-24 truncate">{trackerMeta?.title}</p>
        </div>
        <div className="text-gray-700 flex flex-row gap-1 md:flex-col md:gap-0">
          <p className="underline">{t(locale, `body.form.lastUpdate`)}:</p>
          <p>{trackerMeta?.updatedAt.replace("_", " ")}</p>
        </div>
      </div>
      <div className={`gap-2 flex flex-row justify-between items-center`}>
        <UtilButton
          icon={<SaveIcon className={"w-6 h-6"} />}
          title={t(locale, `body.buttons.save`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-8 h-8"}`}
          handleClick={() =>
            contentData && saveFiletoLocal<"tracker">(contentData)
          }
        />
        <UtilButton
          icon={<ShareIcon className={"w-6 h-6"} />}
          title={t(locale, `body.buttons.share`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-8 h-8"}`}
          handleClick={handleShareClick}
        />
        <UtilButton
          icon={<SettingsIcon className={"w-6 h-6"} />}
          title={t(locale, `body.buttons.settings`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-8 h-8"}`}
          handleClick={handleSettings}
        />
        <UtilButton
          icon={<DeleteIcon className={"w-6 h-6"} />}
          title={t(locale, `body.buttons.delete`)}
          customStyle={`bg-red-400 hover:bg-red-500 ${"w-8 h-8"}`}
          handleClick={handleRemove}
        />
      </div>
    </>
  );
};
