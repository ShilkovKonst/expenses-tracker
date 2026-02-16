import { validate, tryValidate } from "../dataValidator";
import { createTrackerId, createYearId, createMonthId, createRecordId, createTagId } from "../../types/brand";
import type { Tracker } from "../../types/dataTypes";

function buildValidTracker(): Tracker {
  return {
    meta: {
      id: createTrackerId("test-tracker"),
      title: "Test",
      createdAt: "01/01/2024_00:00:00",
      updatedAt: "01/01/2024_00:00:00",
      backupAt: "01/01/2024_00:00:00",
    },
    tags: {
      [createTagId(1)]: "Food",
      [createTagId(2)]: "Transport",
    } as Tracker["tags"],
    years: {
      [createYearId(2024)]: {
        id: createYearId(2024),
        totalAmount: 500,
        months: {
          [createMonthId(1)]: {
            id: createMonthId(1),
            title: "January",
            totalAmount: 500,
            records: [
              {
                id: createRecordId(1),
                year: createYearId(2024),
                month: createMonthId(1),
                day: 15,
                type: "income" as const,
                tags: [createTagId(1)],
                description: "Salary",
                amount: 500,
              },
            ],
          },
        },
      },
    } as Tracker["years"],
    totalAmount: 500,
  };
}

describe("validate", () => {
  it("returns success for a valid tracker", () => {
    const result = validate(buildValidTracker(), "en");
    expect(result.success).toBe(true);
  });

  it("fails when data is not an object", () => {
    const result = validate(null, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("data");
    }
  });

  it("fails when meta is missing", () => {
    const tracker = buildValidTracker();
    const { meta: _, ...noMeta } = tracker;
    const result = validate(noMeta, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("meta");
      expect(result.message).toContain("must be an object");
    }
  });

  it("fails when tags is missing", () => {
    const tracker = buildValidTracker();
    const { tags: _, ...noTags } = tracker;
    const result = validate(noTags, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("tags");
    }
  });

  it("fails when years is missing", () => {
    const tracker = buildValidTracker();
    const { years: _, ...noYears } = tracker;
    const result = validate(noYears, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("years");
    }
  });

  it("fails when totalAmount is not a number", () => {
    const tracker = buildValidTracker() as Record<string, unknown>;
    tracker.totalAmount = "not a number";
    const result = validate(tracker, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("totalAmount");
      expect(result.message).toContain("must be a number");
    }
  });

  it("fails when record type is invalid", () => {
    const tracker = buildValidTracker();
    const year = Object.values(tracker.years)[0];
    const month = Object.values(year.months)[0];
    (month.records[0] as Record<string, unknown>).type = "expense";
    const result = validate(tracker, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("type must be 'income' or 'cost'");
    }
  });

  it("fails when meta has unknown keys", () => {
    const tracker = buildValidTracker();
    (tracker.meta as Record<string, unknown>).extraKey = "oops";
    const result = validate(tracker, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("meta");
      expect(result.message).toContain("unknown keys");
    }
  });

  it("fails when a record references a non-existent tag", () => {
    const tracker = buildValidTracker();
    const year = Object.values(tracker.years)[0];
    const month = Object.values(year.months)[0];
    month.records[0].tags = [createTagId(999)];
    const result = validate(tracker, "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("does not exist in tagsPool");
    }
  });
});

describe("tryValidate", () => {
  it("returns parse error for invalid JSON", () => {
    const result = tryValidate("{invalid json", "en");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.path).toBe("parse");
      expect(result.message).toBe("Invalid format");
    }
  });

  it("validates parsed JSON", () => {
    const tracker = buildValidTracker();
    const result = tryValidate(JSON.stringify(tracker), "en");
    expect(result.success).toBe(true);
  });
});
