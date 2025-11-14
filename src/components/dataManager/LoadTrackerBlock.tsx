import { GlobalDataType } from "@/types/formTypes";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { LoadIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";

type LoadTrackerType = {
  validate?: (obj: unknown) => obj is GlobalDataType;
  onImport: (imported: GlobalDataType) => void;
  setMessage: Dispatch<SetStateAction<string | null>>;
};

const LoadTrackerBlock = ({
  validate,
  onImport,
  setMessage,
}: LoadTrackerType) => {
  const { locale } = useGlobal();
  const { trackerMeta, trackerYears, setTrackerMeta, setTrackerYears } =
    useTracker();

  const [loadedId, setLoadedId] = useState<string>("");
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
      const parsed: GlobalDataType = JSON.parse(text);

      // если передали валидатор — используем его; иначе доверяем и кастим
      if (validate) {
        if (!validate(parsed)) {
          setMessage("❌ Файл не соответствует ожидаемой структуре.");
          return;
        }
        // onImport(parsed);
      } else {
        // без валидации — осторожно
        // onImport(parsed as GlobalDataType);
        // сделать логику проверки импортируемого файла
        // сделать модал с предложением слияния, замены или дубля при совпадении айли трекера с уже зарегистрированным
        setLoadedId(parsed.id);
        setIsLoaded(true);
      }
      console.log(parsed);

      setMessage(`✅ Импорт из "${file.name}" завершён.`);
    } catch (err) {
      console.error("Import error:", err);
      setMessage("❌ Ошибка при чтении или парсинге JSON-файла.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (localStorage) {
        const raw = localStorage.getItem(loadedId);
        if (raw) {
        } else {
        }
      }
      setIsLoaded(false);
    }
  }, [isLoaded]);

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
