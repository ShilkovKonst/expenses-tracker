import { describe, it, expect, beforeEach } from "vitest";
import { createMetadata, getMetadata, updateMetadata } from "../metaCRUD";
import { openDB, deleteDB } from "../../IDBManager";
import { createTrackerId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";

const trackerId = createTrackerId("test-meta-crud");

const sampleMeta: TrackerMeta = {
  id: trackerId,
  title: "Test Tracker",
  createdAt: "01/01/2025_00:00:00",
  updatedAt: "01/01/2025_00:00:00",
  backupAt: "01/01/2025_00:00:00",
};

describe("metaCRUD", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("createMetadata + getMetadata: round-trip", async () => {
    await createMetadata(trackerId, sampleMeta);
    const result = await getMetadata(trackerId);
    expect(result).toEqual(sampleMeta);
  });

  it("updateMetadata: changes stored value and returns updatedAt", async () => {
    await createMetadata(trackerId, sampleMeta);

    const updatedMeta: TrackerMeta = {
      ...sampleMeta,
      title: "Updated Tracker",
      updatedAt: "02/01/2025_12:00:00",
    };

    const updatedAt = await updateMetadata(trackerId, updatedMeta);
    expect(updatedAt).toBe("02/01/2025_12:00:00");

    const result = await getMetadata(trackerId);
    expect(result?.title).toBe("Updated Tracker");
  });

  it("getMetadata for non-existent tracker: returns undefined", async () => {
    const result = await getMetadata(trackerId);
    expect(result).toBeUndefined();
  });
});
