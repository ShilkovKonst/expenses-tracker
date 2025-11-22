/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { t } from "@/locales/locale";
import React, { useEffect, useState } from "react";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { setNewData } from "@/lib/utils/trackerDataSetter";
import { useTracker } from "@/context/TrackerContext";
import { updateLocalTrackerIds } from "@/lib/utils/updateLocalTrackerIds";

const NewTrackerBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
  const {
    trackerId,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears,
  } = useTracker();

  const [newTrackerId, setNewTrackerId] = useState<string>("");
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (trackerIds.length > 0 && newTrackerId.length > 0) {
      if (!isDisabled && trackerIds.some((id) => id === newTrackerId))
        setIsDisabled(true);
      if (isDisabled && !trackerIds.some((id) => id === newTrackerId))
        setIsDisabled(false);
    }
  }, [newTrackerId]);

  useEffect(() => {
    if (isCreated && trackerId) {
      if (localStorage) {
        updateLocalTrackerIds(trackerId, setTrackerIds);
      }
      setIsCreated(false);
      setNewTrackerId("");
    }
  }, [isCreated]);

  return (
    <form className="grid grid-cols-5 gap-2 w-full mt-2 overflow-hidden transition-[height] duration-300 ease-in-out">
      <input
        className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-xs"
        placeholder={t(locale, `body.form.tracker.typeCustomTitle`)}
        type="text"
        value={newTrackerId}
        onChange={(e) => setNewTrackerId(e.target.value)}
      />
      <TopLevelButton
        icon={<AddIcon className="w-5 h-5" />}
        title=""
        handleClick={() => {
          setNewData(
            newTrackerId,
            setTrackerId,
            setTrackerMeta,
            setTrackerTags,
            setTrackerYears
          );
          setIsCreated(true);
        }}
        style="col-span-1 mr-auto h-7 w-7 rounded-sm cursor-pointer flex justify-center items-center 
                  bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600
                  transition-colors duration-200 ease-in-out"
        disabled={isDisabled || newTrackerId === ""}
      />
    </form>
  );
};

export default NewTrackerBlock;
