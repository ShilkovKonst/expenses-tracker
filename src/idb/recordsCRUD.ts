/* eslint-disable @typescript-eslint/no-unused-vars */
import { RECORDS_STORE } from "@/constants";
import { MonthRecord } from "../lib/types/dataTypes";
import { performDBOperation } from "./IDBManager";

export async function createRecord(
  trackerId: string,
  record: Partial<MonthRecord>
): Promise<number> {
  const { id, ...rec } = record;
  return performDBOperation<number>(
    trackerId,
    RECORDS_STORE,
    "readwrite",
    (store) => store.add(rec)
  );
}

export async function getRecordById(
  trackerId: string,
  recordId: number
): Promise<MonthRecord | undefined> {
  return performDBOperation<MonthRecord | undefined>(
    trackerId,
    RECORDS_STORE,
    "readonly",
    (store) => store.get(recordId)
  );
}

export async function getRecordsByYear(
  trackerId: string,
  year: number
): Promise<MonthRecord[]> {
  return performDBOperation<MonthRecord[]>(
    trackerId,
    RECORDS_STORE,
    "readonly",
    (store) => {
      const index = store.index("by_year");
      return index.getAll(year);
    }
  );
}

export async function getRecordsByYearMonth(
  trackerId: string,
  year: number,
  month: number
): Promise<MonthRecord[]> {
  return performDBOperation<MonthRecord[]>(
    trackerId,
    RECORDS_STORE,
    "readonly",
    (store) => store.index("by_year_month").getAll([year, month])
  );
}

export async function getAllRecords(trackerId: string): Promise<MonthRecord[]> {
  return performDBOperation<MonthRecord[]>(
    trackerId,
    RECORDS_STORE,
    "readonly",
    (store) => store.getAll()
  );
}

export async function updateRecord(
  trackerId: string,
  record: MonthRecord
): Promise<void> {
  return performDBOperation<void>(
    trackerId,
    RECORDS_STORE,
    "readwrite",
    (store) => store.put(record)
  );
}

export async function deleteRecord(
  trackerId: string,
  recordId: number
): Promise<void> {
  return performDBOperation<void>(
    trackerId,
    RECORDS_STORE,
    "readwrite",
    (store) => store.delete(recordId)
  );
}
