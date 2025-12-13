import { TRACKER_IDS } from "@/constants";
import { Dispatch, SetStateAction } from "react";
import { TrackerMeta, TrackerTags, TrackerYears } from "../types/dataTypes";
import { TrackerId } from "../types/brand";
import { getAllData } from "@/idb/massImportHelper";

export function updateLocalTrackerIds(
  newTrackerId: TrackerId,
  setTrackerIds: Dispatch<SetStateAction<TrackerId[]>>
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
  activeTrackerId: TrackerId,
  setTrackerId: Dispatch<SetStateAction<TrackerId>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags | null>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears | null>>
) {
  if (!activeTrackerId) {
    setTrackerId("" as TrackerId);
    setTrackerMeta(null);
    setTrackerTags(null);
    setTrackerYears(null);
    return;
  }

  const tracker = await getAllData(activeTrackerId);
  if (tracker.meta && tracker.tags && tracker.years) {
    setTrackerId(activeTrackerId);
    setTrackerMeta(tracker.meta);
    setTrackerTags(tracker.tags);
    setTrackerYears(tracker.years);
  }
}
