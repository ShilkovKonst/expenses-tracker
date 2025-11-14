import { MONTHS } from "@/lib/constants";

export type RecordTag = {
  id: string;
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
    records: MonthRecord[];
    totalAmount: number;
  };
}[MonthIdType];

export type MonthRecord = {
  id: string;
  type: "income" | "cost";
  date: number;
  tags: string[];
  description: string;
  amount: number;
};

export type MonthIdType = keyof typeof MONTHS;
export type Months = (typeof MONTHS)[MonthIdType];

export interface GlobalDataType extends Tracker {
  meta: {
    schemaVersion: number;
    createdAt: string;
    updatedAt: string;
  };
  tagsPool: Record<string, string>;
}
