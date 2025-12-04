"use client";
import { t } from "@/locales/locale";
import { Dispatch, SetStateAction, useRef } from "react";
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

type LoadTrackerType = {
  setMessage: Dispatch<SetStateAction<string | null>>;
};

const LoadTrackerBlock = ({ setMessage }: LoadTrackerType) => {
  const { locale, setTrackerIds } = useGlobal();
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();
  const { openModal } = useModal();

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
      const validated = validate(JSON.parse(text));
      if (!validated.success) {
        setMessage("❌ Файл не соответствует ожидаемой структуре.");
        console.log(validated.message);
        console.log(validated.path);
        return;
      }

      const data = validated.data;
      const isExists = await checkDBExists(data.id);
      console.log("isExists", isExists);
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

      setMessage(`✅ Импорт из "${file.name}" завершён.`);
    } catch (err) {
      console.error("Import error:", err);
      setMessage("❌ Ошибка при чтении или парсинге JSON-файла.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // async function createNPopulate(data: TrackerType) {
  //   try {
  //     await createTrackerUtil(data);
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("error createTrackerUtil");
  //   }
  //   if (localStorage) {
  //     const trackersString = localStorage.getItem(TRACKER_IDS);
  //     if (trackersString) {
  //       const trackerList: string[] = JSON.parse(trackersString);
  //       const newIds = [...trackerList, data.id];
  //       localStorage.setItem(TRACKER_IDS, JSON.stringify(newIds));
  //       setTrackerIds(newIds)
  //     }
  //   }
  //   setParsedData(
  //     data,
  //     setTrackerId,
  //     setTrackerMeta,
  //     setTrackerTags,
  //     setTrackerYears
  //   );
  // }

  return (
    <div className="grid grid-cols-5 gap-2 w-full mt-2 overflow-hidden transition-[height] duration-300 ease-in-out">
      <p className="col-span-4 text-sm">
        {t(locale, `body.form.tracker.loadTitle`)}
      </p>
      <IconButton
        value=""
        icon={<LoadIcon className="w-5 h-5" />}
        title="Load file"
        handleClick={handleOpenFileDialog}
        customStyle="mr-auto h-7 w-7 bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
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
