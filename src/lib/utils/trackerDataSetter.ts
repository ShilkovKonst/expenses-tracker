"use client";
import {
  TrackerMeta,
  TrackerTags,
  TrackerYears,
} from "@/context/TrackerContext";
import { GlobalDataType, Year } from "@/lib/types/dataTypes";
import { Dispatch, SetStateAction } from "react";
import { createUpdateMetadata } from "@/idb/metaCRUD";
import { CURRENT_YEAR } from "@/constants";
import { initEmptyMonths } from "./monthHelper";

export function buildFileName(dataId: string | undefined): string {
  const prefix = dataId ?? "tracker";
  const ts = formatDatetoFilename(new Date());

  return `${prefix}_${ts}.json`;
}

function formatDatetoFilename(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");

  return `${dd}${mm}${yyyy}_${hh}${min}${sec}`;
}

export function setParsedData(
  data: GlobalDataType,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears>>
) {
  setTrackerId(data.id);
  setTrackerMeta({ ...data.meta });
  setTrackerTags({ ...data.tagsPool });
  setTrackerYears({ ...data.years });
}

export async function setNewData(
  newTrackerId: string,
  setTrackerId: Dispatch<SetStateAction<string>>,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>,
  setTrackerTags: Dispatch<SetStateAction<TrackerTags>>,
  setTrackerYears: Dispatch<SetStateAction<TrackerYears>>
) {
  const newMeta = {
    createdAt: formatDatetoMeta(new Date()),
    updatedAt: formatDatetoMeta(new Date()),
  };
  await createUpdateMetadata(newTrackerId, newMeta);

  const newYears: Record<number, Year> = {
    [CURRENT_YEAR]: {
      id: CURRENT_YEAR,
      months: initEmptyMonths(),
      totalAmount: 0,
    },
  };

  setTrackerId(newTrackerId);
  setTrackerMeta(newMeta);
  setTrackerTags({});
  setTrackerYears(newYears);
}

export function formatDatetoMeta(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy}_${hh}:${min}:${sec}`;
}

export function parseMetaDate(str: string): Date {
  const { 0: datePart, 1: timePart } = str.split("_");
  if (!datePart || !timePart) throw new Error("Invalid meta date format");  

  const { 0: dd, 1: mm, 2: yyyy } = datePart.split("/").map(Number);
  const { 0: hh, 1: min, 2: sec } = timePart.split(":").map(Number);
  
  return new Date(yyyy, mm - 1, dd, hh, min, sec);
}
