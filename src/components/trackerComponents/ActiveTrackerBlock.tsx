"use client";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import { DeleteIcon, SaveIcon, SettingsIcon, ShareIcon } from "@/lib/icons";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import {
  isMobileDevice,
  saveWithConfirmation,
  shareFile,
} from "@/lib/utils/fileContentHelper";
import { memo, useCallback, useMemo } from "react";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { TrackerMeta } from "@/lib/types/dataTypes";

const ActiveTrackerBlock = () => {
  const { locale, setAllTrackersMeta, setIsLoading } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, setTrackerMeta, trackerYears } =
    useTracker();
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

  const handleSaveClick = useCallback(async () => {
    if (contentData) {
      try {
        const isSaved = await saveWithConfirmation(contentData);
        if (isSaved && trackerMeta) {
          const newMeta: TrackerMeta = {
            ...trackerMeta,
            backupAt: formatDatetoMeta(new Date()),
          };
          setTrackerMeta(newMeta);
          await updateMetadata(trackerId, newMeta);
          addFlash(
            "success",
            t(locale, "body.flash.trackerSaved", { trackerId }),
          );
        }
      } catch (error) {
        addFlash("error", getErrorMessage(error, ""));
      }
    }
  }, [addFlash, contentData, locale, setTrackerMeta, trackerId, trackerMeta]);

  const handleShareClick = useCallback(async () => {
    if (contentData)
      try {
        const isSaved = await shareFile<"tracker">(contentData);

        if (isSaved && trackerMeta) {
          const newMeta: TrackerMeta = {
            ...trackerMeta,
            backupAt: formatDatetoMeta(new Date()),
          };
          setTrackerMeta(newMeta);
          await updateMetadata(trackerId, newMeta);
          addFlash(
            "success",
            t(locale, "body.flash.trackerSaved", { trackerId }),
          );
        }
      } catch (error) {
        addFlash("error", getErrorMessage(error, ""));
      }
  }, [addFlash, contentData, locale, setTrackerMeta, trackerId, trackerMeta]);

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
    <div className="w-full pb-2 flex justify-between gap-1 md:gap-2 items-center border-b-6 border-blue-400 cursor-default">
      <div className="relative text-xs pl-1 pr-2 font-semibold w-full flex flex-col md:flex-row gap-0 md:gap-2 justify-between items-start rounded-l bg-blue-500 *:text-white">
        <div className="absolute right-0 rounded-l z-10 bg-blue-50/95 h-8 pr-1"></div>
        <div className="text-blue-950 flex flex-row gap-1 md:flex-col md:gap-0">
          <h2 className="">{t(locale, `body.form.title`)}:</h2>
          <p className="max-w-24 truncate">{trackerMeta?.title}</p>
        </div>
        <div className="text-gray-700 flex flex-row gap-1 md:flex-col md:text-right md:gap-0">
          <p className="">{t(locale, `body.form.lastUpdate`)}:</p>
          <p title={updatedAt} className="font-normal">
            {updatedAt}
          </p>
        </div>
      </div>
      <div className={`gap-2 flex flex-row justify-between items-center`}>
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
