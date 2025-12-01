"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import { UtilButton } from "../buttonComponents";
import { DeleteIcon, SaveIcon, SettingsIcon } from "@/lib/icons";
import { GlobalDataType } from "@/lib/types/dataTypes";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { TRACKER_IDS } from "@/constants";

const ActiveTrackerBlock = () => {
  const { locale, setTrackerIds } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, trackerYears } = useTracker();
  const { openModal } = useModal();

  function downloadJson(): void {
    if (trackerId && trackerTags && trackerMeta && trackerYears) {
      const globalData: GlobalDataType = {
        id: trackerId,
        meta: trackerMeta,
        tags: trackerTags,
        years: trackerYears,
        totalAmount: Object.values(trackerYears).reduce(
          (acc, y) => acc + y.totalAmount,
          0
        ),
      };
      const json = JSON.stringify(globalData, null, 2);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = trackerId;
      a.click();

      URL.revokeObjectURL(url);
    }
  }

  const handleSettings = () => {
    openModal("settings", {});
  };

  const handleRemove = () => {
    const onDelete = async () => {
      await deleteTrackerUtil(trackerId);
      if (localStorage) {
        const raw = localStorage.getItem(TRACKER_IDS);
        if (raw) {
          const trackerIds: string[] = JSON.parse(raw);
          const newIds = [...trackerIds.filter((id) => id !== trackerId)];
          localStorage.setItem(TRACKER_IDS, JSON.stringify(newIds));
          setTrackerIds(newIds);
        }
      }
      return { updatedAt: "", message: "tracker was entirely deleted" };
    };
    openModal("delete", {
      entityType: "tracker",
      entity: { trackerId },
      onConfirm: onDelete,
    });
  };

  return (
    <div className="w-full pb-2 flex justify-between items-center border-b-6 border-blue-400">
      <h2 className="w-full text-xl md:text-2xl font-semibold text-blue-950 my-auto">
        {t(locale, `body.form.title`)} - {trackerId}
      </h2>
      <div className={` gap-2 flex flex-row justify-between items-center`}>
        <UtilButton
          icon={<SaveIcon className={"w-4 h-4 md:w-6 md:h-6"} />}
          title={t(locale, `body.buttons.save`)}
          customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${"w-6 h-6 md:w-8 md:h-8"}`}
          handleClick={downloadJson}
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
    </div>
  );
};

export default ActiveTrackerBlock;
