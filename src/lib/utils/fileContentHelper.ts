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
  contentData: ContentTypes[T],
) {
  const json = JSON.stringify(contentData, null, 2);
  const blob = new Blob([json], { type: "text/plain" });
  const updDate = contentData.meta.updatedAt.replaceAll(/[\/\:]/g, "-");
  const fileName = `${contentData.meta.title}_${updDate}`;

  return { blob, fileName };
}

export function saveFiletoLocal<T extends keyof ContentTypes>(
  contentData: ContentTypes[T],
) {
  const { blob, fileName } = generateFileContent<T>(contentData);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}`;
  a.click();

  URL.revokeObjectURL(url);
}

export async function saveWithConfirmation<T extends keyof ContentTypes>(
  contentData: ContentTypes[T],
) {
  const { blob, fileName } = generateFileContent<T>(contentData);
  if ("showSaveFilePicker" in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "Text Document",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Native sharing error:", error);
      }
      return false;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}`;
  a.click();

  URL.revokeObjectURL(url);
  return true;
}

export async function shareFile<T extends keyof ContentTypes>(
  data: ContentTypes[T],
) {
  const { blob, fileName } = generateFileContent<T>(data);
  const file = new File([blob], `${fileName}.txt`, {
    type: "text/plain",
  });
  try {
    await navigator.share({
      files: [file],
      title: fileName,
    });
    return true;
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      console.error("Native sharing error:", error);
    }
    return false;
  }
}

export const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const canShareFiles = (file: File): boolean => {
  const hasAPI =
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!navigator.canShare;
  return hasAPI && isMobileDevice() && navigator.canShare({ files: [file] });
};
