"use client";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import {
  ChartsIcon,
  DeleteIcon,
  SaveIcon,
  SettingsIcon,
  ShareIcon,
} from "@/lib/icons";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { saveFiletoLocal, shareFile } from "@/lib/utils/fileContentHelper";
import { memo, useCallback, useMemo } from "react";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";

const ActiveTrackerBlock = () => {
  const { locale, setAllTrackersMeta, setIsLoading, setIsCharts } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();
  const { openModal } = useModal();
  const { addFlash } = useFlash();

  const updatedAt = useMemo(
    () => trackerMeta?.updatedAt.replace("_", " "),
    [trackerMeta]
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
                  0
                )
              : 0,
          }
        : null,
    [trackerId, trackerTags, trackerMeta, trackerYears]
  );

  const handleCharts = useCallback(() => {
    setIsCharts((prev) => !prev);
  }, [setIsCharts]);

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
            `Something went wrong while deleting tracker ${trackerId}`
          )
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

  const handleSaveClick = useCallback(() => {
    if (contentData) saveFiletoLocal<"tracker">(contentData);
  }, [contentData]);

  const handleShareClick = useCallback(async () => {
    if (contentData)
      try {
        await shareFile<"tracker">(contentData);
      } catch (error) {
        addFlash("error", getErrorMessage(error, ""));
      }
  }, [addFlash, contentData]);

  const buttons = useMemo(
    () => [
      {
        icon: <ChartsIcon className={"w-6 h-6"} />,
        title: "body.buttons.delete",
        style: `bg-green-400 hover:bg-green-500`,
        handleClick: handleCharts,
      },
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
    [
      handleCharts,
      handleRemove,
      handleSaveClick,
      handleSettings,
      handleShareClick,
    ]
  );

  return (
    <div className="w-full pb-2 flex justify-between gap-1 md:gap-2 items-center border-b-6 border-blue-400 cursor-default">
      <div className="text-xs shrink font-semibold w-full flex flex-col md:flex-row gap-0 md:gap-2 justify-between items-start">
        <div className="text-blue-950 flex flex-row gap-1 md:flex-col md:gap-0">
          <h2 className="underline">{t(locale, `body.form.title`)}:</h2>
          <p className="max-w-24 truncate">{trackerMeta?.title}</p>
        </div>
        <div className="text-gray-700 flex flex-row gap-1 md:flex-col md:gap-0">
          <p className="underline">{t(locale, `body.form.lastUpdate`)}:</p>
          <p title={updatedAt} className="font-normal">
            {updatedAt}
          </p>
        </div>
      </div>
      <div className={`gap-2 flex flex-row justify-between items-center`}>
        {buttons.map((button, index) => (
          <UtilButton
            key={index}
            icon={button.icon}
            title={t(locale, button.title)}
            customStyle={`${button.style} w-7.5 h-7.5`}
            handleClick={button.handleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ActiveTrackerBlock);
