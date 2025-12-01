import { TRACKER_IDS } from "@/constants";
import { getMetadata } from "@/idb/CRUD/metaCRUD";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";
import { getAllTags } from "@/idb/CRUD/tagsCRUD";
import { Dispatch, SetStateAction } from "react";
import { populateYears } from "./yearsTransformer";
import {
  TrackerMeta,
  TrackerTags,
  TrackerYears,
  Year,
} from "../types/dataTypes";

export function updateLocalTrackerIds(
  newTrackerId: string,
  setTrackerIds: Dispatch<SetStateAction<string[]>>
) {
  const raw = localStorage.getItem(TRACKER_IDS);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((p) => p !== newTrackerId)) {
      const newParsed = [...parsed, newTrackerId];
      localStorage.setItem(TRACKER_IDS, JSON.stringify(newParsed));
      setTrackerIds(newParsed);
    }
  } else {
    localStorage.setItem(TRACKER_IDS, JSON.stringify([newTrackerId]));
    setTrackerIds([newTrackerId]);
  }
}

export async function populateTrackerContex(
  activeTrackerId: string,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  if (!activeTrackerId) {
    setTrackerId("");
    setTrackerMeta(null);
    setTrackerTags(null);
    setTrackerYears(null);
    return;
  }

  const meta = await getMetadata(activeTrackerId);
  const tags = await getAllTags(activeTrackerId);
  const records = await getAllRecords(activeTrackerId);
  if (meta && tags && records) {
    const years: Record<number, Year> = populateYears(records);
    setTrackerId(activeTrackerId);
    setTrackerMeta(meta);
    setTrackerTags(tags);
    setTrackerYears(years);
  }
}
