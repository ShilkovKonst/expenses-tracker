"use client";
import { useCallback } from "react";
import { useTracker } from "@/context/TrackerContext";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { TrackerMeta } from "@/lib/types/dataTypes";

export function useTrackerMetaUpdate() {
  const { trackerId, trackerMeta, setTrackerMeta } = useTracker();

  const updateTrackerMeta = useCallback(
    async (updates: Partial<TrackerMeta>) => {
      if (!trackerMeta) return null;
      const newMeta: TrackerMeta = {
        ...trackerMeta,
        ...updates,
      };
      await updateMetadata(trackerId, newMeta);
      setTrackerMeta(newMeta);
      return newMeta;
    },
    [trackerId, trackerMeta, setTrackerMeta],
  );

  return updateTrackerMeta;
}
