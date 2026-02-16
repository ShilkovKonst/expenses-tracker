"use client";
import { useCallback } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { useFlash } from "@/context/FlashContext";
import { useTrackerMetaUpdate } from "@/hooks/useTrackerMetaUpdate";
import { saveWithConfirmation, shareFile } from "@/lib/utils/fileContentHelper";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { t } from "@/locales/locale";
import { TrackerMeta, TrackerTags, TrackerYears } from "@/lib/types/dataTypes";
import { TrackerId } from "@/lib/types/brand";

type ContentData = {
  id: TrackerId;
  meta: TrackerMeta;
  tags: TrackerTags;
  years: TrackerYears;
  totalAmount: number;
} | null;

export function useTrackerBackup(contentData: ContentData) {
  const { locale } = useGlobal();
  const { trackerId } = useTracker();
  const { addFlash } = useFlash();
  const updateTrackerMeta = useTrackerMetaUpdate();

  const performBackup = useCallback(
    async (action: (data: NonNullable<ContentData>) => Promise<boolean>) => {
      if (!contentData) return;
      try {
        const isSaved = await action(contentData);
        if (isSaved) {
          await updateTrackerMeta({ backupAt: formatDatetoMeta(new Date()) });
          addFlash(
            "success",
            t(locale, "body.flash.trackerSaved", { trackerId }),
          );
        }
      } catch (error) {
        addFlash("error", getErrorMessage(error, "Failed to back up tracker"));
      }
    },
    [addFlash, contentData, locale, trackerId, updateTrackerMeta],
  );

  const handleSave = useCallback(
    () => performBackup((data) => saveWithConfirmation(data)),
    [performBackup],
  );

  const handleShare = useCallback(
    () => performBackup((data) => shareFile<"tracker">(data)),
    [performBackup],
  );

  return { handleSave, handleShare };
}
