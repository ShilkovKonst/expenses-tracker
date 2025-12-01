import { MONTHS } from "@/constants";

export type TrackerYears = Record<number, Year>;
export type TrackerMonths = Record<number, Month>;
export type TrackerTags = Record<number, string>;

export type Tracker = {
  id: string;
  totalAmount: number;
};

export type Year = {
  id: number;
  months: TrackerMonths;
  totalAmount: number;
};

export type Month = {
  [K in MonthIdType]: {
    id: K;
    title: Months;
    records: MonthRecord[];
    totalAmount: number;
  };
}[MonthIdType];

export type MonthRecord = {
  id: number;
  year: number;
  month: number;
  day: number;
  type: "income" | "cost";
  tags: number[];
  description: string;
  amount: number;
};

export type MonthIdType = keyof typeof MONTHS;
export type Months = (typeof MONTHS)[MonthIdType];

export type TrackerMeta = {
  createdAt: string;
  updatedAt: string;
};

export interface GlobalDataType extends Tracker {
  meta: TrackerMeta;
  tags: TrackerTags;
  years: TrackerYears;
}
