"use client";
import { useEffect, useRef, useState } from "react";
import { GlobalDataType } from "@/types/formTypes";
import { useTracker } from "@/context/TrackerContext";
import { buildFileName } from "@/lib/utils/trackerDataSetter";

interface LocalFileManagerProps {
  onImport: (imported: GlobalDataType) => void;
  validate?: (obj: unknown) => obj is GlobalDataType;
}

const LocalFileManager: React.FC<LocalFileManagerProps> = ({
  onImport,
  validate,
}) => {
  const { trackerId, trackerTags, trackerYears, trackerMeta } = useTracker();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState<GlobalDataType>();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (trackerId && trackerTags && trackerYears && trackerMeta)
      setData({
        id: trackerId,
        meta: { ...trackerMeta },
        tagsPool: { ...trackerTags },
        years: [...trackerYears],
        totalAmount: trackerYears.reduce((acc, y) => acc + y.totalAmount, 0),
      });
  }, [trackerId, trackerMeta, trackerTags, trackerYears]);

  const handleExport = (): void => {
    if (data)
      try {
        const json = JSON.stringify(data, null, 2);
        const blob: Blob = new Blob([json], { type: "application/json" });
        const url: string = URL.createObjectURL(blob);

        const a: HTMLAnchorElement = document.createElement("a");
        a.href = url;
        a.download = buildFileName(data?.id);
        // programmatic click
        a.click();

        // освобождаем ресурсы
        URL.revokeObjectURL(url);

        setMessage("✅ Экспорт завершён — файл загружен в папку загрузок.");
      } catch (err) {
        console.error("Export error:", err);
        setMessage("❌ Ошибка при экспорте файла.");
      }
    else setMessage("❌ No data to export.");
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
      const parsed: unknown = JSON.parse(text);

      // если передали валидатор — используем его; иначе доверяем и кастим
      if (validate) {
        if (!validate(parsed)) {
          setMessage("❌ Файл не соответствует ожидаемой структуре.");
          return;
        }
        onImport(parsed);
      } else {
        // без валидации — осторожно
        onImport(parsed as GlobalDataType);
      }
      console.log(parsed);

      setMessage(`✅ Импорт из "${file.name}" завершён.`);
    } catch (err) {
      console.error("Import error:", err);
      setMessage("❌ Ошибка при чтении или парсинге JSON-файла.");
    } finally {
      // сброс значения input, чтобы можно было загрузить тот же файл повторно
      if (e.target) e.target.value = "";
    }
  };

  // --- Вызов скрытого input через кнопку
  const handleOpenFileDialog = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleOpenFileDialog}
          className="px-3 py-2 rounded bg-green-600 text-white"
        >
          📂 Загрузить JSON
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-2 rounded bg-blue-600 text-white"
        >
          💾 Сохранить JSON
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleImport}
      />

      {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
    </div>
  );
};

export default LocalFileManager;
