"use client";
import { Flash, useFlash } from "@/context/FlashContext";
import FlashMessage from "./FlashMessage";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { parseMetaToDate } from "@/lib/utils/dateParser";
import { useMemo, useState } from "react";

export default function FlashBlock() {
  const { locale } = useGlobal();
  const { trackerMeta } = useTracker();
  const { flash, closeFlash } = useFlash();

  const { 0: showBackupDelay, 1: setShowBackupDelay } = useState(true);

  const backupDelay = useMemo(() => {
    if (!showBackupDelay) return;
    if (!trackerMeta) return;

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const now = new Date();
    const backupDate = parseMetaToDate(
      trackerMeta?.backupAt ?? trackerMeta.createdAt,
    );

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
  }, [locale, showBackupDelay, trackerMeta]);

  if (flash.length === 0 && !backupDelay) return null;

  return (
    <div className="fixed w-full md:w-fit top-0 md:top-1 md:right-1 z-1000 md:space-y-2">
      {backupDelay && (
        <FlashMessage
          flash={{
            id: "",
            type: "warning",
            message: t(locale, "body.flash.trackerNeedToSave", { backupDelay }),
          }}
          closeFlash={() => setShowBackupDelay(false)}
          closeButtonTitle={t(locale, "body.buttons.close")}
        />
      )}
      {flash.map((flash: Flash) => (
        <FlashMessage
          key={flash.id}
          flash={flash}
          closeFlash={closeFlash}
          closeButtonTitle={t(locale, "body.buttons.close")}
        />
      ))}
    </div>
  );
}
