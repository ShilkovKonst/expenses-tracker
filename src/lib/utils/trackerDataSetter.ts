"use client";
import {
  Tracker,
  TrackerMeta,
  TrackerTags,
  TrackerYears,
  Year,
} from "@/lib/types/dataTypes";
import { Dispatch, SetStateAction } from "react";
import { createMetadata } from "@/idb/CRUD/metaCRUD";
import { CURRENT_YEAR, TRACKER_IDS } from "@/constants";
import { initEmptyMonths } from "./monthHelper";
import { createTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { formatDatetoMeta } from "./dateParser";

export function setParsedData(
  data: Tracker,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>,
  id: string = data.id
) {
  setTrackerId(id);
  setTrackerMeta({ ...data.meta });
  setTrackerTags({ ...data.tags });
  setTrackerYears({ ...data.years });
}

export async function setNewData(
  newTrackerId: string,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  const newMeta = {
    createdAt: formatDatetoMeta(new Date()),
    updatedAt: formatDatetoMeta(new Date()),
  };
  await createMetadata(newTrackerId, newMeta);

  const newYears: Record<number, Year> = {
    [CURRENT_YEAR]: {
      id: CURRENT_YEAR,
      months: initEmptyMonths(),
      totalAmount: 0,
    },
  };

  setTrackerId(newTrackerId);
  setTrackerMeta(newMeta);
  setTrackerTags({});
  setTrackerYears(newYears);
}

export async function createNPopulate(
  data: Tracker,
  setTrackerIds: Dispatch<SetStateAction<string[]>>,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>,
  id: string = data.id
) {
  try {
    await createTrackerUtil(data, id);
  } catch (error) {
    console.error(error);
    throw new Error("error createTrackerUtil");
  }
  if (localStorage) {
    const trackersString = localStorage.getItem(TRACKER_IDS);
    if (trackersString) {
      const trackerList: string[] = JSON.parse(trackersString);
      const newIds = [...trackerList, id];
      localStorage.setItem(TRACKER_IDS, JSON.stringify(newIds));
      setTrackerIds(newIds);
    }
  }
  setParsedData(
    data,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears
  );
}
