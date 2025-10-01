import { MonthFormType, MonthIdType, Months } from "@/types/formTypes";

export const year = {
  1: "january",
  2: "february",
  3: "march",
  4: "april",
  5: "may",
  6: "june",
  7: "july",
  8: "august",
  9: "september",
  10: "october",
  11: "november",
  12: "december",
} as const;

export function getMonthById<ID extends MonthIdType>(id: ID): Months {
  return year[id];
}

export function getMonthIdByTitle<T extends Months>(title: T): MonthIdType {
  const entry = Object.entries(year).find(([, v]) => v === title);
  if (!entry) {
    throw new Error(`Month with title ${title} not found`);
  }
  return Number(entry[0]) as MonthIdType;
}

export function initEmptyMonths(): Record<MonthIdType, MonthFormType> {
  const emptyMonths: Record<MonthIdType, MonthFormType> = {} as Record<
    MonthIdType,
    MonthFormType
  >;
  for (let i = 1 as MonthIdType; i <= 12; i++) {
    emptyMonths[i] = {
      title: getMonthById(i),
      costs: [],
      monthCosts: 0,
      budget: 0,
    };
  }
  return emptyMonths;
}
