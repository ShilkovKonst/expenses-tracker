import {
  MonthRecord,
  TrackerMeta,
  TrackerMonths,
  TrackerTags,
  TrackerYears,
} from "../types/dataTypes";

type ContentTypes = {
  tracker: {
    id: string;
    meta: TrackerMeta;
    tags: TrackerTags;
    years: TrackerYears;
    totalAmount: number;
  };
  year: {
    id: string;
    meta: TrackerMeta;
    year: number;
    months: TrackerMonths;
    totalAmount: number;
  };
  month: {
    id: string;
    meta: TrackerMeta;
    year: number;
    month: number;
    records: MonthRecord[];
    totalAmount: number;
  };
};

export function generateFileContent<T extends keyof ContentTypes>(
  contentData: ContentTypes[T]
) {
  const json = JSON.stringify(contentData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const updDate = contentData.meta.updatedAt.replaceAll(/[\/\:]/g, "-");
  const fileName = `${contentData.id}_${updDate}`;

  return { blob, fileName };
}

export function saveFiletoLocal<T extends keyof ContentTypes>(
  contentData: ContentTypes[T]
) {
  const { blob, fileName } = generateFileContent<T>(contentData);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}`;
  a.click();

  URL.revokeObjectURL(url);
}

export function shareFile<T extends keyof ContentTypes>(
  contentData: ContentTypes[T]
) {
  if (!navigator.share) {
    alert("Web Share API не поддерживается в вашем браузере/ОС.");
    return;
  }
  const { blob, fileName } = generateFileContent<T>(contentData);
  const fileToShare = new File([blob], fileName, {
    type: "application/json",
  });
  const fileArray = [fileToShare];
  if (!navigator.canShare || !navigator.canShare({ files: fileArray })) {
    alert(
      "Ваш браузер/ОС не поддерживает расшаривание файлов через Web Share API."
    );
    return;
  }
  const json = JSON.stringify(contentData, null, 2);
  navigator
    .share({
      //   files: fileArray,

      title: fileName,
      text: json,
    })
    .then(() => console.log("Файл успешно расшарен!"))
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Ошибка при расшаривании файла:", error);
      }
    });
}
