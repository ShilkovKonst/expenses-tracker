import { MonthFormType, Months } from "@/types/formTypes";

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

export const EMPTY_FORM_MONTHS: MonthFormType[] = [
  { id: 1, title: "january", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  {
    id: 2,
    title: "february",
    costs: [],
    costsAmount: 0,
    balance: 0,
    budget: 0,
  },
  { id: 3, title: "march", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  { id: 4, title: "april", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  { id: 5, title: "may", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  { id: 6, title: "june", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  { id: 7, title: "july", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  { id: 8, title: "august", costs: [], costsAmount: 0, balance: 0, budget: 0 },
  {
    id: 9,
    title: "september",
    costs: [],
    costsAmount: 0,
    balance: 0,
    budget: 0,
  },
  {
    id: 10,
    title: "october",
    costs: [],
    costsAmount: 0,
    balance: 0,
    budget: 0,
  },
  {
    id: 11,
    title: "november",
    costs: [],
    costsAmount: 0,
    balance: 0,
    budget: 0,
  },
  {
    id: 12,
    title: "december",
    costs: [],
    costsAmount: 0,
    balance: 0,
    budget: 0,
  },
];

export const CURRENT_YEAR = new Date().getFullYear();
