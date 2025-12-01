import { YEARS_STORE } from "@/constants";
import { YearIDBType } from "../types";
import { performDBOperation } from "../IDBManager";

export async function createYear(
  trackerId: string,
  newYear: YearIDBType
): Promise<number> {
  return performDBOperation<number>(
    trackerId,
    YEARS_STORE,
    "readwrite",
    (store) => store.add(newYear)
  );
}

export async function getAll(
  trackerId: string
): Promise<Record<number, YearIDBType>> {
  const yearsArray = await performDBOperation<YearIDBType[]>(
    trackerId,
    YEARS_STORE,
    "readonly",
    (store) => store.getAll()
  );

  const result: Record<number, YearIDBType> = {};
  for (const year of yearsArray) {
    result[year.id] = { ...year };
  }
  return result;
}

export async function getById(
  trackerId: string,
  yearId: number
): Promise<YearIDBType | undefined> {
  return performDBOperation<YearIDBType | undefined>(
    trackerId,
    YEARS_STORE,
    "readonly",
    (store) => store.get(yearId)
  );
}

export async function updateById(
  trackerId: string,
  updYear: YearIDBType
): Promise<number> {
  return performDBOperation<number>(
    trackerId,
    YEARS_STORE,
    "readwrite",
    (store) => store.put(updYear)
  );
}

export async function deleteById(
  trackerId: string,
  yearId: number
): Promise<void> {
  return performDBOperation<void>(
    trackerId,
    YEARS_STORE,
    "readwrite",
    (store) => store.delete(yearId)
  );
}
