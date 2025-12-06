"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import { DeleteIcon, SaveIcon, SettingsIcon, ShareIcon } from "@/lib/icons";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { TRACKER_IDS } from "@/constants";
import { saveFiletoLocal, shareFile } from "@/lib/utils/fileContentHelper";
import { useMemo } from "react";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";

const ActiveTrackerBlock = () => {
  return (
    <div className="w-full pb-2 flex justify-between gap-2 items-center border-b-6 border-blue-400">
      <ActiveTrackerData />
    </div>
  );
};

export default ActiveTrackerBlock;

const ActiveTrackerData = () => {
  const { locale, setTrackerIds } = useGlobal();
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
      } catch (error) {
        console.log(error)
        addFlash("error", getErrorMessage(error, `Something went wrong while deleting tracker ${trackerId}`))
      } finally {
        if (localStorage) {
          const raw = localStorage.getItem(TRACKER_IDS);
          if (raw) {
            const trackerIds: string[] = JSON.parse(raw);
            const newIds = [...trackerIds.filter((id) => id !== trackerId)];
            localStorage.setItem(TRACKER_IDS, JSON.stringify(newIds));
            setTrackerIds(newIds);
          }
        }
        addFlash("success", `Tracker ${trackerId} has been deleted`)
        return { updatedAt: "", message: "tracker was entirely deleted" };
      }

    };
    openModal("delete", {
      entityType: "tracker",
      entity: { trackerId },
      onConfirm: onDelete,
    });
  };

  return (
    <>
      <div className="text-xs md:text-sm font-semibold w-full flex flex-wrap gap-2 justify-between items-center">
        <div className="text-blue-950">
          <h2 className="underline">{t(locale, `body.form.title`)}:</h2>
          <p>{trackerId}</p>
        </div>
        <div className="text-gray-700">
          <p className="underline">Last update:</p>
          <p>{trackerMeta?.updatedAt.replace("_", " ")}</p>
        </div>
      </div>
      <div className={`gap-2 flex flex-row justify-between items-center`}>
        <UtilButton
          icon={<SaveIcon className={"w-4 h-4 md:w-6 md:h-6"} />}
          title={t(locale, `body.buttons.save`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-6 h-6 md:w-8 md:h-8"}`}
          handleClick={() =>
            contentData && saveFiletoLocal<"tracker">(contentData)
          }
        />
        <UtilButton
          icon={<ShareIcon className={"w-4 h-4 md:w-6 md:h-6"} />}
          title={t(locale, `body.buttons.save`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-6 h-6 md:w-8 md:h-8"}`}
          handleClick={() => contentData && shareFile<"tracker">(contentData)}
        />
        <UtilButton
          icon={<SettingsIcon className={"w-4 h-4 md:w-6 md:h-6"} />}
          title={t(locale, `body.buttons.update`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-6 h-6 md:w-8 md:h-8"}`}
          handleClick={handleSettings}
        />
        <UtilButton
          icon={<DeleteIcon className={"w-4 h-4 md:w-6 md:h-6"} />}
          title={t(locale, `body.buttons.delete`)}
          customStyle={`bg-red-400 hover:bg-red-500 ${"w-6 h-6 md:w-8 md:h-8"}`}
          handleClick={handleRemove}
        />
      </div>
    </>
  )
}