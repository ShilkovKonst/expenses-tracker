import { Month, MonthIdType, Months } from "@/types/formTypes";
import { MONTHS } from "../constants";

export function getMonthById<ID extends MonthIdType>(id: ID): Months {
  return MONTHS[id];
}

export function getMonthIdByTitle<T extends Months>(title: T): MonthIdType {
  const entry = Object.entries(MONTHS).find(([, v]) => v === title);
  if (!entry) {
    throw new Error(`Month with title ${title} not found`);
  }
  return Number(entry[0]) as MonthIdType;
}

export function initEmptyMonths(): Month[] {
  const emptyMonths: Month[] = [];
  for (let i = 1 as MonthIdType; i <= 12; i++) {
    emptyMonths[i - 1] = {
      id: i,
      title: getMonthById(i),
      records: [],
      totalAmount: 0,
    };
  }
  return emptyMonths;
}

export function getMonthDays(year: number, month: number): number[] {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}
