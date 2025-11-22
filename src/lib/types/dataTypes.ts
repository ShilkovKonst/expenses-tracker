import { MONTHS } from "@/constants";

export type RecordTag = {
  id: number;
  title: string;
};

export type TrackerName = {
  id: number;
  title: string;
};

export type Tracker = {
  id: string;
  years: Record<number, Year>;
  totalAmount: number;
};

export type Year = {
  id: number;
  months: Record<number, Month>;
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

export type MetadataType = {
  createdAt: string;
  updatedAt: string;
};

export interface GlobalDataType extends Tracker {
  meta: MetadataType;
  tagsPool: Record<number, string>;
}
