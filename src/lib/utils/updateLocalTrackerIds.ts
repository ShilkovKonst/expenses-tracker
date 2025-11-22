import { TRACKER_IDS } from "@/constants";
import { Dispatch, SetStateAction } from "react";

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
