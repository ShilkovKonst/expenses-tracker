import { populateYears } from "../yearsTransformer";
import { createYearId, createMonthId, createRecordId, createTagId } from "../../types/brand";
import type { MonthRecord } from "../../types/dataTypes";

function makeRecord(overrides: Partial<MonthRecord> = {}): MonthRecord {
  return {
    id: createRecordId(1),
    year: createYearId(2024),
    month: createMonthId(1),
    day: 15,
    type: "income",
    tags: [createTagId(1)],
    description: "Test",
    amount: 1000,
    ...overrides,
  };
}

describe("populateYears", () => {
  it("returns current year with 12 empty months when no records", () => {
    const years = populateYears([]);
    const currentYear = new Date().getFullYear();
    expect(years[currentYear]).toBeDefined();
    expect(Object.keys(years[currentYear].months)).toHaveLength(12);
    expect(years[currentYear].totalAmount).toBe(0);
  });

  it("places records into correct year and month", () => {
    const record = makeRecord({ year: createYearId(2024), month: createMonthId(3) });
    const years = populateYears([record]);

    expect(years[2024]).toBeDefined();
    expect(years[2024].months[createMonthId(3)].records).toHaveLength(1);
    expect(years[2024].months[createMonthId(3)].records[0]).toBe(record);
  });

  it("fills all 12 months even when records only exist in some", () => {
    const record = makeRecord({ year: createYearId(2024), month: createMonthId(6) });
    const years = populateYears([record]);

    expect(Object.keys(years[2024].months)).toHaveLength(12);
    expect(years[2024].months[createMonthId(1)].records).toHaveLength(0);
    expect(years[2024].months[createMonthId(6)].records).toHaveLength(1);
  });

  it("income adds to totalAmount", () => {
    const record = makeRecord({ type: "income", amount: 500 });
    const years = populateYears([record]);

    expect(years[2024].totalAmount).toBe(500);
    expect(years[2024].months[createMonthId(1)].totalAmount).toBe(500);
  });

  it("cost subtracts from totalAmount", () => {
    const record = makeRecord({ type: "cost", amount: 300 });
    const years = populateYears([record]);

    expect(years[2024].totalAmount).toBe(-300);
    expect(years[2024].months[createMonthId(1)].totalAmount).toBe(-300);
  });

  it("aggregates across multiple years and months", () => {
    const records = [
      makeRecord({ id: createRecordId(1), year: createYearId(2023), month: createMonthId(1), type: "income", amount: 1000 }),
      makeRecord({ id: createRecordId(2), year: createYearId(2023), month: createMonthId(1), type: "cost", amount: 200 }),
      makeRecord({ id: createRecordId(3), year: createYearId(2024), month: createMonthId(6), type: "income", amount: 500 }),
    ];
    const years = populateYears(records);

    expect(years[2023].totalAmount).toBe(800); // 1000 - 200
    expect(years[2023].months[createMonthId(1)].totalAmount).toBe(800);
    expect(years[2024].months[createMonthId(6)].totalAmount).toBe(500);
    expect(years[2024].totalAmount).toBe(500);
  });

  it("income and cost in same month can net to zero", () => {
    const records = [
      makeRecord({ id: createRecordId(1), type: "income", amount: 500 }),
      makeRecord({ id: createRecordId(2), type: "cost", amount: 500 }),
    ];
    const years = populateYears(records);

    expect(years[2024].months[createMonthId(1)].totalAmount).toBe(0);
    expect(years[2024].totalAmount).toBe(0);
  });

  it("costs exceeding income result in negative totalAmount", () => {
    const records = [
      makeRecord({ id: createRecordId(1), type: "income", amount: 100 }),
      makeRecord({ id: createRecordId(2), type: "cost", amount: 400 }),
      makeRecord({ id: createRecordId(3), type: "cost", amount: 300 }),
    ];
    const years = populateYears(records);

    expect(years[2024].months[createMonthId(1)].totalAmount).toBe(-600); // 100 - 400 - 300
    expect(years[2024].totalAmount).toBe(-600);
  });
});
