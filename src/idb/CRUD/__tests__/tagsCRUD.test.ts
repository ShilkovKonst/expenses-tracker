import { describe, it, expect, beforeEach } from "vitest";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
  deleteTagByIdRecordsCleanup,
} from "../tagsCRUD";
import { createRecord } from "../recordsCRUD";
import { createMetadata } from "../metaCRUD";
import { openDB, deleteDB } from "../../IDBManager";
import { createTrackerId, createYearId, createMonthId, createTagId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";

const trackerId = createTrackerId("test-tags-crud");

describe("tagsCRUD", () => {
  beforeEach(async () => {
    await deleteDB(trackerId).catch(() => {});
    await openDB(trackerId);
  });

  it("createTag returns auto-incremented id", async () => {
    const id1 = await createTag(trackerId, "food");
    const id2 = await createTag(trackerId, "transport");
    expect(typeof id1).toBe("number");
    expect(id2).toBeGreaterThan(id1);
  });

  it("getAllTags returns id→title map", async () => {
    const id1 = await createTag(trackerId, "food");
    const id2 = await createTag(trackerId, "transport");
    const tags = await getAllTags(trackerId);
    expect(tags[id1]).toBe("food");
    expect(tags[id2]).toBe("transport");
  });

  it("getTagById returns tag object", async () => {
    const id = await createTag(trackerId, "food");
    const tag = await getTagById(trackerId, id);
    expect(tag).toBeDefined();
    expect(tag!.id).toBe(id);
    expect(tag!.title).toBe("food");
  });

  it("updateTagById changes title", async () => {
    const id = await createTag(trackerId, "food");
    await updateTagById(trackerId, id, "groceries");
    const tag = await getTagById(trackerId, id);
    expect(tag!.title).toBe("groceries");
  });

  it("deleteTagById removes tag", async () => {
    const id = await createTag(trackerId, "food");
    await deleteTagById(trackerId, id);
    const tag = await getTagById(trackerId, id);
    expect(tag).toBeUndefined();
  });

  it("deleteTagByIdRecordsCleanup removes tag AND cleans records", async () => {
    const meta: TrackerMeta = {
      id: trackerId,
      title: "Test",
      createdAt: "01/01/2025_00:00:00",
      updatedAt: "01/01/2025_00:00:00",
      backupAt: "01/01/2025_00:00:00",
    };
    await createMetadata(trackerId, meta);

    const tagId = await createTag(trackerId, "food");
    const otherTagId = await createTag(trackerId, "other");

    // Create a record that references the tag
    const recordId = await createRecord(trackerId, {
      year: createYearId(2025),
      month: createMonthId(1),
      day: 10,
      type: "cost",
      tags: [createTagId(tagId), createTagId(otherTagId)],
      description: "test",
      amount: 1000,
    });

    await deleteTagByIdRecordsCleanup(trackerId, tagId);

    // Tag should be deleted
    const tag = await getTagById(trackerId, tagId);
    expect(tag).toBeUndefined();

    // Record should still exist but without the deleted tag
    const { getRecordById } = await import("../recordsCRUD");
    const record = await getRecordById(trackerId, recordId);
    expect(record).toBeDefined();
    expect(record!.tags).not.toContain(tagId);
    expect(record!.tags).toContain(otherTagId);
  });
});
