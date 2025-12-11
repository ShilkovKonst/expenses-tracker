"use client";
import { t } from "@/locales/locale";
import { useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { useModal } from "@/context/ModalContext";
import { LoadIcon } from "@/lib/icons";
import { validate } from "@/lib/utils/dataValidator";
import { updateLocalTrackerIds } from "@/lib/utils/updateLocalTrackerIds";
import { checkDBExists } from "@/idb/IDBManager";
import { createNPopulate } from "@/lib/utils/trackerDataSetter";
import { IconButton } from "../buttonComponents";
import { getMetadata } from "@/idb/CRUD/metaCRUD";
import { Tracker } from "@/lib/types/dataTypes";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";

const LoadTrackerBlock = () => {
  const { locale, setTrackerIds } = useGlobal();
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
      // можно добавить проверку mime-type: file.type === "application/json"
      const text: string = await file.text();
      const validated = validate(JSON.parse(text), locale);
      if (!validated.success) {
        addFlash(
          "error",
          `${t(locale, "body.flash.error.parseJson")}: ${validated.path} - ${
            validated.message
          }`
        );
        console.log(validated.message);
        console.log(validated.path);
        return;
      }

      const data = validated.data;
      const isExists = await checkDBExists(data.id);
      if (isExists) {
        const oldTrackerMeta = await getMetadata(data.id);
        if (oldTrackerMeta) {
          openModal("merge", {
            importTrackerBody: data,
            oldTrackerMeta,
            onConfirm: (data: Tracker) =>
              createNPopulate(
                data,
                setTrackerIds,
                setTrackerId,
                setTrackerMeta,
                setTrackerTags,
                setTrackerYears
              ),
          });
        } else {
          openModal("merge", {
            importTrackerBody: data,
            oldTrackerMeta: null,
            onConfirm: (data: Tracker) =>
              createNPopulate(
                data,
                setTrackerIds,
                setTrackerId,
                setTrackerMeta,
                setTrackerTags,
                setTrackerYears
              ),
          });
        }
      } else {
        await createNPopulate(
          data,
          setTrackerIds,
          setTrackerId,
          setTrackerMeta,
          setTrackerTags,
          setTrackerYears
        );
      }
      if (localStorage) {
        updateLocalTrackerIds(data.id, setTrackerIds);
      }

      addFlash(
        "success",
        `${t(locale, "body.flash.trackerLoaded", { fileName: file.name })}`
      );
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
    <div className="grid grid-cols-5 gap-2 w-full overflow-hidden transition-[height] duration-300 ease-in-out">
      <p className="ml-0.5 col-span-4 text-sm flex items-center">
        {t(locale, `body.form.tracker.loadTitle`)}
      </p>
      <IconButton
        value=""
        icon={<LoadIcon className="w-4 h-4" />}
        title={t(locale, `body.buttons.load`)}
        handleClick={handleOpenFileDialog}
        customStyle="ml-0.5 mr-auto h-8 w-8 md:h-6 md:w-6 rounded bg-green-400 hover:bg-green-500"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImport}
        hidden
      />
    </div>
  );
};

export default LoadTrackerBlock;
