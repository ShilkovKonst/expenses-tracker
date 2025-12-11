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
