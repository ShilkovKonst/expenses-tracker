import { Month, MonthIdType, Months } from "@/lib/types/dataTypes";
import { MONTHS } from "../../constants";
import { createMonthId } from "../types/brand";

export function getMonthById<ID extends MonthIdType>(id: ID): Months {
  return MONTHS[id];
}

export function initEmptyMonths(): Record<number, Month> {
  const emptyMonths: Month[] = [];
  for (let i = 1 as MonthIdType; i <= 12; i++) {
    emptyMonths[i - 1] = {
      id: createMonthId(i),
      title: getMonthById(i),
      records: [],
      totalAmount: 0,
    };
  }
  const emptyMonthsObj: Record<number, Month> = {};
  for (const m of emptyMonths) {
    emptyMonthsObj[m.id] = m;
  }

  return emptyMonthsObj;
}

export function getMonthDays(year: number, month: number): number[] {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}
