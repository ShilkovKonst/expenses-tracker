import { CURRENT_YEAR } from "@/constants";
import { Month, MonthRecord, Year } from "../types/dataTypes";
import { getMonthById } from "./monthHelper";

export function populateYears(allRecords: MonthRecord[]) {
  const years: Record<number, Year> = {};

  for (const record of allRecords) {
    if (!years[record.year]) {
      years[record.year] = { id: record.year, months: {}, totalAmount: 0 };
    }

    const year = years[record.year];
    if (!year.months[record.month]) {
      year.months[record.month] = populateEmptyMonth(
        record.month,
        getMonthById(record.month)
      );
    }

    const month: Month = year.months[record.month];
    month.records.push(record);
    month.totalAmount +=
      record.type === "income" ? record.amount : -record.amount;
    year.totalAmount +=
      record.type === "income" ? record.amount : -record.amount;
  }

  if (!years[CURRENT_YEAR]) {
    years[CURRENT_YEAR] = populateEmptyYear();
  }

  let monthId = 1;
  for (const y of Object.values(years)) {
    while (monthId <= 12) {
      if (!y.months[monthId]) {
        y.months[monthId] = populateEmptyMonth(monthId, getMonthById(monthId));
      }
      monthId++;
    }
  }

  return years;
}

function populateEmptyYear(): Year {
  return {
    id: CURRENT_YEAR,
    months: {},
    totalAmount: 0,
  };
}

function populateEmptyMonth(id: number, title: string): Month {
  return {
    id: id,
    title: title,
    records: [],
    totalAmount: 0,
  };
}
