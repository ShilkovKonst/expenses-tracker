import { createUpdateMetadata } from "@/idb/metaCRUD";
import { MetadataType } from "../types/dataTypes";
import { Dispatch, SetStateAction } from "react";
import { TrackerMeta } from "@/context/TrackerContext";
import { formatDatetoMeta } from "./trackerDataSetter";

export function updateObject<T extends { id: number | string }>(
  items: Record<number | string, T>,
  newItem: T,
  aggregate?: (items: T[]) => number,
  isDelete?: boolean
): { updated: Record<number | string, T>; agg: number } {
  const updated: Record<number | string, T> = { ...items };
  if (isDelete) delete items[newItem.id];
  else items[newItem.id] = newItem;
  const agg = aggregate ? aggregate(Object.values(updated)) : 0;
  return {
    updated,
    agg: Math.round(agg * 100) / 100,
  };
}

export function updateArray<T extends { id: number | string }>(
  items: T[],
  newItem: T,
  aggregate: (items: T[]) => number,
  isDelete?: boolean
): { updated: T[]; agg: number } {
  const updated = isDelete
    ? items.filter((item) => item.id !== newItem.id)
    : [...items.filter((item) => item.id !== newItem.id), newItem];
  const agg = aggregate(updated);
  return {
    updated,
    agg: Math.round(agg * 100) / 100,
  };
}

export async function updateMeta(
  trackerId: string,
  meta: MetadataType,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta>>
) {
  const newMeta = {
    ...meta,
    updatedAt: formatDatetoMeta(new Date()),
  };
  await createUpdateMetadata(trackerId, newMeta);
  setTrackerMeta(newMeta);
}
