import { describe, it, expect } from "vitest";
import {
  transformToMonthRecord,
  transformToTagTitle,
  parseToMeta,
  parseToTags,
  parseToYears,
} from "../formDataParsers";
import { createRecordId, createYearId, createMonthId, createTagId } from "@/lib/types/brand";

describe("transformToMonthRecord", () => {
  it("builds a MonthRecord from FormData with branded types", () => {
    const form = new FormData();
    form.set("id", "1");
    form.set("year", "2025");
    form.set("month", "3");
    form.set("day", "15");
    form.set("type", "income");
    form.set("description", "salary");
    form.set("amount", "500000");
    form.append("tags", "1");
    form.append("tags", "2");

    const record = transformToMonthRecord(form);

    expect(record.id).toBe(createRecordId(1));
    expect(record.year).toBe(createYearId(2025));
    expect(record.month).toBe(createMonthId(3));
    expect(record.day).toBe(15);
    expect(record.type).toBe("income");
    expect(record.description).toBe("salary");
    expect(record.amount).toBe(500000);
    expect(record.tags).toEqual([createTagId(1), createTagId(2)]);
  });
});

describe("transformToTagTitle", () => {
  it("extracts title string from FormData", () => {
    const form = new FormData();
    form.set("title", "groceries");
    expect(transformToTagTitle(form)).toBe("groceries");
  });
});

describe("parseToMeta", () => {
  it("parses JSON string to TrackerMeta", () => {
    const meta = {
      id: "tracker-1",
      title: "My Tracker",
      createdAt: "01/01/2025_00:00:00",
      updatedAt: "01/01/2025_00:00:00",
      backupAt: "01/01/2025_00:00:00",
    };
    expect(parseToMeta(JSON.stringify(meta))).toEqual(meta);
  });
});

describe("parseToTags", () => {
  it("parses JSON string to TrackerTags", () => {
    const tags = { "1": "food", "2": "transport" };
    expect(parseToTags(JSON.stringify(tags))).toEqual(tags);
  });
});

describe("parseToYears", () => {
  it("parses JSON string to TrackerYears", () => {
    const years = { "2025": { id: 2025, months: {}, totalAmount: 0 } };
    expect(parseToYears(JSON.stringify(years))).toEqual(years);
  });
});
