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
  const blob = new Blob([json], { type: "text/plain" });
  const updDate = contentData.meta.updatedAt.replaceAll(/[\/\:]/g, "-");
  const fileName = `${contentData.meta.title}_${updDate}`;

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

export async function shareFile<T extends keyof ContentTypes>(
  data: ContentTypes[T]
) {
  const { blob, fileName } = generateFileContent<T>(data);
  const file = new File([blob], `${fileName}.txt`, {
    type: "text/plain",
  });
  // console.log(canShareFiles(file));
  // if (canShareFiles(file)) {
  try {
    await navigator.share({
      files: [file],
      title: fileName,
      // text: json,
    });
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      console.error("Native sharing error:", error);
    }
  }
  // } else {
  //   openCustomModal();
  // }
}

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const canShareFiles = (file: File): boolean => {
  const hasAPI =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!navigator.canShare;
  return hasAPI && isMobileDevice() && navigator.canShare({ files: [file] });
};
