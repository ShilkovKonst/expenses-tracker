"use client";
import { useEffect, useMemo, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { parseMetaToDate } from "@/lib/utils/dateParser";
import { t } from "@/locales/locale";

export function useBackupDelay() {
  const { locale } = useGlobal();
  const { trackerMeta } = useTracker();
  const [showBackupDelay, setShowBackupDelay] = useState(true);

  const backupDelay = useMemo((): string | undefined => {
    if (!showBackupDelay) return;
    if (!trackerMeta) return;

    const backupDate = parseMetaToDate(trackerMeta?.backupAt);
    if (!backupDate) return t(locale, "body.flash.never");

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const now = new Date();
    const diffInMs = backupDate.getTime() - now.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    const abs = Math.abs(diffInDays);
    if (abs > 7)
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year:
          now.getFullYear() !== backupDate.getFullYear()
            ? "numeric"
            : undefined,
      }).format(backupDate);
    if (abs >= 3) return rtf.format(diffInDays, "day");
    return undefined;
  }, [locale, showBackupDelay, trackerMeta]);

  useEffect(() => {
    setShowBackupDelay(true);
  }, [setShowBackupDelay, trackerMeta]);

  return { backupDelay, dismissBackupDelay: () => setShowBackupDelay(false) };
}
