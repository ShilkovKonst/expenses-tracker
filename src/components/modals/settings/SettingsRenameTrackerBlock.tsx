import { IconButton } from "@/components/buttonComponents";
import { useFlash } from "@/context/FlashContext";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { getAllMeta } from "@/idb/IDBManager";
import { UpdateIcon } from "@/lib/icons";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { t } from "@/locales/locale";
import React, { useMemo, useState } from "react";
import { useTrackerMetaUpdate } from "@/hooks/useTrackerMetaUpdate";

const SettingsRenameTrackerBlock = () => {
  const { locale, allTrackersMeta, setAllTrackersMeta } = useGlobal();
  const { addFlash } = useFlash();
  const { trackerMeta } = useTracker();
  const updateTrackerMeta = useTrackerMetaUpdate();

  const [trackerTitle, setTrackerTitle] = useState(trackerMeta?.title ?? "");

  const isDisabled = useMemo(() => {
    return allTrackersMeta.some((m) => m.title === trackerTitle);
  }, [allTrackersMeta, trackerTitle]);

  const handleUpdateTrackerTitle = async (value: string) => {
    try {
      await updateTrackerMeta({
        title: value,
        updatedAt: formatDatetoMeta(new Date()),
      });
      const validMetas = await getAllMeta();
      setAllTrackersMeta(validMetas);
      addFlash("success", t(locale, `body.flash.trackerTitleUpdated`));
    } catch (error) {
      addFlash("error", getErrorMessage(error, "Failed to rename tracker"));
    }
  };

  return (
    <div className={`relative flex gap-2 pb-3 border-b-2 border-blue-100`}>
      <input
        id="trackerTitleInput"
        name="trackerTitleInput"
        type="text"
        title={
          isDisabled && trackerTitle !== trackerMeta?.title
            ? t(locale, `body.form.tracker.typeDouble`)
            : ""
        }
        value={trackerTitle}
        className={`col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100  ${
          isDisabled && trackerTitle !== trackerMeta?.title
            ? "focus:outline-red-300"
            : "focus:outline-blue-300"
        } rounded-md text-xs`}
        placeholder={t(locale, `body.form.placeholders.newTag`)}
        onChange={(e) => setTrackerTitle(e.target.value)}
      />
      <IconButton
        title={`create new tag`}
        icon={<UpdateIcon className="w-4 h-4" />}
        value={trackerTitle}
        handleClick={handleUpdateTrackerTitle}
        customStyle="col-span-1 min-w-6 w-6 h-6 my-auto rounded-sm bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
        disabled={
          isDisabled ||
          trackerTitle === trackerMeta?.title ||
          trackerTitle.length === 0
        }
      />
    </div>
  );
};

export default SettingsRenameTrackerBlock;
