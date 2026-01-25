import { MONTHS } from "@/constants";
import { MonthId, RecordId, TagId, TrackerId, YearId } from "./brand";

export type TrackerYears = Record<YearId, Year>;
export type TrackerMonths = Record<MonthId, Month>;
export type TrackerTags = Record<TagId, string>;

export type Tracker = {
  meta: TrackerMeta;
  tags: TrackerTags;
  years: TrackerYears;
  totalAmount: number;
};

export type Year = {
  id: YearId;
  months: TrackerMonths;
  totalAmount: number;
};

export type Month = {
  [K in MonthIdType]: {
    id: MonthId;
    title: Months;
    records: MonthRecord[];
    totalAmount: number;
  };
}[MonthIdType];

export type MonthRecord = {
  id: RecordId;
  year: YearId;
  month: MonthId;
  day: number;
  type: "income" | "cost";
  tags: TagId[];
  description: string;
  amount: number;
};

export type MonthIdType = keyof typeof MONTHS;
export type Months = (typeof MONTHS)[MonthIdType];

export type TrackerMeta = {
  id: TrackerId;
  title: string;
  createdAt: string;
  updatedAt: string;
  backupAt: string;
};