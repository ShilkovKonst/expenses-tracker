import { describe, it, expect, beforeEach } from "vitest";
import { createYear, getAll, getById, updateById, deleteById } from "../yearsCRUD";
import { openDB, deleteDB } from "../../IDBManager";
import { createTrackerId } from "@/lib/types/brand";
import { YearIDBType } from "../../types";

const trackerId = createTrackerId("test-years-crud");

const year2025: YearIDBType = { id: 2025, recordsNo: 5, amount: 10000 };
const year2024: YearIDBType = { id: 2024, recordsNo: 3, amount: 5000 };

describe("yearsCRUD", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("createYear + getById: round-trip", async () => {
    await createYear(trackerId, year2025);
    const result = await getById(trackerId, 2025);
    expect(result).toEqual(year2025);
  });

  it("getAll returns id-keyed map", async () => {
    await createYear(trackerId, year2025);
    await createYear(trackerId, year2024);

    const all = await getAll(trackerId);
    expect(Object.keys(all)).toHaveLength(2);
    expect(all[2025]).toEqual(year2025);
    expect(all[2024]).toEqual(year2024);
  });

  it("updateById modifies year", async () => {
    await createYear(trackerId, year2025);
    await updateById(trackerId, { ...year2025, recordsNo: 10 });

    const result = await getById(trackerId, 2025);
    expect(result!.recordsNo).toBe(10);
  });

  it("deleteById removes year", async () => {
    await createYear(trackerId, year2025);
    await deleteById(trackerId, 2025);

    const result = await getById(trackerId, 2025);
    expect(result).toBeUndefined();
  });
});
