import { MONTHS } from "@/constants";
import { MonthId, RecordId, TagId, TrackerId, YearId } from "./brand";

export type TrackerYears = Record<YearId, Year>;
export type TrackerMonths = Record<MonthId, Month>;
export type TrackerTags = Record<TagId, string>;

export type Tracker = {
  id: TrackerId;
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
  createdAt: string;
  updatedAt: string;
};

export const createTrackerId = (id: string): TrackerId => id as TrackerId;
export const createYearId = (id: number): YearId => id as YearId;
export const createMonthId = (id: MonthIdType): MonthId => id as MonthId;
export const createRecordId = (id: number): RecordId => id as RecordId;
export const createTagId = (id: number): TagId => id as TagId;
