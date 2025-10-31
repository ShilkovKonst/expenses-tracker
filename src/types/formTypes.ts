/* eslint-disable @typescript-eslint/no-unused-vars */
export type RecordTag = {
  tracker: string;
  title: string;
};

export type TrackerName = {
  id: number;
  title: string;
};

export type Tracker = {
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
    records: Record[];
    totalAmount: number;
  };
}[MonthIdType];

export type Record = {
  id: string;
  type: "income" | "cost";
  date: number;
  tags: RecordTag[];
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
