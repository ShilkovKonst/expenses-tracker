/* eslint-disable @typescript-eslint/no-unused-vars */
export type TagType = {
  id: number;
  type: string;
  withBudget?: boolean;
};

export type FormDataType = {
  id: string;
  years: YearFormType[];
  totalCosts: number;
};

export type YearFormType = {
  id: number;
  months: MonthFormType[];
  costs: number;
  budget?: number;
  balance?: number;
};

export type CostFormType = {
  id: number;
  type: string;
  description: string;
  amount: number;
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

export type MonthFormType = {
  [K in MonthIdType]: {
    id: K;
    title: Months;
    costs: CostFormType[];
    costsAmount: number;
    budget?: number;
    balance?: number;
  };
}[MonthIdType];
