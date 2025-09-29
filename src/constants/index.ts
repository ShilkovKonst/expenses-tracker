import { MonthIdType, Months } from "@/types/formTypes";

export const MONTHS: { id: MonthIdType; title: Months }[] = [
  { id: 1, title: "january" },
  { id: 2, title: "february" },
  { id: 3, title: "march" },
  { id: 4, title: "april" },
  { id: 5, title: "may" },
  { id: 6, title: "june" },
  { id: 7, title: "july" },
  { id: 8, title: "august" },
  { id: 9, title: "september" },
  { id: 10, title: "october" },
  { id: 11, title: "november" },
  { id: 12, title: "december" },
];

export const CURRENT_YEAR = new Date().getFullYear();
