"use client";
import {
  TrackerMeta,
  TrackerTags,
  TrackerYears,
} from "@/context/TrackerContext";
import { initEmptyTracker } from "@/lib/utils/initEmptyTracker";
import { GlobalDataType } from "@/types/formTypes";
import { Dispatch, SetStateAction } from "react";

export function buildFileName(dataId: string | undefined): string {
  const prefix = dataId ?? "tracker";
  const ts = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19); // безопасно для файловой системы

  return `${prefix}_${ts}.json`;
}

export function setParsedData(
  data: GlobalDataType,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears>>
) {
  setTrackerId(data.id);
  setTrackerMeta({ ...data.meta });
  setTrackerTags({ ...data.tagsPool });
  setTrackerYears([...data.years]);
}

export function setNewData(
  newTrackerId: string,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears>>
) {
  const newTracker = initEmptyTracker(newTrackerId);
  setTrackerId(newTrackerId);
  setTrackerMeta({
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  setTrackerTags({
    t0: "card",
    t1: "cash",
    t2: "food",
    t3: "clothes",
    t4: "service",
  });
  setTrackerYears(newTracker.years);
}
