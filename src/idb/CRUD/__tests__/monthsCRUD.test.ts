import { describe, it, expect, beforeEach } from "vitest";
import { createMonth, getAll, getAllByYear, getById, updateById, deleteById } from "../monthsCRUD";
import { openDB, deleteDB } from "../../IDBManager";
import { createTrackerId } from "@/lib/types/brand";

const trackerId = createTrackerId("test-months-crud");

describe("monthsCRUD", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("createMonth + getById: round-trip", async () => {
    const id = await createMonth(trackerId, 2025, 1, "January", 0, 0);
    const result = await getById(trackerId, id);
    expect(result).toBeDefined();
    expect(result!.year).toBe(2025);
    expect(result!.orderNo).toBe(1);
    expect(result!.title).toBe("January");
  });

  it("getAll returns all months", async () => {
    await createMonth(trackerId, 2025, 1, "January", 0, 0);
    await createMonth(trackerId, 2025, 2, "February", 0, 0);
    await createMonth(trackerId, 2024, 6, "June", 0, 0);

    const all = await getAll(trackerId);
    expect(Object.keys(all)).toHaveLength(3);
  });

  it("getAllByYear filters by year index", async () => {
    await createMonth(trackerId, 2025, 1, "January", 0, 0);
    await createMonth(trackerId, 2025, 2, "February", 0, 0);
    await createMonth(trackerId, 2024, 6, "June", 0, 0);

    const months2025 = await getAllByYear(trackerId, 2025);
    expect(Object.keys(months2025)).toHaveLength(2);

    const months2024 = await getAllByYear(trackerId, 2024);
    expect(Object.keys(months2024)).toHaveLength(1);
  });

  it("updateById modifies month", async () => {
    const id = await createMonth(trackerId, 2025, 1, "January", 0, 0);
    await updateById(trackerId, {
      id,
      year: 2025,
      orderNo: 1,
      title: "January",
      recordsNo: 5,
      amount: 10000,
    });

    const result = await getById(trackerId, id);
    expect(result!.recordsNo).toBe(5);
    expect(result!.amount).toBe(10000);
  });

  it("deleteById removes month", async () => {
    const id = await createMonth(trackerId, 2025, 1, "January", 0, 0);
    await deleteById(trackerId, id);

    const result = await getById(trackerId, id);
    expect(result).toBeUndefined();
  });
});
