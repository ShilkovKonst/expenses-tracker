import { MonthFormType, MonthIdType, Months } from "@/types/formTypes";

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

export const EMPTY_FORM_MONTHS: Record<MonthIdType, MonthFormType> = {
  "1": { title: "january", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "2": { title: "february", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "3": { title: "march", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "4": { title: "april", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "5": { title: "may", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "6": { title: "june", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "7": { title: "july", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "8": { title: "august", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "9": { title: "september", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "10": { title: "october", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "11": { title: "november", costs: [], monthCosts: 0, balance: 0, budget: 0 },
  "12": { title: "december", costs: [], monthCosts: 0, balance: 0, budget: 0 },
};

export const CURRENT_YEAR = new Date().getFullYear();
