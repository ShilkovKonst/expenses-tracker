"use client";
import {
  createYearId,
  Tracker,
  TrackerMeta,
  TrackerTags,
  TrackerYears,
  Year,
} from "@/lib/types/dataTypes";
import { Dispatch, SetStateAction } from "react";
import { createMetadata } from "@/idb/CRUD/metaCRUD";
import { CURRENT_YEAR } from "@/constants";
import { initEmptyMonths } from "./monthHelper";
import { createTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { formatDatetoMeta } from "./dateParser";
import { TrackerId, YearId } from "../types/brand";
import { loadTrackers } from "@/context/GlobalContext";

export function setParsedData(
  data: Tracker,
  setTrackerId: Dispatch<SetStateAction<TrackerId>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  setTrackerId(data.meta.id);
  setTrackerMeta({ ...data.meta });
  setTrackerTags({ ...data.tags });
  setTrackerYears({ ...data.years });
}

export async function setNewData(
  newTrackerId: TrackerId,
  setTrackerId: Dispatch<SetStateAction<TrackerId>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  const newMeta = {
    id: newTrackerId,
    title: newTrackerId,
    createdAt: formatDatetoMeta(new Date()),
    updatedAt: formatDatetoMeta(new Date()),
  };
  await createMetadata(newTrackerId, newMeta);

  const newYears: Record<YearId, Year> = {
    [CURRENT_YEAR]: {
      id: createYearId(CURRENT_YEAR),
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
  setAllTrackersMeta: Dispatch<SetStateAction<TrackerMeta[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTrackerId: Dispatch<SetStateAction<TrackerId>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  try {
    await createTrackerUtil(data);
  } catch (error) {
    console.error(error);
    throw new Error("error createTrackerUtil");
  }
  loadTrackers(setAllTrackersMeta, setIsLoading);
  setParsedData(
    data,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears
  );
}
