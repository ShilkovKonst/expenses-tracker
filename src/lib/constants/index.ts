import { Month, Months } from "@/types/formTypes";

export const MONTHS: Months[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const EMPTY_FORM_MONTHS: Month[] = [
  { id: 1, title: "january", operations: [], totalAmount: 0 },
  {
    id: 2,
    title: "february",
    operations: [],
    totalAmount: 0,
  },
  { id: 3, title: "march", operations: [], totalAmount: 0 },
  { id: 4, title: "april", operations: [], totalAmount: 0 },
  { id: 5, title: "may", operations: [], totalAmount: 0 },
  { id: 6, title: "june", operations: [], totalAmount: 0 },
  { id: 7, title: "july", operations: [], totalAmount: 0 },
  { id: 8, title: "august", operations: [], totalAmount: 0 },
  {
    id: 9,
    title: "september",
    operations: [],
    totalAmount: 0,
  },
  {
    id: 10,
    title: "october",
    operations: [],
    totalAmount: 0,
  },
  {
    id: 11,
    title: "november",
    operations: [],
    totalAmount: 0,
  },
  {
    id: 12,
    title: "december",
    operations: [],
    totalAmount: 0,
  },
];

export const CURRENT_YEAR = new Date().getFullYear();
