/* eslint-disable react-hooks/exhaustive-deps */
import { GlobalDataType } from "@/types/formTypes";
import { t } from "@/locales/locale";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { useModal } from "@/context/ModalContext";
import { LoadIcon } from "@/lib/icons";
import { validate } from "@/lib/utils/dataValidator";
import { TRACKER_IDS } from "@/lib/constants";
import { useModalBody } from "@/hooks/useModalBody";

type LoadTrackerType = {
  onImport: (imported: GlobalDataType) => void;
  setMessage: Dispatch<SetStateAction<string | null>>;
};

const LoadTrackerBlock = ({ onImport, setMessage }: LoadTrackerType) => {
  const { locale, setTrackerIds } = useGlobal();
  const {
    trackerId,
    trackerMeta,
    trackerTags,
    trackerYears,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears,
  } = useTracker();
  const { setIsModal, setModalType, setModalBody } = useModal();
  const { globalBody } = useModalBody();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
      setIsLoaded(true);
      setModalBody(validated.data);
      console.log("success");
      // setLoadedTracker(parsed);
      // onImport(parsed);

      setMessage(`✅ Импорт из "${file.name}" завершён.`);
    } catch (err) {
      console.error("Import error:", err);
      setMessage("❌ Ошибка при чтении или парсинге JSON-файла.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // console.log(globalBody);
  // console.log(isLoaded);
  useEffect(() => {
    if (isLoaded && globalBody) {
      console.log("isLoaded && globalBody");
      if (localStorage) {
        const raw = localStorage.getItem(TRACKER_IDS);
        if (raw) {
          console.log("raw");
          const parsed = JSON.parse(raw);
          if (
            Array.isArray(parsed) &&
            !parsed.some((p) => p === globalBody.id)
          ) {
            console.log("raw");
            const newParsed = [...parsed, globalBody.id];
            localStorage.setItem(TRACKER_IDS, JSON.stringify(newParsed));
            setTrackerIds(newParsed);
          }
        }
        console.log("!raw");
        const rawTracker = localStorage.getItem(globalBody.id);
        if (rawTracker) {
          // const parsedTracker = JSON.parse(rawTracker);
          setIsModal(true);
          setModalType("mergeTrackerBlock");
        } else {
          console.log("!rawTracker");
        }
      }
      setIsLoaded(false);
    }
  }, [isLoaded, globalBody]);

  return (
    <div className="grid grid-cols-5 gap-2 w-full mt-2 overflow-hidden transition-[height] duration-300 ease-in-out">
      <p className="col-span-4 text-sm">
        {t(locale, `body.form.tracker.loadTitle`)}
      </p>
      <TopLevelButton
        icon={<LoadIcon className="w-5 h-5" />}
        title="Load file"
        handleClick={handleOpenFileDialog}
        style="col-span-1 mr-auto h-7 w-7 rounded-sm cursor-pointer flex justify-center items-center 
                  bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600
                  transition-colors duration-200 ease-in-out"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleImport}
      />
    </div>
  );
};

export default LoadTrackerBlock;
