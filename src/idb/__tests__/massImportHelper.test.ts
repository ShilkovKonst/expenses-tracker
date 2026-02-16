import { describe, it, expect, beforeEach } from "vitest";
import { batchAddTags, batchAddRecords, getAllData } from "../massImportHelper";
import { openDB, deleteDB } from "../IDBManager";
import { createMetadata } from "../CRUD/metaCRUD";
import { getAllTags } from "../CRUD/tagsCRUD";
import { getAllRecords } from "../CRUD/recordsCRUD";
import { createTrackerId, createYearId, createMonthId, createTagId } from "@/lib/types/brand";
import { MonthRecord, TrackerMeta } from "@/lib/types/dataTypes";

const trackerId = createTrackerId("test-mass-import");

describe("massImportHelper", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("batchAddTags adds multiple tags in one transaction", async () => {
    await batchAddTags(trackerId, ["food", "transport", "rent"]);
    const tags = await getAllTags(trackerId);
    const titles = Object.values(tags);
    expect(titles).toContain("food");
    expect(titles).toContain("transport");
    expect(titles).toContain("rent");
    expect(titles).toHaveLength(3);
  });

  it("batchAddRecords adds multiple records in one transaction", async () => {
    const records: Omit<MonthRecord, "id">[] = [
      {
        year: createYearId(2025),
        month: createMonthId(1),
        day: 1,
        type: "cost",
        tags: [createTagId(1)],
        description: "groceries",
        amount: 5000,
      },
      {
        year: createYearId(2025),
        month: createMonthId(1),
        day: 2,
        type: "income",
        tags: [],
        description: "salary",
        amount: 100000,
      },
    ];

    await batchAddRecords(trackerId, records);
    const allRecords = await getAllRecords(trackerId);
    expect(allRecords).toHaveLength(2);
  });

  it("getAllData returns full Tracker object", async () => {
    const meta: TrackerMeta = {
      id: trackerId,
      title: "Test Tracker",
      createdAt: "01/01/2025_00:00:00",
      updatedAt: "01/01/2025_00:00:00",
      backupAt: "01/01/2025_00:00:00",
    };
    await createMetadata(trackerId, meta);
    await batchAddTags(trackerId, ["food"]);
    await batchAddRecords(trackerId, [
      {
        year: createYearId(2025),
        month: createMonthId(3),
        day: 10,
        type: "cost",
        tags: [createTagId(1)],
        description: "lunch",
        amount: 1500,
      },
    ]);

    const data = await getAllData(trackerId);
    expect(data.meta).toEqual(meta);
    expect(Object.values(data.tags)).toContain("food");
    // years should be populated with months structure
    expect(data.years).toBeDefined();
    expect(typeof data.totalAmount).toBe("number");
  });
});
