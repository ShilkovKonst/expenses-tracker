"use client";
import { t } from "@/locales/locale";
import { FormEvent, MouseEvent as RME, useState } from "react";
import { AddIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { setNewData } from "@/lib/utils/trackerDataSetter";
import { useTracker } from "@/context/TrackerContext";
import { updateLocalTrackerIds } from "@/lib/utils/updateLocalTrackerIds";
import { SubmitButton } from "../buttonComponents";
import { useFlash } from "@/context/FlashContext";

const NewTrackerBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
  const { addFlash } = useFlash();
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();

  const [newTrackerId, setNewTrackerId] = useState<string>("");

  const isDisabled =
    newTrackerId.trim() === "" || trackerIds.includes(newTrackerId.trim());

  const handleSubmit = (
    e: RME<HTMLButtonElement, MouseEvent> | FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (isDisabled) return;

    if (localStorage && newTrackerId) {
      updateLocalTrackerIds(newTrackerId, setTrackerIds);
    }

    setNewData(
      newTrackerId,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears
    );
    setNewTrackerId("");
    addFlash(
      "success",
      t(locale, "body.flash.newTrackerAdded", { trackerId: newTrackerId })
    );
  };

  return (
    <form
      className="relative grid grid-cols-5 w-full transition-[height] duration-300 ease-in-out overflow-visible"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        className="col-span-4 w-full px-2 py-0.5 border-2 bg-white border-blue-100 focus:outline-blue-300 rounded-md text-xs"
        placeholder={t(locale, `body.form.tracker.typeCustomTitle`)}
        type="text"
        value={newTrackerId}
        onChange={(e) => setNewTrackerId(e.target.value)}
      />
      <SubmitButton
        icon={<AddIcon className="w-6 h-6 md:h-4 md:w-4" />}
        title={t(locale, "body.buttons.create")}
        customStyle="ml-2 mr-auto h-8 w-8 md:h-6 md:w-6 bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
        disabled={isDisabled}
      />
      {newTrackerId.trim() === "" ||
        (isDisabled && (
          <p className="ml-0.5 absolute top-7 text-red-500 text-xs font-semibold col-span-5">
            {t(locale, "body.form.tracker.mergeTitle", {
              trackerId:
                newTrackerId.length > 5
                  ? `${newTrackerId.substring(0, 3)}...`
                  : newTrackerId,
            })}
          </p>
        ))}
    </form>
  );
};

export default NewTrackerBlock;
