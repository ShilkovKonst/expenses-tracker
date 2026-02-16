import { describe, it, expect, beforeEach } from "vitest";
import {
  createRecord,
  getRecordById,
  getAllRecords,
  getRecordsByYear,
  getRecordsByYearMonth,
  updateRecordById,
  deleteRecordById,
} from "../recordsCRUD";
import { openDB, deleteDB } from "../../IDBManager";
import { createTrackerId, createYearId, createMonthId, createTagId } from "@/lib/types/brand";
import { MonthRecord } from "@/lib/types/dataTypes";

const trackerId = createTrackerId("test-records-crud");

const baseRecord: Omit<MonthRecord, "id"> = {
  year: createYearId(2025),
  month: createMonthId(3),
  day: 15,
  type: "cost",
  tags: [createTagId(1)],
  description: "groceries",
  amount: 5000,
};

describe("recordsCRUD", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("createRecord returns auto-incremented id", async () => {
    const id1 = await createRecord(trackerId, baseRecord);
    const id2 = await createRecord(trackerId, baseRecord);
    expect(typeof id1).toBe("number");
    expect(id2).toBeGreaterThan(id1);
  });

  it("getRecordById returns created record", async () => {
    const id = await createRecord(trackerId, baseRecord);
    const record = await getRecordById(trackerId, id);
    expect(record).toBeDefined();
    expect(record!.description).toBe("groceries");
    expect(record!.amount).toBe(5000);
  });

  it("getAllRecords returns all created records", async () => {
    await createRecord(trackerId, baseRecord);
    await createRecord(trackerId, { ...baseRecord, description: "rent" });
    const records = await getAllRecords(trackerId);
    expect(records).toHaveLength(2);
  });

  it("getRecordsByYear filters by year index", async () => {
    await createRecord(trackerId, baseRecord);
    await createRecord(trackerId, {
      ...baseRecord,
      year: createYearId(2024),
    });

    const records2025 = await getRecordsByYear(trackerId, 2025);
    expect(records2025).toHaveLength(1);
    expect(records2025[0].year).toBe(2025);

    const records2024 = await getRecordsByYear(trackerId, 2024);
    expect(records2024).toHaveLength(1);
  });

  it("getRecordsByYearMonth filters by compound index", async () => {
    await createRecord(trackerId, baseRecord); // 2025, month 3
    await createRecord(trackerId, {
      ...baseRecord,
      month: createMonthId(5),
    });

    const records = await getRecordsByYearMonth(trackerId, 2025, 3);
    expect(records).toHaveLength(1);
    expect(records[0].month).toBe(3);
  });

  it("updateRecordById modifies existing record", async () => {
    const id = await createRecord(trackerId, baseRecord);
    const record = await getRecordById(trackerId, id);

    await updateRecordById(trackerId, {
      ...record!,
      id: id as MonthRecord["id"],
      description: "updated",
    });

    const updated = await getRecordById(trackerId, id);
    expect(updated!.description).toBe("updated");
  });

  it("deleteRecordById removes record", async () => {
    const id = await createRecord(trackerId, baseRecord);
    await deleteRecordById(trackerId, id);
    const record = await getRecordById(trackerId, id);
    expect(record).toBeUndefined();
  });
});
