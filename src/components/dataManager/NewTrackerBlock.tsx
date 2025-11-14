/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { setNewData } from "@/lib/utils/trackerDataSetter";
import { useTracker } from "@/context/TrackerContext";
import { GlobalDataType } from "@/types/formTypes";

const NewTrackerBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
  const {
    trackerId,
    trackerMeta,
    trackerTags,
    trackerYears,
    setTrackerId,
    setTrackerTags,
    setTrackerMeta,
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
    if (isCreated) {
      if (
        localStorage &&
        trackerId &&
        trackerMeta &&
        trackerTags &&
        trackerYears
      ) {
        let raw = localStorage.getItem("trackerIds");
        if (raw) {
          const localIds: string[] = JSON.parse(raw);
          if (localIds.some((id) => id === trackerId)) {
            throw new Error(
              `This '${trackerId}' tracker id already registered in application. Check add new tracker logic`
            );
          }
          const newLocalIds = [...localIds, trackerId];
          localStorage.setItem("trackerIds", JSON.stringify(newLocalIds));
          setTrackerIds(newLocalIds);
        } else {
          localStorage.setItem("trackerIds", JSON.stringify([trackerId]));
          setTrackerIds([trackerId]);
        }

        raw = localStorage.getItem(trackerId);
        if (raw) {
          throw new Error(
            "Such tracker already registered in application. Check add new tracker logic"
          );
        }
        const trackerObj: GlobalDataType = {
          id: trackerId,
          meta: trackerMeta,
          tagsPool: trackerTags,
          years: trackerYears,
          totalAmount: trackerYears.reduce((acc, y) => acc + y.totalAmount, 0),
        };
        localStorage.setItem(trackerId, JSON.stringify(trackerObj));
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
