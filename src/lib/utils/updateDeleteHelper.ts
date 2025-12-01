import { Dispatch, SetStateAction } from "react";
import { TrackerMeta } from "../types/dataTypes";
import { createMetadata, updateMetadata } from "@/idb/CRUD/metaCRUD";
import { formatDatetoMeta } from "./dateParser";

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
  meta: TrackerMeta | null,
  setTrackerMeta: Dispatch<SetStateAction<TrackerMeta | null>>
) {
  let newMeta: TrackerMeta;
  if (!meta) {
    newMeta = {
      createdAt: formatDatetoMeta(new Date()),
      updatedAt: formatDatetoMeta(new Date()),
    };
    await createMetadata(trackerId, newMeta);
  } else {
    const updatedAt = await updateMetadata(trackerId);
    newMeta = {
      ...meta,
      updatedAt,
    };
  }
  setTrackerMeta(newMeta);
}

// export const handleCreate = async (
//   trackerId: string,
//   newRecord: MonthRecord
// ) => {
//   const updNewRecord: MonthRecord = {
//     ...newRecord,
//     amount: parseInputAmountToDecimal(String(newRecord.amount)),
//   };
//   try {
//     const recordId = await createRecord(trackerId, updNewRecord);
//     updNewRecord.id = recordId;
//   } catch {
//     throw new Error("'Create record' transaction failed!");
//   }
// };

// export const handleUpdate = async (trackerId: string, record: MonthRecord) => {
//   const updRecord: MonthRecord = {
//     ...record,
//     amount: parseInputAmountToDecimal(String(record.amount)),
//   };
//   try {
//     await updateRecordById(trackerId, updRecord.id, updRecord);
//   } catch {
//     throw new Error("'Create record' transaction failed!");
//   }
// };

// export const handleDelete = async (trackerId: string, record: MonthRecord) => {
//   try {
//     await deleteRecordById(trackerId, record.id);
//   } catch {
//     throw new Error("'Delete record' transaction failed!");
//   }
// };

// if (trackerMeta) await updateMeta(trackerId, trackerMeta, setTrackerMeta);
// handleUpdate(updNewRecord, false);

// const handleUpdateDelete = (record: MonthRecord, isDelete: boolean) => {
//   if (!trackerMeta || !trackerYears) return;
//   if (!record) return;

//   const year = trackerYears[record.year];
//   if (!year) return;

//   const month = year.months[record.month];
//   if (!month) return;

//   const updRecord: MonthRecord = {
//     ...record,
//     amount: record.amount,
//   };

//   const { updated: updRecords, agg: totalAmount } = updateArray(
//     month.records,
//     updRecord,
//     (items) =>
//       items.reduce(
//         (sum, c) => (c.type === "income" ? sum + c.amount : sum - c.amount),
//         0
//       ),
//     isDelete
//   );
//   const updMonth: Month = {
//     ...month,
//     records: updRecords,
//     totalAmount: totalAmount,
//   };

//   const { updated: updMonths, agg: monthTotalAmount } = updateObject(
//     year.months,
//     updMonth,
//     (items) => items.reduce((sum, m) => sum + m.totalAmount, 0)
//   );
//   const updYear: Year = {
//     ...year,
//     months: updMonths,
//     totalAmount: monthTotalAmount,
//   };

//   const { updated: updYears } = updateObject(trackerYears, updYear);
//   setTrackerYears(updYears);
//   setTrackerMeta({
//     ...trackerMeta,
//     updatedAt: formatDatetoMeta(new Date()),
//   });
//   handleClear();
// };
