import { MONTHS_STORE } from "@/constants";
import { MonthIDBType } from "../types";
import { performDBOperation } from "../IDBManager";

export async function createMonth(
  trackerId: string,
  year: number,
  orderNo: number,
  title: string,
  recordsNo: number,
  amount: number
): Promise<number> {
  const monthEntry: Omit<MonthIDBType, "id"> = {
    year,
    orderNo,
    title,
    recordsNo,
    amount,
  };
  return performDBOperation<number>(
    trackerId,
    MONTHS_STORE,
    "readwrite",
    (store) => store.add(monthEntry)
  );
}

export async function getAll(
  trackerId: string
): Promise<Record<number, MonthIDBType>> {
  const monthsArray = await performDBOperation<MonthIDBType[]>(
    trackerId,
    MONTHS_STORE,
    "readonly",
    (store) => store.getAll()
  );

  const result: Record<number, MonthIDBType> = {};
  for (const month of monthsArray) {
    result[month.id] = { ...month };
  }
  return result;
}

export async function getAllByYear(
  trackerId: string,
  year: number
): Promise<Record<number, MonthIDBType>> {
  const monthsArray = await performDBOperation<MonthIDBType[]>(
    trackerId,
    MONTHS_STORE,
    "readonly",
    (store) => {
      const index = store.index("by_year");
      return index.getAll(year);
    }
  );

  const result: Record<number, MonthIDBType> = {};
  for (const month of monthsArray) {
    result[month.id] = { ...month };
  }
  return result;
}

export async function getById(
  trackerId: string,
  monthId: number
): Promise<MonthIDBType | undefined> {
  return performDBOperation<MonthIDBType | undefined>(
    trackerId,
    MONTHS_STORE,
    "readonly",
    (store) => store.get(monthId)
  );
}

export async function updateById(
  trackerId: string,
  updMonth: MonthIDBType
): Promise<number> {
  return performDBOperation<number>(
    trackerId,
    MONTHS_STORE,
    "readwrite",
    (store) => store.put(updMonth)
  );
}

export async function deleteById(
  trackerId: string,
  monthId: number
): Promise<void> {
  return performDBOperation<void>(
    trackerId,
    MONTHS_STORE,
    "readwrite",
    (store) => store.delete(monthId)
  );
}
