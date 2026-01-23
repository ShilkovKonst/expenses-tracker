import { MonthIdType } from "./dataTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __brand: unique symbol;
type ids = "trackerId" | "yearId" | "monthId" | "recordId" | "tagId";
type Brand<T, B extends ids> = T & { __brand: B };

export type TrackerId = Brand<string, "trackerId">;
export type YearId = Brand<number, "yearId">;
export type MonthId = Brand<MonthIdType, "monthId">;
export type RecordId = Brand<number, "recordId">;
export type TagId = Brand<number, "tagId">;

export const createTrackerId = (id: string): TrackerId => id as TrackerId;
export const createYearId = (id: number): YearId => id as YearId;
export const createMonthId = (id: MonthIdType): MonthId => id as MonthId;
export const createRecordId = (id: number): RecordId => id as RecordId;
export const createTagId = (id: number): TagId => id as TagId;
