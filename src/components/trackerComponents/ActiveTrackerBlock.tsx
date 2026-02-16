"use client";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import { DeleteIcon, SaveIcon, SettingsIcon, ShareIcon } from "@/lib/icons";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { isMobileDevice } from "@/lib/utils/fileContentHelper";
import { memo, useCallback, useMemo } from "react";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { useTrackerBackup } from "@/hooks/useTrackerBackup";

const ActiveTrackerBlock = () => {
  const { locale, setAllTrackersMeta, setIsLoading } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();
  const { openModal } = useModal();
  const { addFlash } = useFlash();

  const updatedAt = useMemo(
    () => trackerMeta?.updatedAt.replace("_", " "),
    [trackerMeta],
  );

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
                  0,
                )
              : 0,
          }
        : null,
    [trackerId, trackerTags, trackerMeta, trackerYears],
  );

  const { handleSave: handleSaveClick, handleShare: handleShareClick } =
    useTrackerBackup(contentData);

  const handleSettings = useCallback(() => {
    openModal("settings", {});
  }, [openModal]);

  const handleRemove = useCallback(() => {
    const onDelete = async () => {
      try {
        await deleteTrackerUtil(trackerId);
        await loadTrackers(setAllTrackersMeta, setIsLoading);
      } catch (error) {
        console.error(error);
        addFlash(
          "error",
          getErrorMessage(
            error,
            `Something went wrong while deleting tracker ${trackerId}`,
          ),
        );
      }
    };
    openModal("delete", {
      entityType: "tracker",
      entity: { id: trackerId, title: trackerMeta ? trackerMeta.title : "" },
      onConfirm: onDelete,
    });
  }, [
    addFlash,
    openModal,
    setAllTrackersMeta,
    setIsLoading,
    trackerId,
    trackerMeta,
  ]);

  const buttons = useMemo(
    () => [
      {
        icon: <SaveIcon className={"w-6 h-6"} />,
        title: "body.buttons.save",
        style: `bg-blue-400 hover:bg-blue-500`,
        handleClick: handleSaveClick,
      },
      {
        icon: <ShareIcon className={"w-6 h-6"} />,
        title: "body.buttons.share",
        style: `bg-blue-400 hover:bg-blue-500`,
        handleClick: handleShareClick,
      },
      {
        icon: <SettingsIcon className={"w-6 h-6"} />,
        title: "body.buttons.settings",
        style: `bg-blue-400 hover:bg-blue-500`,
        handleClick: handleSettings,
      },
      {
        icon: <DeleteIcon className={"w-6 h-6"} />,
        title: "body.buttons.delete",
        style: `bg-red-400 hover:bg-red-500`,
        handleClick: handleRemove,
      },
    ],
    [handleRemove, handleSaveClick, handleSettings, handleShareClick],
  );

  return (
    <div className="w-full flex justify-between items-center rounded border-b-2 border-t-2 border-r-2 bg-blue-500 border-blue-500 cursor-default overflow-hidden">
      <div className="relative text-sm pl-1 pr-2 font-semibold w-full flex flex-col gap-0 justify-between items-start *:text-white">
        {/* <div className="absolute right-0 rounded-l z-10 bg-blue-50/95 h-10 pr-1"></div> */}
        <div className="text-blue-950 flex flex-row gap-1">
          <h2 className="">{t(locale, `body.form.title`)}:</h2>
          <p className="max-w-24 truncate">{trackerMeta?.title}</p>
        </div>
        <div className="text-gray-700 flex flex-row gap-1">
          <p className="">{t(locale, `body.form.lastUpdate`)}:</p>
          <p title={updatedAt} className="font-normal">
            {updatedAt}
          </p>
        </div>
      </div>
      <div className={`gap-2 flex flex-row justify-between items-center py-1.5 bg-blue-50/95 px-2 rounded`}>
        {buttons.map(
          (button, index) =>
            (!button.title.includes("share") || isMobileDevice()) && (
              <UtilButton
                key={index}
                icon={button.icon}
                title={t(locale, button.title)}
                customStyle={`${button.style} w-7.5 h-7.5`}
                handleClick={button.handleClick}
              />
            ),
        )}
      </div>
    </div>
  );
};

export default memo(ActiveTrackerBlock);
