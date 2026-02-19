"use client";
import { Flash, useFlash } from "@/context/FlashContext";
import FlashMessage from "./FlashMessage";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useBackupDelay } from "@/hooks/useBackupDelay";
import { useStoragePersistence } from "@/hooks/useStoragePersistence";

export default function FlashBlock() {
  const { locale } = useGlobal();
  const { flash, closeFlash } = useFlash();
  const { backupDelay, dismissBackupDelay } = useBackupDelay();
  const { showWarning: showPersistWarning, dismissWarning: dismissPersistWarning } = useStoragePersistence();

  if (flash.length === 0 && !backupDelay && !showPersistWarning) return null;

  return (
    <div className="fixed w-full md:w-fit top-0 left-0 right-0 md:top-1 md:left-auto md:right-1 z-1000 md:space-y-2">
      {backupDelay && (
        <FlashMessage
          flash={{
            id: "",
            type: "warning",
            message: [
              t(locale, "body.flash.lastSaveDate", { backupDelay }),
              t(locale, "body.flash.trackerNeedToSave"),
            ],
          }}
          closeFlash={dismissBackupDelay}
          closeButtonTitle={t(locale, "body.buttons.close")}
        />
      )}
      {showPersistWarning && (
        <FlashMessage
          flash={{
            id: "",
            type: "warning",
            message: t(locale, "body.flash.storagePersistDenied"),
          }}
          closeFlash={dismissPersistWarning}
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
