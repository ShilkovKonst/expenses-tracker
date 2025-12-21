"use client";
import { Flash, useFlash } from "@/context/FlashContext";
import FlashMessage from "./FlashMessage";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

export default function FlashBlock() {
  const { locale } = useGlobal();
  const { flash, closeFlash } = useFlash();

  if (flash.length === 0) return null;

  return (
    <div className="fixed w-full md:w-fit top-0 md:top-1 md:right-1 z-1000 md:space-y-2">
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
