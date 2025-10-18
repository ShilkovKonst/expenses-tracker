/* eslint-disable @typescript-eslint/no-unused-vars */
export type DataType = {
  id: number;
  title: string;
};

export type Data = {
  id: string;
  years: Year[];
  totalAmount: number;
};

export type Year = {
  id: number;
  months: Month[];
  totalAmount: number;
};

export type Month = {
  [K in MonthIdType]: {
    id: K;
    title: Months;
    operations: Operation[];
    totalAmount: number;
  };
}[MonthIdType];

export type Operation = {
  id: string;
  type: "income" | "cost";
  tags: string[];
  description: string;
  amount: number;
  isIncome?: boolean;
};

const MONTHS = {
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

export type MonthIdType = keyof typeof MONTHS;
export type Months = (typeof MONTHS)[MonthIdType];
