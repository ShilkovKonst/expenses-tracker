"use client";
import { t } from "@/locales/locale";
import { FormEvent, MouseEvent as RME, useState } from "react";
import { AddIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { setNewData } from "@/lib/utils/trackerDataSetter";
import { useTracker } from "@/context/TrackerContext";
import { updateLocalTrackerIds } from "@/lib/utils/updateLocalTrackerIds";
import { SubmitButton } from "../buttonComponents";

const NewTrackerBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
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
  };

  return (
    <form
      className="grid grid-cols-5 gap-2 w-full mt-2 overflow-hidden transition-[height] duration-300 ease-in-out"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-xs"
        placeholder={t(locale, `body.form.tracker.typeCustomTitle`)}
        type="text"
        value={newTrackerId}
        onChange={(e) => setNewTrackerId(e.target.value)}
      />
      <SubmitButton
        icon={<AddIcon className="w-5 h-5" />}
        title="создать новый трекер"
        customStyle="mr-auto h-7 w-7 bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
        disabled={isDisabled}
      />
    </form>
  );
};

export default NewTrackerBlock;
