"use client";
import { t } from "@/locales/locale";
import { useRef } from "react";
import { loadTrackers, useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { useModal } from "@/context/ModalContext";
import { LoadIcon } from "@/lib/icons";
import { validate } from "@/lib/utils/dataValidator";
import { checkDBExists } from "@/idb/IDBManager";
import { createNPopulate } from "@/lib/utils/trackerDataSetter";
import { IconButton } from "../buttonComponents";
import { getMetadata } from "@/idb/CRUD/metaCRUD";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";

const LoadTrackerBlock = () => {
  const { locale, setAllTrackersMeta, setIsLoading } = useGlobal();
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();
  const { openModal } = useModal();
  const { addFlash } = useFlash();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFileDialog = (): void => {
    fileInputRef.current?.click();
  };

  const handleImport = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text: string = await file.text();
      const validated = validate(JSON.parse(text), locale);
      if (!validated.success) {
        addFlash(
          "error",
          `${t(locale, "body.flash.error.parseJson")}: ${validated.path} - ${
            validated.message
          }`
        );
        return;
      }

      const data = validated.data;
      const isExists = await checkDBExists(data.meta.id);
      if (isExists) {
        const oldTrackerMeta = await getMetadata(data.meta.id);
        if (oldTrackerMeta) {
          openModal("merge", {
            importTrackerBody: data,
            oldTrackerMeta,
          });
        } else {
          openModal("merge", {
            importTrackerBody: data,
            oldTrackerMeta: null,
          });
        }
      } else {
        await createNPopulate(
          data,
          setAllTrackersMeta,
          setIsLoading,
          setTrackerId,
          setTrackerMeta,
          setTrackerTags,
          setTrackerYears
        );
        addFlash(
          "success",
          `${t(locale, "body.flash.trackerLoaded", {
            trackerId: data.meta.title,
          })}`
        );
        await loadTrackers(setAllTrackersMeta, setIsLoading);
      }
    } catch (err) {
      console.error("Import error:", err);
      addFlash(
        "error",
        getErrorMessage(err, t(locale, "body.flash.trackerLoadedError"))
      );
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 w-full overflow-hidden transition-[height] duration-300 ease-in-out">
      <p className="col-span-4 text-sm flex items-center">
        {t(locale, `body.form.tracker.loadTitle`)}
      </p>
      <IconButton
        value=""
        icon={<LoadIcon className="h-6 lg:h-5 w-6" />}
        title={t(locale, `body.buttons.load`)}
        handleClick={handleOpenFileDialog}
        customStyle="h-7.5 w-full lg:w-7 lg:h-6 lg:w-6 rounded bg-green-400 hover:bg-green-500"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="plain/text"
        onChange={handleImport}
        hidden
      />
    </div>
  );
};

export default LoadTrackerBlock;
